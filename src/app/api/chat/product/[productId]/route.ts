import { checkAuth } from '@libs/server/auth';
import client from '@libs/server/client';
import { dbNow, TokenPayload } from '@libs/server/utils';
import { NextRequest, NextResponse } from 'next/server';

type Props = {
  params: {
    productId: string;
  };
};
export const GET = async ({ params }: Props) => {
  const { productId } = params;
  if (!productId)
    return NextResponse.json(
      {
        ok: false,
        message: 'not comments'
      },
      {
        status: 401
      }
    );

  console.log(productId, '$%$');

  const comments = await client.chat.findMany({
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
          name: true
        }
      }
    }
  });
  return NextResponse.json({
    ok: true,
    comments
  });
};

export const POST = async (req: NextRequest, { params }: Props) => {
  const { productId } = params;
  const searchParams = req.nextUrl.searchParams;
  const chatQuery = searchParams.get('chat');
  if (!chatQuery || chatQuery === '')
    return NextResponse.json({
      ok: false,
      message: 'need to any chat'
    });

  const auth = checkAuth();
  if (auth?.checkError)
    return NextResponse.json({
      ok: false,
      message: 'need to login for chat',
      auth
    });
  const userId = (auth.payload as TokenPayload).id;

  try {
    const now = dbNow();
    const chat = await client.chat.create({
      data: {
        description: chatQuery,
        userId,
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
    });
    return NextResponse.json({
      ok: true,
      chat
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
