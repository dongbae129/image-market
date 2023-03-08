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
  if (!auth?.re)
    return res.json({
      ok: false,
      message: 'need to login'
    });
  if (req.method === 'GET') {
    try {
      if (auth.accessToken) {
        const decoded = decode(auth?.accessToken) as TokenPayload;
        console.log(decoded, 'DD');
        const user = await client.user.findUnique({
          where: {
            id: decoded.id
          },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            emailActive: true
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
    return res.json({
      ok: true,
      meesage: '나중에'
    });
  }
};
export default User;
