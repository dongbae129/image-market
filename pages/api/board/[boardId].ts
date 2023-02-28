import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/server/client';
import { ResponseType } from '@libs/server/utils';
import { checkAuth } from '@libs/server/auth';
import { decode } from 'jsonwebtoken';

export interface PostBoardInfo {
  title: string;
  description: string;
  boardtag: string;
}
const BoardDetail = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  if (req.method === 'GET') {
    const { boardId } = req.query;
    if (!boardId)
      return res.status(401).json({
        ok: false,
        message: 'does not existing the board'
      });
    try {
      const board = await client.board.findUnique({
        where: {
          id: +boardId.toString()
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          },
          boardChat: {
            include: {
              user: {
                select: {
                  name: true,
                  image: true
                }
              }
            }
          },
          boardHit: {
            select: {
              hit: true
            }
          },
          boardTag: {
            select: {
              hashtag: true
            }
          }
        }
      });
      if (board) {
        await client.boardHit.update({
          where: {
            boardId: board.id
          },
          data: {
            hit: {
              increment: 1
            }
          }
        });
        if (board.boardHit) board.boardHit.hit++;
        return res.json({
          ok: true,
          board
        });
      } else {
        return res.status(401).json({
          ok: false,
          message: 'fail to find the board'
        });
      }
    } catch (error) {
      console.error(error, 'getBoardDetail Error');
      return res.status(500).json({
        ok: false,
        meesage: error
      });
    }
  } else if (req.method === 'POST') {
    const { title, description, boardtag }: PostBoardInfo = req.body.info;
    const { boardId } = req.query;
    console.log(title, description, boardtag, boardId, 'Board update');

    if (!boardId)
      return res.status(401).json({
        ok: false,
        message: 'does not existing the board'
      });
    try {
      const board = await client.board.findUnique({
        where: {
          id: +boardId.toString()
        }
      });
      console.log(board, 'board find');
      if (board) {
        await client.board.update({
          where: {
            id: board.id
          },
          data: {
            title: title,
            description: description
          }
        });
        const boardTag = await client.boardTag.findUnique({
          where: {
            boardId: board.id
          }
        });
        if (boardTag) {
          await client.boardTag.update({
            where: {
              boardId: board.id
            },
            data: {
              hashtag: boardtag
            }
          });
        } else {
          await client.boardTag.create({
            data: {
              boardId: board.id,
              hashtag: boardtag
            }
          });
        }

        return res.json({
          ok: true,
          message: 'updated the board'
        });
      } else {
        return res.status(401).json({
          ok: false,
          message: "doesn't have the board"
        });
      }
    } catch (error) {
      console.error(error, 'the baord error');
      return res.status(500).json({
        ok: false,
        error
      });
    }
  } else if (req.method === 'DELETE') {
    const { boardId } = req.query;
    try {
      const auth = checkAuth(req, res, 0);
      console.log(auth, 'auth');

      if (!auth?.re)
        return res.status(400).json({
          ok: false,
          message: 'need to login'
        });
      const decodedId = decode(auth.accessToken as string);

      if (!boardId)
        return res.status(403).json({
          ok: false,
          message: 'no boardId'
        });
      const board = await client.board.findUnique({
        where: {
          id: +boardId.toString()
        }
      });
      if (!board)
        return res.json({
          ok: false,
          message: "doesn't exit the board"
        });
      if (board.userId !== Number(decodedId))
        return res.status(401).json({
          ok: false,
          message: 'invalid board'
        });
      await client.board.delete({
        where: {
          id: +boardId.toString()
        }
      });

      return res.json({
        ok: true,
        message: 'success delete the board'
      });
    } catch (error) {
      console.error(error, `${boardId} board error`);
      return res.status(500).json({
        ok: false,
        error
      });
    }
  }
};
export default BoardDetail;
