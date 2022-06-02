import { createAccessToken, createRefreshToken } from '@libs/server/auth';
import { ResponseType } from '@libs/server/utils';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { sendRefreshToken } from './../../../libs/server/auth';
import client from '@libs/server/client';
interface kakaoUserInfoResponse {
  id: number;
  connected_at: string;
  kakao_account: {
    profile: {
      nickname: string;
      thumbnail_image_url: string;
      profile_image_url: string;
    };
    email: string;
    gender: string;
  };
}
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
      .then((res) => {
        console.log(res.data, 'accesstoken');
        return res.data.access_token;
      })
      .catch((e) => console.log(e.response.data, 'tokenerror'));
    const userInfo = await axios
      .get<kakaoUserInfoResponse>('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      })
      .then((res) => {
        console.log(res.data, 'userInfo');
        return res.data;
      });

    const exitUser = await client.user.findUnique({
      where: {
        email: userInfo.kakao_account.email + userInfo.id
      }
    });
    if (exitUser) {
    } else {
      const user = await client.user.create({
        data: {
          email: userInfo.kakao_account.email + userInfo.id,
          emailActive: true,
          image: userInfo.kakao_account.profile.thumbnail_image_url || '',
          name: userInfo.kakao_account.profile.nickname
        }
      });
      const socialUser = await client.socialUser.create({
        data: {
          socialId: userInfo.id,
          type: 'kakao',
          userId: user.id
        }
      });
    }
    // const user = await client.user.upsert({
    //   create: {
    //     email: userInfo.kakao_account.email,
    //     image: userInfo.kakao_account.profile.thumbnail_image_url,
    //     name: userInfo.kakao_account.profile.nickname
    //   },
    //   where: {

    //   }
    // });
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
