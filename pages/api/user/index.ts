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
        if (decoded.type === 1) {
          try {
            const localuser = await client.localUser.findUnique({
              where: {
                id: decoded.id
              }
            });
            const user = await client.user.findFirst({
              where: {
                id: localuser?.userId
              },
              select: {
                email: true,
                name: true,
                id: true
              }
            });
            return res.json({
              ok: true,
              user
            });
          } catch (error) {
            console.error(error, 'failed localuser getting');
          }
        }
        if (decoded.type === -1) {
          try {
            const socialuser = await client.socialUser.findUnique({
              where: {
                socialId: decoded.id.toString()
              }
            });
            const user = await client.user.findFirst({
              where: {
                id: socialuser?.userId
              },
              select: {
                email: true,
                name: true,
                id: true
              }
            });
            return res.json({
              ok: true,
              user
            });
          } catch (error) {
            console.error(error, 'failed socialuser getting');
          }
        }
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
