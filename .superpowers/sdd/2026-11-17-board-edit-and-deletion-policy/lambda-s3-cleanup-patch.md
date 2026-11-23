# AWS Lambda S3 cleanup integration

The complete replacement main processor is [lambda-main-updated.mjs](./lambda-main-updated.mjs). Deploy it to the existing image-processing Lambda. It preserves the current upload payload (`{ feenId, tempKeys, tableType }`, with no `operation` field), adds `DELETE_ASSETS` for individual removed images, and adds `DELETE_BOARD` for physical Board deletion after S3 cleanup.

The complete replacement DLQ handler is [lambda-dlq-updated.mjs](./lambda-dlq-updated.mjs). It handles current `tempKeys[]`, legacy `tempKey`, Product and Board upload failures, `DELETE_ASSETS`, and `DELETE_BOARD`. A failed Board deletion remains hidden in DB as `DELETE_FAILED`.

Whole-Board deletion uses this message shape:

```json
{
  "operation": "DELETE_BOARD",
  "boardId": 123
}
```

The Lambda reads image keys from the still-existing Board and BoardImage rows. It deletes all supported original/474x/736x variants and removes `temp/<image>` for non-READY images. It physically deletes the Board row only after S3 reports no per-object deletion errors; the existing database cascades remove comments, tags, hit, and image rows.

## Apply order

1. Apply both Prisma migrations before deploying application code.
2. Replace the source of the existing image-processing Lambda with `lambda-main-updated.mjs` and deploy it. Existing upload producers and their payload remain unchanged.
3. Replace the source of the existing DLQ Lambda with `lambda-dlq-updated.mjs` and deploy it.
4. Keep `ReportBatchItemFailures` enabled on the **main processing Lambda** mapping so only failed source-queue records retry. Keep the DLQ Lambda trigger enabled, but disable `ReportBatchItemFailures` on the **DLQ Lambda** mapping. Its caught error path logs the error, records `DELETE_FAILED`, and returns normally; with partial batch reporting disabled, `batchItemFailures` is ignored and the record is acknowledged instead of retried. A Lambda timeout, crash, or uncaught invocation error can still cause redelivery.
5. Do not connect an automatic scheduler to `POST /api/cron/board-deletions` yet. After the website is deployed and operating, a developer can invoke it manually with `Authorization: Bearer <CRON_SECRET>` when a `DELETE_PENDING`/`DELETE_FAILED` row needs re-dispatch. The endpoint resends jobs; it does not delete Board rows. If a scheduler is added later, review its automatic retries of `DELETE_FAILED` first.
6. Confirm the main queue redrive policy points to the intended DLQ and retain an appropriate DLQ retention period for invocation-level failures that are not handled by the Lambda catch path.

The Lambda source was prepared in this workspace. The user has since deployed and verified the Lambda/web normal flow and confirmed the deletion failure log and DB `DELETE_FAILED` state. The migration command and AWS console settings were not independently inspected from this workspace; the runtime verification confirms the relevant flow was available.

## SQS message

```json
{
  "operation": "DELETE_ASSETS",
  "jobId": "cuid-from-StorageCleanupJob",
  "baseKeys": ["board-image.jpg"],
  "temporaryKeys": ["temp/ab12-image.jpg"]
}
```

`baseKeys` are the bare image keys stored in `BoardImage.image` / `Product.image` (`image.jpg`), not prefixed keys. `temporaryKeys` are complete S3 keys. Product withdrawal does not emit this operation; Pro version objects must remain downloadable.

## Add imports and helpers

Add `DeleteObjectsCommand` to the S3 import:

```js
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand
} from '@aws-sdk/client-s3';
```

Add these helpers after the prefix constants. They delete idempotently, check per-key S3 errors, and remove the `.jpg` variant produced when the uploaded filename used `.jpeg`:

