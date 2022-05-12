import { ResponseType } from '@libs/server/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import { verify, decode } from 'jsonwebtoken';
import cookie from 'cookie';
import { createAccessToken } from '@libs/server/auth';

const userAuth = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  if (req.method === 'GET') {
    const clientAccessToken = req.headers['authorization']?.split(' ')[1];
    console.log(clientAccessToken, 'api/index');
    // 쿠키 있을때
    if (req.headers.cookie) {
      const clientRefreshToken = cookie.parse(req.headers.cookie).refreshToken;
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
                error: 'need to login, expired refresh'
              });
            }
            // re: 0
            if (payload) {
              if (clientAccessToken) {
                verify(
                  clientAccessToken,
                  process.env.ACCESS_TOKEN_SECRET,
                  (err, payload) => {
                    // re: o, ac: x
                    if (err) {
                      console.log(err, '2222');
                      const decoded = decode(clientAccessToken);
                      const accessToken = createAccessToken(decoded?.id);
                      return res.json({
                        ok: true,
                        accessToken,
                        message: 're: o, ac:x , new access'
                      });
                    }
                    // re: o, ac: o
                    if (payload) {
                      return res.json({
                        ok: true,
                        accessToken: clientAccessToken,
                        message: 're:o, ac:o, old access'
                      });
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
  }
};

export default userAuth;

// const accessVerified = verify(
//   clientAccessToken,
//   process.env.ACCESS_TOKEN_SECRET
// );
// if (req.headers.cookie) {
//   const clientRefreshToken = cookie.parse(
//     req.headers.cookie
//   ).refreshToken;
//   console.log(clientRefreshToken, '&&&&');
//   if (clientRefreshToken) {
//     const refreshVerified = verify(
//       clientRefreshToken,
//       process.env.REFRESH_TOKEN_SECRET
//     );
//     if (accessVerified) {
//       // ac:o, re: o
//       if (refreshVerified) {
//         return res.json({
//           ok: true,
//           accessToken: clientAccessToken
//         });
//       }
//       // ac:o, re: x
//       else {
//         return res.status(401).json({
//           ok: false,
//           error: 'Re Login please'
//         });
//       }
//     } else {
//       if (refreshVerified) {
//         const refreshDecoded = decode(clientRefreshToken);
//         const accessToken = createAccessToken(refreshDecoded?.id);
//         return res.json({
//           ok: true,
//           accessToken,
//           message: 're sent access'
//         });
//       }
//       // access: not verifed, refresh: not verifed
//       else {
//         return res.status(401).json({
//           ok: false,
//           error: 'not'
//         });
//       }
//     }
//   } else {
//     return res.status(401).json({
//       ok: false,
//       message: 'Re login please, not Refresh'
//     });
//   }
// } else {
//   return res.status(401).json({
//     ok: false,
//     message: 'Re login, not have cookie'
//   });
// }
