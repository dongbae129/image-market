import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/server/client';
import { ResponseType } from '@libs/server/utils';

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
          }
        }
      });
      return res.json({
        ok: true,
        board
      });
    } catch (error) {
      console.error(error, 'getBoardDetail Error');
    }
  }
};
export default BoardDetail;
