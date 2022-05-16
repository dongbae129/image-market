import { ResponseType } from '@libs/server/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/server/client';
import { checkAuth } from '@libs/server/auth';
import { decode, JwtPayload } from 'jsonwebtoken';
import { accessTokenPayload } from 'pages/api/board';

const Chat = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
  token: string
) => {
  const {
    query: { id }
  } = req;
  if (req.method === 'GET') {
    if (!id)
      return res.json({
        ok: false,
        message: 'not comments'
      });
    console.log(id, '$%$');
    const comments = await client.chat.findMany({
      where: {
        productId: +id.toString()
      },
      select: {
        description: true,
        createdAt: true,
        id: true,
        user: {
          select: {
            name: true
          }
        }
      }
    });
    return res.json({
      ok: true,
      comments
    });
  } else if (req.method === 'POST') {
    const decoded = decode(token) as JwtPayload;
    console.log(decoded, '!@!!!!!!!!!!!');
    const {
      body: { chat }
    } = req;
    if (!chat)
      return res.json({
        ok: false,
        message: 'input anything'
      });
    const comment = await client.chat.create({
      data: {
        description: chat,
        productId: +id.toString(),
        userId: decoded?.id
      },
      select: {
        user: true
      }
    });
    return res.json({
      ok: true,
      message: 'success create comment',
      comment
    });
  }
};

export default checkAuth(Chat);
