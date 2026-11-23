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
  const stem = baseKey.split('.')[0];
  if (!stem) throw new Error(`Invalid base image key: ${baseKey}`);
  return [SOURCE_PREFIX, TARGET_474_PREFIX, TARGET_736_PREFIX].flatMap(
    (prefix) => SUPPORTED_EXTENSIONS.map((extension) => `${prefix}${stem}.${extension}`)
  );
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

const handleDeleteBoard = async (payload) => {
  if (!Number.isInteger(payload.boardId) || payload.boardId <= 0) {
    throw new Error('Invalid DELETE_BOARD payload');
  }

  const { data: board, error: lookupError } = await supabase
    .from('Board')
    .select('id,deletionStatus')
    .eq('id', payload.boardId)
    .maybeSingle();
  if (lookupError) throw lookupError;
  if (!board) return;
  if (!['DELETE_PENDING', 'DELETE_FAILED'].includes(board.deletionStatus)) {
    console.warn(
      `[DLQ DELETE_BOARD SKIPPED] Board ${payload.boardId} is ${board.deletionStatus}`
    );
    return;
  }

  const { data: images, error: imagesError } = await supabase
    .from('BoardImage')
    .select('image,status')
    .eq('boardId', payload.boardId);
  if (imagesError) throw imagesError;
  const baseKeys = images.map((image) => image.image);
  const temporaryKeys = images
    .filter((image) => image.status !== 'READY')
    .map((image) => `temp/${image.image}`);
  for (const key of temporaryKeys) assertSafeTempKey(key);
  await deleteS3Keys([
    ...baseKeys.flatMap(expandBaseKey),
    ...temporaryKeys
  ]);

  const { data: deleted, error: deleteError } = await supabase
    .from('Board')
    .delete()
    .eq('id', payload.boardId)
    .in('deletionStatus', ['DELETE_PENDING', 'DELETE_FAILED'])
    .select('id');
  if (deleteError) throw deleteError;
  if (!deleted?.length) {
    const { data: currentBoard, error: stateError } = await supabase
      .from('Board')
      .select('id,deletionStatus')
      .eq('id', payload.boardId)
      .maybeSingle();
    if (stateError) throw stateError;
    if (currentBoard) {
      throw new Error(
        `Board ${payload.boardId} left deletion state before physical deletion`
      );
    }
  }
};

export const handler = async (event) => {
  const batchItemFailures = [];

  for (const sqsRecord of event.Records ?? []) {
    let payload;
    try {
      payload = JSON.parse(sqsRecord.body);

      if (payload.operation === 'DELETE_ASSETS') {
        await handleDeleteAssets(payload);
        continue;
      }
      if (payload.operation === 'DELETE_BOARD') {
        await handleDeleteBoard(payload);
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
      if (payload?.operation === 'DELETE_ASSETS' && payload.jobId) {
        try {
          const { error: stateError } = await supabase
            .from('StorageCleanupJob')
            .update({
              status: 'FAILED',
              lastError:
                error instanceof Error
                  ? error.message.slice(0, 1000)
                  : 'Unknown DLQ cleanup error'
            })
            .eq('id', payload.jobId)
            .neq('status', 'COMPLETED');
          if (stateError) throw stateError;
        } catch (stateError) {
          console.error(
            `[DLQ STATE UPDATE ERROR] cleanup job ${payload.jobId}`,
            stateError
          );
        }
      }
      if (payload?.operation === 'DELETE_BOARD' && payload.boardId) {
        try {
          const { error: stateError } = await supabase
            .from('Board')
            .update({
              deletionStatus: 'DELETE_FAILED',
              deletionError:
                error instanceof Error
                  ? error.message.slice(0, 1000)
                  : 'Unknown DLQ Board deletion error',
              deletionLastAttemptAt: new Date().toISOString()
            })
            .eq('id', payload.boardId)
            .in('deletionStatus', ['DELETE_PENDING', 'DELETE_FAILED']);
          if (stateError) throw stateError;
        } catch (stateError) {
          console.error(
            `[DLQ STATE UPDATE ERROR] Board ${payload.boardId}`,
            stateError
          );
        }
      }
      batchItemFailures.push({ itemIdentifier: sqsRecord.messageId });
    }
  }

  return { batchItemFailures };
};
