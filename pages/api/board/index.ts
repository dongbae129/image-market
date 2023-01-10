import { dbNow, ResponseType, TokenPayload } from '@libs/server/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/server/client';
import { checkAuth } from '@libs/server/auth';
import { decode } from 'jsonwebtoken';
import { formatISO } from 'date-fns';
import dayjs from 'dayjs';
import { PostBoardInfo } from './[boardId]';

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

        console.log(req.body, 'Body');
        const { title, description, boardtag }: PostBoardInfo = req.body.info;
        if (title === '' || description === '')
          return res.json({
            ok: false,
            error: 'input board informations'
          });
        if (decoded.id) {
          const userId = +decoded.id;
          console.log(title, description, userId, 'asa');

          const now = dbNow();
          const board = await client.board.create({
            data: {
              title,
              description,
              userId,
              createdAt: now,
              updatedAt: now
            }
          });
          await client.boardHit.create({
            data: {
              hit: 0,
              boardId: board.id
            }
          });
          await client.boardTag.create({
            data: {
              boardId: board.id,
              hashtag: boardtag
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
      return res.status(401).json({
        ok: false,
        message: error
      });
    }
  }
  if (req.method === 'GET') {
    const searchQuery = req.query.search;
    console.log(req.query, 'board query');
    try {
      const boards = await client.board.findMany({
        where: {
          ...(searchQuery
            ? {
                title: {
                  contains: searchQuery.toString()
                }
              }
            : {})
        },
        include: {
          user: {
            select: {
              name: true
            }
          },
          boardHit: {
            select: {
              hit: true
            }
          },
          _count: {
            select: {
              boardChat: true
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
      return res.status(500).json({
        ok: false,
        message: error
      });
    }
  }
};
export default Board;
