import { ResponseType, TokenPayload, dbNow } from '@libs/server/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/server/client';
import { checkAuth } from '@libs/server/auth';
import { decode } from 'jsonwebtoken';

const Chat = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const {
    query: { productId }
  } = req;
  if (!productId)
    return res.json({
      ok: false,
      message: 'not comments'
    });
  if (req.method === 'GET') {
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
    return res.json({
      ok: true,
      comments
    });
  } else if (req.method === 'POST') {
    if (req.body.chat === '')
      return res.json({
        ok: false,
        message: 'need to any chat'
      });
    console.log(productId, req.body, 'productId');
    const authResponse = checkAuth(req, res, 0);
    if (!authResponse || !authResponse.accessToken)
      return res.json({
        ok: false,
        message: 'need to login for chat'
      });
    const userId = decode(authResponse.accessToken) as TokenPayload;

    try {
      const now = dbNow();
      const chat = await client.chat.create({
        data: {
          description: req.body.chat,
          userId: userId.id,
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
      return res.json({
        ok: true,
        chat
      });
    } catch (error) {
      console.error(error, `/api/chat/${productId}, post, create chat error`);
      return res.json({
        ok: false,
        meesage: `/api/chat/${productId}, post, create chat error`
      });
    }
  }
};

export default Chat;
