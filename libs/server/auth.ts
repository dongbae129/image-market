import { User } from '@prisma/client';
import axios from 'axios';
import cookie from 'cookie';
import { sign } from 'jsonwebtoken';

export const refreshToken = () => {
  return axios
    .post(
      '/api/refresh',
      {},
      {
        withCredentials: true
      }
    )
    .then((res) => res.data);
};
export const createAccessToken = (user: User) => {
  return sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m'
  });
};

export const createRefreshToken = (user: User) => {
  return sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '1h'
  });
};

export const sendRefreshToken = (res: any, token: any) => {
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('refreshToken', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    })
  );
};
