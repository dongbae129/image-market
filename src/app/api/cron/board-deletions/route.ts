import client from '@libs/server/client';
import { dispatchBoardDeletion } from '@libs/server/boardDeletion';
import { NextRequest, NextResponse } from 'next/server';

const BATCH_SIZE = 100;
const RETRY_AFTER_MS = 5 * 60 * 1000;

export async function POST(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, message: 'CRON_SECRET is not configured' },
      { status: 503 }
    );
  }
  if (request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const retryBefore = new Date(Date.now() - RETRY_AFTER_MS);
  const candidates = await client.board.findMany({
    where: {
      deletionStatus: { in: ['DELETE_PENDING', 'DELETE_FAILED'] },
      OR: [
        { deletionLastAttemptAt: null },
        { deletionLastAttemptAt: { lt: retryBefore } }
      ]
    },
    select: { id: true, deletionStatus: true },
    orderBy: { deletionLastAttemptAt: 'asc' },
    take: BATCH_SIZE
  });

  const results = await Promise.all(
    candidates.map((board) => dispatchBoardDeletion(board))
  );
  const dispatched = results.filter((result) => result.dispatched).length;
  return NextResponse.json({
    ok: true,
    found: candidates.length,
    dispatched,
    failed: results.length - dispatched
  });
}
