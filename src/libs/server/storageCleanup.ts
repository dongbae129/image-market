import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { Prisma } from '@prisma/client';
import client from '@libs/server/client';

export type StorageCleanupPayload = {
  baseKeys: string[];
  temporaryKeys: string[];
};

const sqs = new SQSClient({ region: process.env.AWS_REGION });

const unique = (values: string[]) => Array.from(new Set(values));

const isSafeBaseKey = (key: string) =>
  !!key &&
  !key.startsWith('/') &&
  !key.includes('/') &&
  !key.includes('\\') &&
  !key.includes('..') &&
  !key.startsWith('temp/');

const isSafeTemporaryKey = (key: string) =>
  key.startsWith('temp/') &&
  !!key.slice('temp/'.length) &&
  !key.slice('temp/'.length).includes('/') &&
  !key.includes('\\') &&
  !key.includes('..');

export async function createStorageCleanupJob(
  tx: Prisma.TransactionClient,
  payload: StorageCleanupPayload
) {
  if (
    payload.baseKeys.some((key) => !isSafeBaseKey(key)) ||
    payload.temporaryKeys.some((key) => !isSafeTemporaryKey(key))
  )
    throw new Error('Storage cleanup payload contains an unsafe object key');

  const normalizedPayload = {
    baseKeys: unique(payload.baseKeys),
    temporaryKeys: unique(payload.temporaryKeys)
  };

  if (
    !normalizedPayload.baseKeys.length &&
    !normalizedPayload.temporaryKeys.length
  )
    return null;

  return tx.storageCleanupJob.create({ data: { payload: normalizedPayload } });
}

export async function dispatchStorageCleanupJob(jobId: string) {
  const job = await client.storageCleanupJob.findUnique({
    where: { id: jobId }
  });
  if (!job || job.status !== 'PENDING')
    return job?.status === 'QUEUED' || job?.status === 'COMPLETED';

  try {
    if (!process.env.AWS_SQS_QUEUE_URL)
      throw new Error('AWS_SQS_QUEUE_URL is not configured');

    const payload = job.payload as unknown as StorageCleanupPayload;
    await sqs.send(
      new SendMessageCommand({
        QueueUrl: process.env.AWS_SQS_QUEUE_URL,
        MessageBody: JSON.stringify({
          operation: 'DELETE_ASSETS',
          jobId: job.id,
          baseKeys: payload.baseKeys,
          temporaryKeys: payload.temporaryKeys
        })
      })
    );

    await client.storageCleanupJob.updateMany({
      where: { id: job.id, status: 'PENDING' },
      data: { status: 'QUEUED', attempts: { increment: 1 }, lastError: null }
    });
    return true;
  } catch (error) {
    try {
      await client.storageCleanupJob.updateMany({
        where: { id: job.id, status: 'PENDING' },
        data: {
          status: 'FAILED',
          attempts: { increment: 1 },
          lastError:
            error instanceof Error
              ? error.message.slice(0, 1000)
              : 'Unknown SQS error'
        }
      });
    } catch (recordError) {
      console.error(
        'Could not record cleanup dispatch failure:',
        job.id,
        recordError
      );
    }
    console.error('Storage cleanup SQS dispatch failed:', job.id, error);
    return false;
  }
}
