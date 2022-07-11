import axios from 'axios';
import cookie from 'cookie';
import { sign, verify, decode, JwtPayload } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

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
interface checkAuthResponse {
  re: boolean;
  ac: boolean | null;
  accessToken?: string;
  cookie?: null;
  message: string;
}

export const checkAuth = (
  req: NextApiRequest,
  res: NextApiResponse,
  logintype: number
): checkAuthResponse | undefined => {
  let type = logintype;
  const clientAccessToken = req.headers['authorization']?.split(' ')[1];
  console.log(req.cookies, 'Refresh');
  console.log(clientAccessToken, 'api/index');
  let state;
  // 쿠키 있을때

  if (req.cookies['refreshToken']) {
    // const clientRefreshToken = cookie.parse(req.cookies).refreshToken;
    const clientRefreshToken = req.cookies['refreshToken'];
    // 쿠키에서 refresh 있을때

    verify(
      clientRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, payload) => {
        // re: x
        if (err) {
          console.log(err, '11');
          state = {
            re: false,
            ac: false,
            message: 'login please'
          };
          return state;
        }
        // re: 0
        else if (payload) {
          if (clientAccessToken) {
            verify(
              clientAccessToken,
              process.env.ACCESS_TOKEN_SECRET,
              (err: any, paylaod: any) => {
                // re: o, ac: x
                if (err) {
                  console.log(err, '2222');
                  console.log(clientAccessToken, 'bb');
                  const decoded = decode(clientRefreshToken);
                  type = (decoded as JwtPayload).type;
                  console.log(decoded, 'BB');
                  // if (decoded) {
                  const accessToken = createAccessToken(decoded?.id, type);
                  console.log(accessToken, 'aa');
                  console.log(decode(accessToken), 'AA');

                  state = {
                    re: true,
                    ac: false,
                    message: 'refresh is true but, access is false',
                    accessToken
                  };
                }
                // re: o, ac: o
                else {
                  console.log(decode(clientAccessToken), 'auth testtt');
                  state = {
                    re: true,
                    ac: true,
                    message: 'refreh is true, access is true',
                    accessToken: clientAccessToken
                  };
                }
              }
            );
          }
          // header 에 authorization 없을때
          else {
            type = (payload as JwtPayload).type;
            const accessToken = createAccessToken(payload.id, type);
            state = {
              re: true,
              ac: null,
              message: 'refresh is true, but no author header',
              accessToken
            };
          }
        }
      }
    );
  }
  // 쿠키 없을때
  else {
    state = {
      re: false,
      ac: null,
      cookie: null,
      message: 'no have cookie'
    };
  }
  return state;
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
export const createAccessToken = (id: number, type: number) => {
  return sign({ id, type }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '20s'
  });
};

export const createRefreshToken = (id: number, type: number) => {
  return sign({ id, type }, process.env.REFRESH_TOKEN_SECRET, {
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
