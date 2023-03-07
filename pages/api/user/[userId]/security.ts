import { checkAuth } from '@libs/server/auth';
import { TokenPayload } from '@libs/server/utils';
import { decode } from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
const UserSecurity = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const auth = checkAuth(req, res, 0);
      if (!auth?.re || !req.query.userId) {
        return res.json({
          ok: false,
          message: 'need to login'
        });
      }

      const decoded = decode(auth.accessToken) as TokenPayload;
      if (decoded.id !== +req.query.userId) {
        return res.status(400).json({
          ok: false,
          message: 'invalid id'
        });
      }
      const user = await client?.localUser.findUnique({
        where: {
          userId: decoded.id
        }
      });
      if (!user)
        return res.json({
          ok: false,
          message: "dosen't exit the user"
        });
      const comparePassword = await bcrypt.compare(
        req.body.prevPassword,
        user?.password
      );
      if (comparePassword) {
        if (req.body.prevPassword === req.body.password) {
          return res.json({
            ok: false,
            message: '비밀번호가 동일합니다'
          });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await client?.localUser.update({
          where: {
            userId: decoded.id
          },
          data: {
            password: hashedPassword
          }
        });
        return res.json({
          ok: true,
          message: 'success change password'
        });
      } else {
        return res.json({
          ok: false,
          message: '비밀번호가 일치하지 않습니다'
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        ok: false,
        message: 'server error'
      });
    }
  } else {
    return res.status(404).json({
      ok: false,
      message: 'invalid url'
    });
  }
};

export default UserSecurity;
