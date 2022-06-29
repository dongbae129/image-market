import axios from 'axios';
import cookie from 'cookie';
import { setCookies } from 'cookies-next';
import { sign, verify, decode } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
// interface authLinkFunc {
//   (req: NextApiRequest, res: NextApiResponse): {
//     state: boolean;
//     message: string;
//   };
//   (req: NextApiRequest, res: NextApiResponse): {
//     ok: boolean;
//     error: string;
//   };
// }
export const authLinkCheck = (req: NextApiRequest, res: NextApiResponse) => {
  const urlask = req.url?.includes('/api/oauth/link?linkask=true');
  if (urlask) {
    const urlAccessToken = req.headers['authorization']?.split(' ')[1];
    if (urlAccessToken) {
      try {
        const tokenState = verify(
          urlAccessToken,
          process.env.ACCESS_TOKEN_SECRET
        );
        return tokenState;
      } catch (e) {
        return res.json({
          ok: false,
          error: 'not verified accesstoken'
        });
      }
    } else {
      return res.json({
        ok: false,
        error: 'no have accesstoken'
      });
    }
  } else {
    return res.json({
      ok: false,
      error: 'invalid access link'
    });
  }
};

export const checkAuth = (req: NextApiRequest, res: NextApiResponse) => {
  const clientAccessToken = req.headers['authorization']?.split(' ')[1];
  console.log(req.cookies, 'Refresh');
  console.log(clientAccessToken, 'api/index');
  // 쿠키 있을때

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
                    return {
                      re: true,
                      ac: false,
                      message: 'refresh is true but, access is false'
                    };
                  }
                  // re: o, ac: o
                  else {
                    console.log(decode(clientAccessToken), 'auth testtt');
                    return {
                      re: true,
                      ac: true,
                      message: 'refreh is true, access is true'
                    };
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
                    return {
                      re: false,
                      ac: null,
                      message: 'refresh is false, and no author header'
                    };
                  }
                  // not author, re: o
                  if (payload) {
                    const accessToken = createAccessToken(payload.id);
                    return {
                      re: true,
                      ac: null,
                      message: 'refresh is true, but no author header'
                    };
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
    return {
      re: false,
      ac: null,
      cookie: null,
      message: 'no have cookie'
    };
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
      path: '/',
      secure: true
    })
  );
};
