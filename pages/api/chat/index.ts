import { ResponseType } from '@libs/server/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/server/client';
import { checkAuth } from '@libs/server/auth';

const Chat = checkAuth(
  async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
    if (req.method === 'GET') {
    } else if (req.method === 'POST') {
    }
  }
);

export default Chat;
