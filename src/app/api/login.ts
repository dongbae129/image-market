import client from '@libs/server/client';

import { ResponseType } from '@libs/server/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import {
  createAccessToken,
  sendRefreshToken,
  createRefreshToken
} from '@libs/server/auth';
const Login = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  if (req.method === 'GET') {
    console.log(req.query, 'query');
    return res.json({
      ok: true
    });
  }
  if (req.method === 'POST') {
    const { userId, password } = req.body;
    if (userId === '' || password === '') {
      res.json({
        ok: false,
        error: 'id and password is required!'
      });
    }
    const user = await client.localUser.findFirst({
      where: {
        memId: userId
      }
    });
    let User;
    if (user) {
      User = await client.user.findUnique({
        where: {
          id: user?.userId
        }
      });
    }
    if (!user) {
      res.status(401).json({
        ok: false,
        message: 'invalid id or wrong password'
      });
    } else if (User?.delete) {
      return res.status(403).json({
        ok: false,
        message: 'Forbidden user'
      });
    } else {
      const comparepassw = await bcrypt.compare(password, user.password);
      if (comparepassw) {
        const accessToken = createAccessToken(user.userId, 1);
        const refreshToken = createRefreshToken(user.userId, 1);

        sendRefreshToken(res, refreshToken);
        // res.setHeader('Set-Cookie', 'test=aaaTEST');
        res.json({
          ok: true,
          message: 'login success',
          user: user?.id,
          accessToken
        });
      } else {
        res.json({
          ok: false,
          error: 'id or password is incorrected!!!!'
        });
      }
    }
  }
};

export default Login;
