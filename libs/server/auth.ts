import axios from 'axios';
import cookie from 'cookie';
import { sign, verify } from 'jsonwebtoken';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

export const checkAuth =
  (fn: NextApiHandler) => (req: NextApiRequest, res: NextApiResponse) => {
    const clientAccessToken = req.headers['authorization']?.split(' ')[1];
    console.log(clientAccessToken, 'api/index');
    // 쿠키 있을때
    // console.log(req.headers, '000');
    // console.log(req.cookies, '111');
    if (req.cookies['refreshToken']) {
      // const clientRefreshToken = cookie.parse(req.cookies).refreshToken;
      const clientRefreshToken = req.cookies['refreshToken'];
      // 쿠키에서 refresh 있을때
      if (clientRefreshToken) {
        verify(
          clientRefreshToken,
          process.env.REFRESH_TOKEN_SECRET,
          (err, payload) => {
            // re: x
            if (err) {
              console.log(err, '11');
              return false;
            }
            // re: 0
            if (payload) {
              if (clientAccessToken) {
                verify(
                  clientAccessToken,
                  process.env.ACCESS_TOKEN_SECRET,
                  (err: any, payload: any) => {
                    // re: o, ac: x
                    if (err) {
                      console.log(err, '2222');
                      const accessToken = createAccessToken(payload?.id);
                      return res.json({
                        ok: true,
                        accessToken,
                        message: 're: o, ac:x , new access'
                      });
                    }
                    // re: o, ac: o
                    if (payload) {
                      console.log('auth testtt');
                      fn(req, res);
                      return res.json({
                        ok: true,
                        accessToken: clientAccessToken,
                        message: 're:o, ac:o, old access'
                      });
                      // return fn(req, res);
                    }
                  }
                );
              }
              // header 에 authorization 없을때
              else {
                verify(
                  clientRefreshToken,
                  process.env.REFRESH_TOKEN_SECRET,
                  (err, payload) => {
                    // no author, re: x
                    if (err) {
                      console.log(err, '3333');
                      return res.status(401).json({
                        ok: false,
                        error: 'no author, re: x'
                      });
                    }
                    // not author, re: o
                    if (payload) {
                      const accessToken = createAccessToken(payload.id);
                      return res.json({
                        ok: true,
                        accessToken,
                        message: 'no author, re: o'
                      });
                    }
                  }
                );
              }
            }
          }
        );
      }
    }
    // 쿠키 없을때
    else {
      return res.status(401).json({
        ok: false,
        message: 'no cookie'
      });
    }
  };
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
export const createAccessToken = (id: number) => {
  return sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '10s'
  });
};

export const createRefreshToken = (id: number) => {
  return sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '20m'
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
