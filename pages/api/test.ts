import { ResponseType } from '@libs/server/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/server/client';
const Test = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  if (req.method === 'POST') {
    console.log(req.body, '$$^$^');
    res.json({
      ok: true,
      message: 'Hio?'
    });
  }
  if (req.method === 'GET') {
    const user = await client.user.findUnique({
      where: {
        userId: 'AA@aa.com'
      }
    });
    if (user) {
      res.json({
        ok: true,
        user
      });
    }
  }
};

export default Test;