```js
const deleteS3Keys = async (keys) => {
  const uniqueKeys = [...new Set(keys.filter(Boolean))];
  for (let offset = 0; offset < uniqueKeys.length; offset += 1000) {
    const chunk = uniqueKeys.slice(offset, offset + 1000);
    const result = await s3.send(
      new DeleteObjectsCommand({
        Bucket: BUCKET_NAME,
        Delete: { Objects: chunk.map((Key) => ({ Key })), Quiet: true }
      })
    );
    if (result.Errors?.length) {
      throw new Error(
        `S3 object deletion failed: ${JSON.stringify(result.Errors)}`
      );
    }
  }
};

const keysForBaseImage = (baseKey) => {
  if (
    typeof baseKey !== 'string' ||
    !baseKey ||
    baseKey.includes('/') ||
    baseKey.includes('\\') ||
    baseKey.includes('..')
  ) {
    throw new Error(`Invalid image base key: ${baseKey}`);
  }
  const variants = new Set([baseKey]);
  if (/\.jpeg$/i.test(baseKey)) {
    variants.add(baseKey.replace(/\.jpeg$/i, '.jpg'));
  }
  return [...variants].flatMap((key) => [
    `${SOURCE_PREFIX}${key}`,
    `${TARGET_474_PREFIX}${key}`,
    `${TARGET_736_PREFIX}${key}`
  ]);
};

const handleDeleteAssets = async (payload) => {
  if (
    !payload.jobId ||
    !Array.isArray(payload.baseKeys) ||
    !Array.isArray(payload.temporaryKeys)
  ) {
    throw new Error('Invalid DELETE_ASSETS payload');
  }
  const { data: job, error: lookupError } = await supabase
    .from('StorageCleanupJob')
    .select('id,status')
    .eq('id', payload.jobId)
    .maybeSingle();
  if (lookupError) throw lookupError;
  if (!job) throw new Error(`Cleanup job not found: ${payload.jobId}`);
  if (job.status === 'COMPLETED') return;

  const keys = [
    ...payload.baseKeys.flatMap(keysForBaseImage),
    ...payload.temporaryKeys
  ];
  for (const key of payload.temporaryKeys) {
    if (
      typeof key !== 'string' ||
      !/^temp\/[^/\\]+$/.test(key) ||
      key.includes('..')
    ) {
      throw new Error(`Invalid temporary key: ${key}`);
    }
  }
  await deleteS3Keys(keys);

  const { error: updateError } = await supabase
    .from('StorageCleanupJob')
    .update({ status: 'COMPLETED', lastError: null })
    .eq('id', payload.jobId);
  if (updateError) throw updateError;
};
```

## Route cleanup messages before the upload validation

In the SQS record loop, immediately after parsing `payload`, handle the new operation. Old upload messages have no `operation`, so they continue through the existing `feenId/tempKeys/tableType` path:

```js
const payload = JSON.parse(sqsRecord.body);
if (payload.operation === "DELETE_ASSETS") {
  await handleDeleteAssets(payload);
  continue;
}
if (payload.operation && payload.operation !== "PROCESS_IMAGES") {
  throw new Error(`Unknown operation: ${payload.operation}`);
}
```

Do not `continue` on a malformed delete message. Throwing adds that SQS record to `batchItemFailures`, allowing normal retry/DLQ handling. Configure the Lambda event source mapping for partial batch responses, as the current handler already returns `batchItemFailures`.

## Prevent upload/delete races

Board deletion cascades `BoardImage` rows before the cleanup message is consumed. Before converting Board temp keys, filter out missing/non-PROCESSING rows:

```js
if (tableType === "BOARD") {
  const eligible = [];
  for (const item of tempKeys) {
    const { data: row, error } = await supabase
      .from("BoardImage")
      .select("id,status")
      .eq("id", item.boardImageId.id)
      .eq("boardId", feenId)
      .maybeSingle();
    if (error) throw error;
    if (!row || row.status !== "PROCESSING") {
      await deleteS3Keys([item.tempUrl]);
      continue;
    }
    eligible.push(item);
  }
  tempKeys = eligible;
  if (tempKeys.length === 0) continue;
}
```

When setting the completed row, use a conditional update and inspect the returned rows:

```js
for (const img of processedImages) {
  const { data, error } = await supabase
    .from('BoardImage')
    .update({
      image: img.assetKey,
      status: 'READY',
      dominantColor: img.dominantColor
    })
    .eq('id', img.targetId)
    .eq('boardId', feenId)
    .eq('status', 'PROCESSING')
    .select('id');
  if (error) throw error;
  if (!data?.length) await deleteS3Keys(img.outputKeys);
}
```

This handles the race where conversion began just before the Board/image deletion. `processSingleImage` should return `outputKeys: [keyOriginal, key474, key736]`, plus `assetKey: \`${fileName}.${finalExt}\``and`targetId`.

`processSingleImage` should return `outputKeys: [keyOriginal, key474, key736]` and `assetKey: \`${fileName}.${finalExt}\``. Persist `assetKey`to`BoardImage.image`and`Product.image`on successful processing; this makes DB keys match actual object names when the input extension is`.jpeg`but the worker writes`.jpg`. If updating a ProductVersion created from that same incoming key, update only the matching `productId + old imageKey` reference. Never delete older ProductVersion keys as part of ordinary withdrawal or replacement.

Finally, move `let dbError = null` above the `try` that owns the per-record `catch`; in the pasted version it is declared inside `try` but referenced from `catch`, which throws a `ReferenceError` on the error-reporting path.
