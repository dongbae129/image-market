import { Prisma } from '@prisma/client';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import client from '@libs/server/client';

const sqs = new SQSClient({ region: process.env.AWS_REGION });

type BoardDeletionTarget = { id: number; deletionStatus: string };

const isDeletedConcurrently = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError &&
  error.code === 'P2025';

export async function dispatchBoardDeletion(board: BoardDeletionTarget) {
  if (
    !['ACTIVE', 'DELETE_PENDING', 'DELETE_FAILED'].includes(
      board.deletionStatus
    )
  ) {
    return { status: board.deletionStatus, dispatched: false };
  }

  try {
    await client.board.update({
      where: { id: board.id },
      data: {
        deletionStatus: 'DELETE_PENDING',
        deletionError: null,
        deletionAttempts: { increment: 1 },
        deletionLastAttemptAt: new Date()
      }
    });
  } catch (error) {
    if (isDeletedConcurrently(error)) {
      return { status: 'DELETED' as const, dispatched: true };
    }
    throw error;
  }

  try {
    if (!process.env.AWS_SQS_QUEUE_URL)
      throw new Error('AWS_SQS_QUEUE_URL is not configured');
    await sqs.send(
      new SendMessageCommand({
        QueueUrl: process.env.AWS_SQS_QUEUE_URL,
        MessageBody: JSON.stringify({
          operation: 'DELETE_BOARD',
          boardId: board.id
        })
      })
    );
    return { status: 'DELETE_PENDING' as const, dispatched: true };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message.slice(0, 1000)
        : 'Unknown SQS error';
    try {
      await client.board.update({
        where: { id: board.id },
        data: { deletionStatus: 'DELETE_FAILED', deletionError: message }
      });
    } catch (stateError) {
      if (isDeletedConcurrently(stateError)) {
        return { status: 'DELETED' as const, dispatched: true };
      }
      throw stateError;
    }
    console.error('Board deletion SQS dispatch failed:', board.id, error);
    return { status: 'DELETE_FAILED' as const, dispatched: false };
  }
}
