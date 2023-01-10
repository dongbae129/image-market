import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/server/client';
import { ResponseType } from '@libs/server/utils';

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
        await client.boardTag.update({
          where: {
            boardId: board.id
          },
          data: {
            hashtag: boardtag
          }
        });
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
  }
};
export default BoardDetail;
