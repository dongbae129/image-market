import { createAccessToken, createRefreshToken } from '@libs/server/auth';
import { ResponseType } from '@libs/server/utils';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { sendRefreshToken } from './../../../libs/server/auth';

const Kakao = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const code = req.query.code;
  console.log(code, 'CCCCC');
  const grant_type = 'authorization_code';
  const client_id = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
  const redirect_uri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
  const client_secret = process.env.NEXT_PUBLIC_KAKAO_CLIENT_SECRET;
  try {
    console.log(code, 'AS');
    const access_token = await axios
      .post(
        `https://kauth.kakao.com/oauth/token?grant_type=${grant_type}&client_id=${client_id}&redirect_uri=${redirect_uri}&client_secret=${client_secret}&code=${code}`,
        {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
          }
        }
      )
      .then((res) => res.data.access_token)
      .catch((e) => console.log(e.response.data, 'tokenerror'));
    const userInfo = await axios
      .get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      })
      .then((res) => res.data);

    const jwtAccessToken = createAccessToken(userInfo.id);
    const jwtRefreshToken = createRefreshToken(userInfo.id);

    // res.setHeader('Authorization', jwtAccessToken);
    // axios.defaults.headers.common['Authorization'] = `Bearer ${jwtAccessToken}`;
    sendRefreshToken(res, jwtRefreshToken);

    return res.json({
      ok: true,
      userInfo,
      accessToken: jwtAccessToken
    });
  } catch (e: any) {
    console.log(e.response.data, 'ERR');
    res.json({
      ok: false,
      error: e.message
    });
  }
  // return res.json({
  //   ok: true,
  //   message: 'testtt'
  // });
};
export default Kakao;
