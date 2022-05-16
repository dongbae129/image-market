import axios from 'axios';
import cookie from 'cookie';
import { sign, verify, decode } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

export const checkAuth =
  (fn: any) => (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
      return fn(req, res);
    }
    console.log('TTTTTTT');
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
              return res.status(401).json({
                ok: false,
                error: 'login please'
              });
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
                      console.log(clientAccessToken, 'bb');
                      const decoded = decode(clientAccessToken);
                      console.log(decoded, 'BB');
                      // if (decoded) {
                      const accessToken = createAccessToken(decoded?.id);
                      console.log(accessToken, 'aa');
                      console.log(decode(accessToken), 'AA');
                      fn(req, res, accessToken);
                      return res.json({
                        ok: true,
                        accessToken,
                        message: 're: o, ac:x , new access'
                      });
                      // }
                    }
                    // re: o, ac: o
                    else {
                      console.log(decode(clientAccessToken), 'auth testtt');
                      return fn(req, res, clientAccessToken);
                      // return res.json({
                      //   ok: true,
                      //   accessToken: clientAccessToken,
                      //   message: 're:o, ac:o, old access'
                      // });
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
                      fn(req, res, accessToken);
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
    expiresIn: '20s'
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
