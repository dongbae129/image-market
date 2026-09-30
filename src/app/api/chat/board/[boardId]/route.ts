import { dbNow } from '@libs/server/utils';
import client from '@libs/server/client';
import { checkAuth } from '@libs/server/auth';
import { NextRequest, NextResponse } from 'next/server';

type Props = {
  params: {
    boardId: string;
  };
};
export const GET = async (req: NextRequest, { params }: Props) => {
  const { boardId } = params;
  const searchParams = req.nextUrl.searchParams;
  const pageParamId = searchParams.get('comment');
  if (!boardId || !pageParamId)
    return NextResponse.json(
      {
        ok: false,
        message: 'not comments'
      },
      {
        status: 401
      }
    );
  const lastId = Number(pageParamId);

  try {
    const comments = await client.boardChat.findMany({
      take: 3,
      skip: lastId ? 1 : 0,
      ...(lastId && {
        cursor: {
          id: lastId
        }
      }),
      where: {
        boardId: +boardId
      },
      include: {
        user: {
          select: {
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json({
      ok: true,
      comments
    });
  } catch (error) {
    console.error(error, 'chat/boardId Post');
    return NextResponse.json(
      {
        ok: false,
        message: 'board chat fail'
      },
      {
        status: 500
      }
    );
  }
};
export const POST = async (req: NextRequest, { params }: Props) => {
  const { boardId } = params;
  if (!boardId)
    return NextResponse.json({
      ok: false,
      message: 'not comments'
    });
  const body = await req.json();
  const chatQuery = body.chat;
  if (!chatQuery || chatQuery === '')
    return NextResponse.json({
      ok: false,
      message: 'need to any chat'
    });

  const auth = checkAuth();
  if (auth.checkError)
    return NextResponse.json(
      {
        ok: false,
        auth
      },
      {
        status: 401
      }
    );
  const userId = Number(auth.userId);

  try {
    const now = dbNow();
    const chat = await client.boardChat.create({
      data: {
        description: chatQuery,
        userId,
        boardId: +boardId.toString(),
        createdAt: now,
        updatedAt: now
      }
      // include: {
      //   user: {
      //     select: {
      //       name: true
      //     }
      //   }
      // }
    });
    return NextResponse.json({
      ok: true,
      chat
    });
  } catch (error) {
    console.error(error, `/api/chat/[${boardId}], post, create chat error`);
    return NextResponse.json(
      {
        ok: false,
        meesage: 'board chat fail'
      },
      {
        status: 500
      }
    );
  }
};
