import { ResponseType, TokenPayload } from '@libs/server/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/server/client';
import { checkAuth } from '@libs/server/auth';
import { decode, JwtPayload } from 'jsonwebtoken';

const Chat = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const {
    query: { id }
  } = req;
  if (!id)
    return res.json({
      ok: false,
      message: 'not comments'
    });
  if (req.method === 'GET') {
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
    if (req.body.chat === '')
      return res.json({
        ok: false,
        message: 'need to any chat'
      });
    console.log(id, req.body, 'id');
    const authResponse = checkAuth(req, res, 0);
    if (!authResponse || !authResponse.accessToken)
      return res.json({
        ok: false,
        message: 'need to login for chat'
      });
    const userId = decode(authResponse.accessToken) as TokenPayload;

    try {
      const chat = await client.chat.create({
        data: {
          description: req.body.chat,
          userId: userId.id,
          productId: +id.toString()
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
      console.error(error, `/api/chat/${id}, post, create chat error`);
      return res.json({
        ok: false,
        meesage: `/api/chat/${id}, post, create chat error`
      });
    }

    // const decoded = decode(token) as JwtPayload;
    // console.log(decoded, '!@!!!!!!!!!!!');
    // const {
    //   body: { chat }
    // } = req;
    // if (!chat)
    //   return res.json({
    //     ok: false,
    //     message: 'input anything'
    //   });
    // const comment = await client.chat.create({
    //   data: {
    //     description: chat,
    //     productId: +id.toString(),
    //     userId: decoded?.id
    //   },
    //   select: {
    //     user: true
    //   }
    // });
    // return res.json({
    //   ok: true,
    //   message: 'success create comment',
    //   comment
    // });
  }
};

export default Chat;
