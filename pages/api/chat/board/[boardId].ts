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
    console.log(boardId, 'BO!!', req.body, 'BOAA');
    const auth = checkAuth(req, res, 0);
    if (auth.checkError)
      return res.status(401).json({
        ok: false,
        auth
      });
    const userId = (auth.payload as TokenPayload).id;

    try {
      const now = dbNow();
      const chat = await client.boardChat.create({
        data: {
          description: req.body.chat,
          userId: userId,
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
  }
};

export default BoardChat;
