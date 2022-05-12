import { ResponseType } from '@libs/server/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/server/client';
import { checkAuth } from '@libs/server/auth';
import { decode, JwtPayload } from 'jsonwebtoken';

export interface accessTokenPayload extends JwtPayload {
  id: number;
}
const Board = checkAuth(
  async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
    if (req.method === 'POST') {
      try {
        const clientAccessToken = req.headers['authorization']?.split(' ')[1];
        const decoded = decode(clientAccessToken!) as accessTokenPayload;
        const { title, description } = req.body;
        if (title === '' || description === '')
          return res.json({
            ok: false,
            error: 'input board informations'
          });
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
      } catch (error) {
        console.log(error, 'board create error');
        return res.status(401);
      }
    }
    if (req.method === 'GET') {
      try {
        const boards = await client.board.findMany();
        return res.json({
          ok: true,
          boards
        });
      } catch (error) {
        console.log(error, 'boards get error');
      }
    }
  }
);

export default Board;
