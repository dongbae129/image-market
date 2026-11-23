import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  CopyObjectCommand,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

const s3 = new S3Client({});

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET_NAME = process.env.BUCKET_NAME;
const SOURCE_PREFIX = process.env.SOURCE_PREFIX || 'original/';
const TARGET_474_PREFIX = process.env.TARGET_474_PREFIX || '474x/';
const TARGET_736_PREFIX = process.env.TARGET_736_PREFIX || '736x/';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !BUCKET_NAME) {
  throw new Error('Missing required Supabase or S3 environment variables');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const SUPPORTED_FORMATS = new Set(['jpeg', 'png', 'webp', 'avif']);
const SUPPORTED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'avif'];
const CONTENT_TYPE_BY_FORMAT = {
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  avif: 'image/avif',
};

const streamToBuffer = async (stream) => {
  if (!stream) throw new Error('S3 GetObject returned an empty body');
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
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

const assertSafeBaseKey = (key) => {
  if (
    typeof key !== 'string' ||
    !key ||
    key.includes('/') ||
    key.includes('\\') ||
    key.includes('..')
  ) {
    throw new Error(`Invalid image base key: ${key}`);
  }
};

const sourceBaseKeyFromTempUrl = (tempUrl) => {
  assertSafeTempKey(tempUrl);
  return tempUrl.slice('temp/'.length);
};

const imageStem = (key) => key.split('/').pop()?.split('.')[0] ?? '';

const matchesImage = (storedKey, tempUrl) =>
  typeof storedKey === 'string' &&
  imageStem(storedKey) !== '' &&
  imageStem(storedKey) === imageStem(tempUrl);

const expandBaseImageKeys = (baseKey) => {
  assertSafeBaseKey(baseKey);
  const stem = imageStem(baseKey);
  if (!stem) throw new Error(`Invalid image base key: ${baseKey}`);
  return [SOURCE_PREFIX, TARGET_474_PREFIX, TARGET_736_PREFIX].flatMap(
    (prefix) => SUPPORTED_EXTENSIONS.map((extension) => `${prefix}${stem}.${extension}`)
  );
};

const deleteS3Keys = async (inputKeys) => {
  const keys = Array.from(new Set(inputKeys.filter(Boolean)));
  for (let offset = 0; offset < keys.length; offset += 1000) {
    const response = await s3.send(
      new DeleteObjectsCommand({
        Bucket: BUCKET_NAME,
        Delete: {
          Objects: keys.slice(offset, offset + 1000).map((Key) => ({ Key })),
          Quiet: true,
        },
      })
    );
    if (response.Errors?.length) {
      throw new Error(`S3 object deletion errors: ${JSON.stringify(response.Errors)}`);
    }
  }
};

const resizeAndUpload = async ({ baseImage, key, width, format }) => {
  const pipeline = baseImage.clone().resize({
    width,
    withoutEnlargement: true,
  });
  let body;
  switch (format) {
    case 'png':
      body = await pipeline.png({ compressionLevel: 9 }).toBuffer();
      break;
    case 'webp':
      body = await pipeline.webp({ quality: 82 }).toBuffer();
      break;
    case 'avif':
      body = await pipeline.avif({ quality: 50 }).toBuffer();
      break;
    case 'jpeg':
    default:
      body = await pipeline.jpeg({ quality: 85, mozjpeg: true }).toBuffer();
  }

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: CONTENT_TYPE_BY_FORMAT[format] || 'image/jpeg',
    })
  );
  return key;
};

