import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken
} from '@libs/server/auth';
import { ResponseType } from '@libs/server/utils';
import { decode, verify, JwtPayload } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

interface StateType {
  ok?: boolean;
  auth?: {
    checkError: boolean;
  };
  message?: string;
  accessToken?: string;
}
const Restore = (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  if (req.method === 'GET') {
    if (!req.cookies['refreshToken']) {
      return res.status(403).json({
        ok: false,
        auth: {
          checkError: false
        },
        message: 'need to login again'
      });
    }
    const refreshToken = req.cookies['refreshToken'];
    let state: StateType = {};
    verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
      if (err) {
        state = {
          ok: false,
          auth: {
            checkError: true
          },
          message: 'need to login, invalid refreshToken'
        };
        return;
      }
      const accessToken = createAccessToken((payload as JwtPayload).id, 0);
      state = {
        accessToken
      };
    });
    if (state?.auth?.checkError)
      return res.status(403).json({
        ok: false,
        ...state
      });

    return res.json({
      ok: true,
      ...state
    });
    //     let status = {};
    //     if (!req.cookies['refreshToken']) {
    //       return res.status(401).json({
    //         ok: false,
    //         message: 'need to login, no cookie'
    //       });
    //     }
    //     const clientRefreshToken = req.cookies["refreshToken"]
    //     verify(clientRefreshToken, process.env.REFRESH_TOKEN_SECRET,
    //         (err,payload)=>{
    //             /**re: x */
    //             if(err) {
    //                 console.error(err,"resotre Error")
    //                 status = {
    //                     err,
    //                     re:false,
    //                     ac:false,
    //                     message:"fail verify refresh on accessToken restore"
    //                 }
    //                 return
    //             }
    //             /**re: o */

    //         })
    //   }
  }
};

export default Restore;
