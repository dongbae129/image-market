import { ResponseType, TokenPayload, dbNow } from '@libs/server/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/server/client';
import { checkAuth } from '@libs/server/auth';
import { decode } from 'jsonwebtoken';

const BoardChat = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const {
    query: { boardId }
  } = req;
  if (!boardId)
    return res.json({
      ok: false,
      message: 'not comments'
    });
  if (req.method === 'GET') {
    console.log(boardId, '$%$');
    const comments = await client.boardChat.findMany({
      where: {
        boardId: +boardId.toString()
      },
      include: {
        user: {
          select: {
            name: true,
            image: true
          }
        }
      }
      // select: {
      //   user: {
      //     select: {
      //       name: true,
      //       image: true
      //     }
      //   }
      // }
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
    console.log(boardId, req.body, 'boardId');
    const authResponse = checkAuth(req, res, 0);
    if (!authResponse || !authResponse.accessToken)
      return res.json({
        ok: false,
        message: 'need to login for chat'
      });
    const userId = decode(authResponse.accessToken) as TokenPayload;

    try {
      const now = dbNow();
      const chat = await client.boardChat.create({
        data: {
          description: req.body.chat,
          userId: userId.id,
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
      return res.json({
        ok: true,
        chat
      });
    } catch (error) {
      console.error(error, `/api/chat/[${boardId}], post, create chat error`);
      return res.json({
        ok: false,
        meesage: `/api/chat/[${boardId}], post, create chat error`
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
    //     productId: +boardId.toString(),
    //     userId: decoded?.boardId
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

export default BoardChat;