const processSingleImage = async (tempKey) => {
  const sourceBaseKey = sourceBaseKeyFromTempUrl(tempKey.tempUrl);
  const filename = sourceBaseKey.split('/').pop();
  const stem = filename.split('.')[0];
  if (!stem) throw new Error(`Invalid image filename: ${filename}`);

  const response = await s3.send(
    new GetObjectCommand({ Bucket: BUCKET_NAME, Key: tempKey.tempUrl })
  );
  const inputBuffer = await streamToBuffer(response.Body);
  const baseImage = sharp(inputBuffer, { failOn: 'none' }).rotate();
  const metadata = await baseImage.metadata();
  const format = metadata.format?.toLowerCase() || 'jpeg';
  if (!SUPPORTED_FORMATS.has(format)) {
    throw new Error(`Unsupported image format: ${format}`);
  }

  const { channels } = await baseImage.stats();
  const [red, green, blue] = channels.map((channel) => Math.round(channel.mean));
  const dominantColor = `#${((1 << 24) | (red << 16) | (green << 8) | blue)
    .toString(16)
    .slice(1)}`;
  const blurBuffer = await baseImage
    .clone()
    .resize(10, 10, { fit: 'inside' })
    .webp({ quality: 20 })
    .toBuffer();
  const lqip = `data:image/webp;base64,${blurBuffer.toString('base64')}`;

  const finalExtension = format === 'jpeg' ? 'jpg' : format;
  const assetKey = `${stem}.${finalExtension}`;
  const originalKey = `${SOURCE_PREFIX}${assetKey}`;
  const key474 = `${TARGET_474_PREFIX}${assetKey}`;
  const key736 = `${TARGET_736_PREFIX}${assetKey}`;
  const copySource = `${BUCKET_NAME}/${encodeURIComponent(tempKey.tempUrl)}`;

  await Promise.all([
    resizeAndUpload({ baseImage, key: key474, width: 474, format }),
    resizeAndUpload({ baseImage, key: key736, width: 736, format }),
    s3.send(
      new CopyObjectCommand({
        Bucket: BUCKET_NAME,
        CopySource: copySource,
        Key: originalKey,
      })
    ),
  ]);

  return {
    targetId: tempKey.boardImageId?.id,
    sourceBaseKey,
    assetKey,
    outputKeys: [originalKey, key474, key736],
    dominantColor,
    lqip,
  };
};

const readProduct = async (productId) => {
  const { data, error } = await supabase
    .from('Product')
    .select('id,status,image')
    .eq('id', productId)
    .maybeSingle();
  if (error) throw error;
  return data;
};

const readBoardImage = async (boardId, boardImageId) => {
  const { data, error } = await supabase
    .from('BoardImage')
    .select('id,status,image')
    .eq('id', boardImageId)
    .eq('boardId', boardId)
    .maybeSingle();
  if (error) throw error;
  return data;
};

const syncActiveProductVersionKey = async (productId, oldKey, canonicalKey) => {
  const { error } = await supabase
    .from('ProductVersion')
    .update({ imageKey: canonicalKey })
    .eq('productId', productId)
    .eq('imageKey', oldKey)
    .eq('status', 'ACTIVE');
  if (error) throw error;
};

const prepareUploadItems = async (payload) => {
  if (!payload.feenId) throw new Error('Upload message has no feenId');
  if (!['PRODUCT', 'BOARD'].includes(payload.tableType)) {
    throw new Error(`Unknown upload tableType: ${payload.tableType}`);
  }
  if (!Array.isArray(payload.tempKeys) || payload.tempKeys.length === 0) {
    throw new Error('Upload message has no tempKeys');
  }
  if (payload.tableType === 'PRODUCT' && payload.tempKeys.length !== 1) {
    throw new Error('Product uploads must contain exactly one image');
  }

  const eligible = [];
  const tempKeysToDelete = [];
  const outputKeysToDelete = [];

  for (const item of payload.tempKeys) {
    const sourceBaseKey = sourceBaseKeyFromTempUrl(item?.tempUrl);
    if (payload.tableType === 'BOARD' && !Number.isInteger(item.boardImageId?.id)) {
      throw new Error('Board upload item has no BoardImage ID');
    }

    const row =
      payload.tableType === 'PRODUCT'
        ? await readProduct(payload.feenId)
        : await readBoardImage(payload.feenId, item.boardImageId.id);

    if (!row) {
      tempKeysToDelete.push(item.tempUrl);
      outputKeysToDelete.push(...expandBaseImageKeys(sourceBaseKey));
      continue;
    }

    const sameCurrentImage = matchesImage(row.image, item.tempUrl);
    if (row.status === 'READY' && sameCurrentImage) {
      if (payload.tableType === 'PRODUCT') {
        await syncActiveProductVersionKey(
          payload.feenId,
          sourceBaseKey,
          row.image
        );
      }
      tempKeysToDelete.push(item.tempUrl);
      continue;
    }

    if (row.status === 'PROCESSING' && sameCurrentImage) {
      eligible.push(item);
      continue;
    }

    // This upload was removed, failed, or superseded. Its key is unique, so
    // clean its temporary and any partially-created derivatives.
    tempKeysToDelete.push(item.tempUrl);
    outputKeysToDelete.push(...expandBaseImageKeys(sourceBaseKey));
  }

  return { eligible, tempKeysToDelete, outputKeysToDelete };
};

