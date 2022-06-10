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

    if (!user) {
      res.json({
        ok: false,
        error: 'id or password is incorrected'
      });
    } else {
      const comparepassw = await bcrypt.compare(password, user.password);
      if (comparepassw) {
        const accessToken = createAccessToken(user.id);
        const refreshToken = createRefreshToken(user.id);

        sendRefreshToken(res, refreshToken);
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
