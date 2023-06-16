import { NextApiRequest, NextApiResponse } from 'next';
import { checkAuth } from '@libs/server/auth';
import { ResponseType, TokenPayload } from '@libs/server/utils';
import { decode, JwtPayload } from 'jsonwebtoken';
import client from '@libs/server/client';
const User = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const auth = checkAuth(req, res, 0);
  console.log(auth, 'Auth');
  if (auth?.checkError)
    return res.status(401).json({
      ok: false,
      auth
    });

  if (req.method === 'GET') {
    try {
      if (auth?.payload) {
        const { id } = auth?.payload as TokenPayload;
        const user = await client.user.findUnique({
          where: {
            id
          },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            emailActive: true,
            coin: true,
            bonusCoupon: true
          }
        });

        return res.json({
          ok: true,
          user
        });
      }
    } catch (e) {
      console.error(e, 'faile method GET');
    }
  } else if (req.method === 'POST') {
    return res.status(400).json({
      ok: false,
      meesage: '나중에'
    });
  }
};
export default User;
