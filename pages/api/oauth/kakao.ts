import { createAccessToken, createRefreshToken } from '@libs/server/auth';
import { ResponseType } from '@libs/server/utils';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { sendRefreshToken } from './../../../libs/server/auth';
import client from '@libs/server/client';
export interface kakaoUserInfoResponse {
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
        return res.data;
      });

    const jwtAccessToken = createAccessToken(userInfo.id);
    const jwtRefreshToken = createRefreshToken(userInfo.id);

    const exitUser = await client.user.findUnique({
      where: {
        email: userInfo.kakao_account.email
      }
    });
    if (exitUser) {
      const findsocialUser = await client.socialUser.findFirst({
        where: {
          socialId: userInfo.id.toString()
        }
      });
      if (findsocialUser) {
        // user가 있고 social이 있으니깐 그냥 로그인
        // socialuser에 kakao_accesstoken 저장
        await client.socialUser.update({
          where: {
            socialId: userInfo.id.toString()
          },
          data: {
            accessToken: access_token
          }
        });
        sendRefreshToken(res, jwtRefreshToken);

        return res.json({
          ok: true,
          userInfo,
          accessToken: access_token
          // 바꾸기
          // accessToken: jwtAccessToken
        });
      } else {
        // user가 있고 social이 없으니깐 local이 있는거라 해당 이메일로 연동할거냐고 물어봐야함

        return res.json({
          ok: true,
          userId: exitUser.id,
          message: 'have localuser and ask to need link social-login',
          accessToken: jwtAccessToken,
          reason: 1
        });
      }
    } else {
      // user가 없어서 user create
      const user = await client.user.create({
        data: {
          email: userInfo.kakao_account.email,
          emailActive: true,
          image: userInfo.kakao_account.profile.thumbnail_image_url || '',
          name: userInfo.kakao_account.profile.nickname
        }
      });
      // user도 만들고 social도 만듬
      await client.socialUser.create({
        data: {
          socialId: userInfo.id.toString(),
          type: 'kakao',
          userId: user.id
        }
      });
      sendRefreshToken(res, jwtRefreshToken);
      return res.json({
        ok: true,
        userInfo: user,
        accessToken: jwtAccessToken
      });
    }
  } catch (e: any) {
    console.log(e, 'ERR');
    res.json({
      ok: false,
      error: e.message
    });
  }
};
export default Kakao;
