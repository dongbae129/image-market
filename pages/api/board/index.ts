import { ResponseType, TokenPayload } from '@libs/server/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/server/client';
import { checkAuth } from '@libs/server/auth';
import { decode } from 'jsonwebtoken';

const Board = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  if (req.method === 'POST') {
    try {
      const authResponse = checkAuth(req, res, 0);
      if (!authResponse?.re) {
        return res.status(401).json({
          ok: false,
          message: 'need to login to board'
        });
      }
      if (authResponse.accessToken) {
        const decoded = decode(authResponse.accessToken) as TokenPayload;

        const { title, description } = req.body;
        if (title === '' || description === '')
          return res.json({
            ok: false,
            error: 'input board informations'
          });
        console.log(decoded, 'dEcp');
        if (decoded.id) {
          const board = await client.board.create({
            data: {
              title,
              description,
              userId: decoded.id
            }
          });
          return res.json({
            ok: true,
            message: 'create the board',
            board
          });
        } else
          return res.json({
            ok: false,
            message: 'need to login , /api/board/index, post'
          });
        // if (decoded.type === 1) {
        //   const board = await client.board.create({
        //     data: {
        //       title,
        //       description,
        //       userId: decoded.id
        //     }
        //   });
        //   return res.json({
        //     ok: true,
        //     message: 'create the board',
        //     board
        //   });
        // }
        //  else if (decoded.type === -1) {
        //   const findSocialUser = await client.socialUser.findUnique({
        //     where: {
        //       socialId: decoded.id.toString()
        //     }
        //   });
        //   if (findSocialUser) {
        //     const board = await client.board.create({
        //       data: {
        //         title,
        //         description,
        //         userId: findSocialUser?.id
        //       }
        //     });
        //     return res.json({
        //       ok: true,
        //       message: 'create the board',
        //       board
        //     });
        //   } else {
        //     return res.json({
        //       ok: false,
        //       message: 'nothing the board'
        //     });
        //   }
        // }
      }
    } catch (error) {
      console.log(error, 'board create error');
      return res.status(401);
    }
  }
  if (req.method === 'GET') {
    try {
      const boards = await client.board.findMany({
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
        boards
      });
    } catch (error) {
      console.log(error, 'boards get error');
    }
  }
};
export default Board;