const updateProductFromImage = async (productId, image) => {
  const { data, error } = await supabase
    .from('Product')
    .update({
      image: image.assetKey,
      status: 'READY',
      dominantColor: image.dominantColor,
      lqip: image.lqip,
      updatedAt: new Date().toISOString(),
    })
    .eq('id', productId)
    .eq('status', 'PROCESSING')
    .eq('image', image.sourceBaseKey)
    .select('id');
  if (error) throw error;

  if (!data?.length) {
    await deleteS3Keys(image.outputKeys);
    return;
  }

  await syncActiveProductVersionKey(
    productId,
    image.sourceBaseKey,
    image.assetKey
  );
};

const updateBoardImageFromImage = async (boardId, image) => {
  const { data, error } = await supabase
    .from('BoardImage')
    .update({
      image: image.assetKey,
      status: 'READY',
      dominantColor: image.dominantColor,
    })
    .eq('id', image.targetId)
    .eq('boardId', boardId)
    .eq('status', 'PROCESSING')
    .eq('image', image.sourceBaseKey)
    .select('id');
  if (error) throw error;

  if (!data?.length) await deleteS3Keys(image.outputKeys);
};

const processUploadMessage = async (payload) => {
  const { eligible, tempKeysToDelete, outputKeysToDelete } =
    await prepareUploadItems(payload);

  if (eligible.length) {
    const processedImages = await Promise.all(eligible.map(processSingleImage));
    if (payload.tableType === 'PRODUCT') {
      await updateProductFromImage(payload.feenId, processedImages[0]);
    } else {
      for (const image of processedImages) {
        await updateBoardImageFromImage(payload.feenId, image);
      }
    }
    tempKeysToDelete.push(...eligible.map((item) => item.tempUrl));
  }

  await deleteS3Keys(outputKeysToDelete);
  await deleteS3Keys(tempKeysToDelete);
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

  for (const key of payload.baseKeys) assertSafeBaseKey(key);
  for (const key of payload.temporaryKeys) assertSafeTempKey(key);
  const keys = [
    ...payload.baseKeys.flatMap(expandBaseImageKeys),
    ...payload.temporaryKeys,
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
  // A duplicate SQS delivery after successful physical deletion is complete.
  if (!board) return;
  if (!['DELETE_PENDING', 'DELETE_FAILED'].includes(board.deletionStatus)) {
    console.warn(
      `[DELETE_BOARD SKIPPED] Board ${payload.boardId} is ${board.deletionStatus}`
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
  for (const key of baseKeys) assertSafeBaseKey(key);
  for (const key of temporaryKeys) assertSafeTempKey(key);

  await deleteS3Keys([
    ...baseKeys.flatMap(expandBaseImageKeys),
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

  for (const record of event.Records ?? []) {
    try {
      const payload = JSON.parse(record.body);
      if (payload.operation === 'DELETE_ASSETS') {
        await handleDeleteAssets(payload);
        continue;
      }
      if (payload.operation === 'DELETE_BOARD') {
        await handleDeleteBoard(payload);
        continue;
      }
      if (payload.operation && payload.operation !== 'PROCESS_IMAGES') {
        throw new Error(`Unknown SQS operation: ${payload.operation}`);
      }

      // Existing create/edit upload producers omit operation. Keep their
      // { feenId, tempKeys, tableType } payload unchanged.
      await processUploadMessage(payload);
    } catch (error) {
      console.error(`[ERROR] SQS record ${record.messageId}:`, error);
      batchItemFailures.push({ itemIdentifier: record.messageId });
    }
  }

  return { batchItemFailures };
};
