# DLQ Lambda code (older copy)

The copy-ready, current source is [lambda-dlq-updated.mjs](./lambda-dlq-updated.mjs). Use that file for deployment; this document preserves the earlier inline version for reference and may not include the latest cleanup-job failure-state handling.

This replaces the supplied DLQ handler. It supports the current upload producer format (`tempKeys[]`), the older single `tempKey` format, Board and Product upload failures, and `DELETE_ASSETS` cleanup messages. It does not create another Lambda; deploy this code to the existing DLQ Lambda.

```js
import { S3Client, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { createClient } from '@supabase/supabase-js';

const s3 = new S3Client({});
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET_NAME = process.env.BUCKET_NAME;
const SOURCE_PREFIX = process.env.SOURCE_PREFIX || 'original/';
const TARGET_474_PREFIX = process.env.TARGET_474_PREFIX || '474x/';
const TARGET_736_PREFIX = process.env.TARGET_736_PREFIX || '736x/';

if (!SUPABASE_URL || !SUPABASE_KEY || !BUCKET_NAME) {
  throw new Error('Missing Supabase or S3 environment variables');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const SUPPORTED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'avif'];

const assertSafeBaseKey = (key) => {
  if (
    typeof key !== 'string' ||
    !key ||
    key.includes('/') ||
    key.includes('\\') ||
    key.includes('..')
  ) {
    throw new Error(`Invalid base image key: ${key}`);
  }
};

const assertSafeTempKey = (key) => {
  if (
    typeof key !== 'string' ||
    !/^temp\/[^/\\]+$/.test(key) ||
    key.includes('..')
  ) {
    throw new Error(`Invalid temporary image key: ${key}`);
  }
};

const expandBaseKey = (baseKey) => {
  assertSafeBaseKey(baseKey);
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

const expandFailedUpload = (tempKey) => {
  assertSafeTempKey(tempKey);
  const filename = tempKey.slice('temp/'.length);
  // The processor currently uses the portion before the first dot as its stem.
  const stem = filename.split('.')[0];
  if (!stem) throw new Error(`Invalid uploaded filename: ${filename}`);
  return [
    tempKey,
    ...[SOURCE_PREFIX, TARGET_474_PREFIX, TARGET_736_PREFIX].flatMap((prefix) =>
      SUPPORTED_EXTENSIONS.map((ext) => `${prefix}${stem}.${ext}`)
    )
  ];
};

const deleteS3Keys = async (inputKeys) => {
  const keys = Array.from(new Set(inputKeys));
  for (let offset = 0; offset < keys.length; offset += 1000) {
    const result = await s3.send(
      new DeleteObjectsCommand({
        Bucket: BUCKET_NAME,
        Delete: {
          Objects: keys.slice(offset, offset + 1000).map((Key) => ({ Key })),
          Quiet: true
        }
      })
    );
    if (result.Errors?.length) {
      throw new Error(`S3 cleanup errors: ${JSON.stringify(result.Errors)}`);
    }
  }
};

const uploadItemsFromPayload = (payload) => {
  if (Array.isArray(payload.tempKeys)) {
    return payload.tempKeys.map((item) => ({
      tempUrl: item.tempUrl,
      targetId: item.boardImageId?.id
    }));
  }
  // Compatibility with the older single-image DLQ payload.
  if (typeof payload.tempKey === 'string') {
    return [{ tempUrl: payload.tempKey, targetId: payload.targetId }];
  }
  throw new Error('Upload failure payload has no tempKeys/tempKey');
};

const sameUploadedImage = (storedKey, tempUrl) => {
  if (typeof storedKey !== 'string') return false;
  const storedStem = storedKey.split('/').pop()?.split('.')[0];
  const uploadedStem = tempUrl.split('/').pop()?.split('.')[0];
  return !!storedStem && storedStem === uploadedStem;
};

const markUploadFailedAndCollectKeys = async (payload, items) => {
  const tableType = payload.tableType || 'PRODUCT';
  const keysToDelete = [];

  if (tableType === 'PRODUCT') {
    const { data: product, error: readError } = await supabase
      .from('Product')
      .select('id,status,image')
      .eq('id', payload.feenId)
      .maybeSingle();
    if (readError) throw readError;

    const item = items[0];
    const sameCurrentImage =
      product && sameUploadedImage(product.image, item.tempUrl);
    const alreadyReady = product?.status === 'READY' && sameCurrentImage;

    if (sameCurrentImage && product.status === 'PROCESSING') {
      const { error } = await supabase
        .from('Product')
        .update({ status: 'FAILED', updatedAt: new Date().toISOString() })
        .eq('id', payload.feenId)
        .eq('status', 'PROCESSING');
      if (error) throw error;
    }

    // If this failed image had already created a Pro version, do not leave
    // that unprocessed file as the active version. Retired versions remain
    // downloadable only when they have existing entitlements.
    if (!alreadyReady) {
      const { data: activeVersions, error: versionReadError } = await supabase
        .from('ProductVersion')
        .select('id,imageKey')
        .eq('productId', payload.feenId)
        .eq('status', 'ACTIVE');
      if (versionReadError) throw versionReadError;

      const failedVersionIds = (activeVersions ?? [])
        .filter((version) => sameUploadedImage(version.imageKey, item.tempUrl))
        .map((version) => version.id);
      if (failedVersionIds.length) {
        const { error: versionUpdateError } = await supabase
          .from('ProductVersion')
          .update({ status: 'RETIRED' })
          .in('id', failedVersionIds)
          .eq('status', 'ACTIVE');
        if (versionUpdateError) throw versionUpdateError;
      }
    }

    keysToDelete.push(
      ...(alreadyReady ? [item.tempUrl] : expandFailedUpload(item.tempUrl))
    );
    return keysToDelete;
  }

  if (tableType === 'BOARD') {
    for (const item of items) {
      if (!item.targetId)
        throw new Error('Board DLQ item has no BoardImage ID');
      const { data: boardImage, error: readError } = await supabase
        .from('BoardImage')
        .select('id,status,image')
        .eq('id', item.targetId)
        .eq('boardId', payload.feenId)
        .maybeSingle();
      if (readError) throw readError;

      const sameCurrentImage =
        boardImage && sameUploadedImage(boardImage.image, item.tempUrl);
      const alreadyReady = boardImage?.status === 'READY' && sameCurrentImage;
      if (sameCurrentImage && boardImage.status === 'PROCESSING') {
        const { error } = await supabase
          .from('BoardImage')
          .update({ status: 'FAILED' })
          .eq('id', item.targetId)
          .eq('boardId', payload.feenId)
          .eq('status', 'PROCESSING');
        if (error) throw error;
      }

      keysToDelete.push(
        ...(alreadyReady ? [item.tempUrl] : expandFailedUpload(item.tempUrl))
      );
    }
    return keysToDelete;
  }

  throw new Error(`Unknown upload tableType: ${tableType}`);
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

  for (const key of payload.temporaryKeys) assertSafeTempKey(key);
  const keys = [
    ...payload.baseKeys.flatMap(expandBaseKey),
    ...payload.temporaryKeys
  ];
  await deleteS3Keys(keys);

  const { error: updateError } = await supabase
    .from('StorageCleanupJob')
    .update({ status: 'COMPLETED', lastError: null })
    .eq('id', payload.jobId);
  if (updateError) throw updateError;
};

export const handler = async (event) => {
  const batchItemFailures = [];

  for (const sqsRecord of event.Records ?? []) {
    try {
      const payload = JSON.parse(sqsRecord.body);

      if (payload.operation === 'DELETE_ASSETS') {
        await handleDeleteAssets(payload);
        continue;
      }

      // Existing image-processing messages have no operation field.
      if (payload.operation && payload.operation !== 'PROCESS_IMAGES') {
        throw new Error(`Unknown DLQ operation: ${payload.operation}`);
      }

      if (!payload.feenId) throw new Error('Upload DLQ message has no feenId');
      const items = uploadItemsFromPayload(payload);
      for (const item of items) assertSafeTempKey(item.tempUrl);

      const keysToDelete = await markUploadFailedAndCollectKeys(payload, items);
      // Throw on S3 per-object errors so the DLQ event source retries this record.
      await deleteS3Keys(keysToDelete);
      console.log(`[DLQ COMPLETED] ${payload.tableType} ${payload.feenId}`);
    } catch (error) {
      console.error(`[DLQ ERROR] ${sqsRecord.messageId}`, error);
      batchItemFailures.push({ itemIdentifier: sqsRecord.messageId });
    }
  }

  return { batchItemFailures };
};
```

Keep the DLQ Lambda trigger enabled, but disable `ReportBatchItemFailures` on this event source mapping. The handler catches per-record processing errors, writes them to CloudWatch, and attempts to record `DELETE_FAILED` on the Board before returning normally. With partial batch reporting disabled, the returned `batchItemFailures` list is ignored and the message is acknowledged, so a caught processing error does not loop. A Lambda timeout, crash, or uncaught invocation error can still cause SQS redelivery. The DLQ message does not return to the original source queue automatically.

Upload failures update `Product.status` or each referenced `BoardImage.status` to `FAILED` only while it is still `PROCESSING`. If processing had already completed before a later cleanup step failed, the handler removes only the temp object and preserves the ready image. `DELETE_ASSETS` failures never mark Product or Board content as failed; after S3 deletion succeeds they mark the cleanup outbox row `COMPLETED`.
