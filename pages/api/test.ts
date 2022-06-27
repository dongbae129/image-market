import { ResponseType } from '@libs/server/utils';
import { NextApiRequest, NextApiResponse } from 'next';

import { kakaoUserInfoResponse } from './oauth/kakao';
import axios from 'axios';
const Test = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  if (req.method === 'POST') {
    try {
      const accessToken = req.body.accessToken;
      console.log(accessToken, 'access');

      const userInfo = await axios
        .post<kakaoUserInfoResponse>(
          'https://kapi.kakao.com/v1/user/logout',
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        )
        .then((res) => {
          return res.data;
        });
      console.log(userInfo);

      res.json({
        ok: true,
        message: 'Hio?'
      });
    } catch (e) {
      console.error(e.response.data);
      res.json({
        ok: false
      });
    }
  }
  if (req.method === 'GET') {
  }
};

export default Test;
