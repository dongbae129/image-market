import { checkAuth } from '@libs/server/auth';
import client from '@libs/server/client';
import { dbNow, TokenPayload } from '@libs/server/utils';
import { NextRequest, NextResponse } from 'next/server';

type Props = {
  params: {
    productId: string;
  };
};
export const GET = async (req: NextRequest, { params }: Props) => {
  const { productId } = params;

  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get('comment');
  if (!productId || !id)
    return NextResponse.json(
      {
        ok: false,
        message: 'not comments'
      },
      {
        status: 401
      }
    );
  let lastId = 0;
  lastId = +id.toString();

  const comments = await client.chat.findMany({
    take: 3,
    skip: lastId ? 1 : 0,
    ...(lastId && { cursor: { id: lastId } }),
    where: {
      productId: +productId.toString()
    },
    select: {
      id: true,
      description: true,
      createdAt: true,
      productId: true,
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
};

export const POST = async (req: NextRequest, { params }: Props) => {
  const { productId } = params;
  const { description: chatQuery } = await req.json();
  console.log(chatQuery, 'chatquery');
  if (!chatQuery || chatQuery === '')
    return NextResponse.json({
      ok: false,
      message: 'need to any chat'
    });

  const auth = checkAuth();
  console.log(auth, 'chat auth');
  if (auth?.checkError || !auth.userId)
    return NextResponse.json(
      {
        ok: false,
        message: 'need to login for chat',
        auth
      },
      {
        status: 401
      }
    );
  const userId = auth.userId;

  try {
    const now = dbNow();
    const [newComment] = await client.$transaction([
      client.chat.create({
        data: {
          description: chatQuery,
          userId: +userId,
          productId: +productId.toString(),
          createdAt: now,
          updatedAt: now
        },
        include: {
          user: {
            select: {
              name: true
            }
          }
        }
      }),
      client.product.update({
        where: { id: +productId },
        data: {
          commentsCount: { increment: 1 }
        }
      })
    ]);
    // const chat = await client.chat.create({
    //   data: {
    //     description: chatQuery,
    //     userId,
    //     productId: +productId.toString(),
    //     createdAt: now,
    //     updatedAt: now
    //   },
    //   include: {
    //     user: {
    //       select: {
    //         name: true
    //       }
    //     }
    //   }
    // });
    return NextResponse.json({
      ok: true,
      chat: newComment
    });
  } catch (error) {
    console.error(error, `/api/chat/${productId}, post, create chat error`);
    return NextResponse.json(
      {
        ok: false,
        meesage: 'chat product fail'
      },
      {
        status: 500
      }
    );
  }
};
