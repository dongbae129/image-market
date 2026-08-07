import {
  createAccessToken,
  createRefreshToken,
  sendAccesToken
} from '@libs/server/auth';
import axios from 'axios';
import { sendRefreshToken } from '@libs/server/auth';
import client from '@libs/server/client';
import { NextRequest, NextResponse } from 'next/server';
import { generateAndSaveTokens } from '@app/api/_lib/tokenService';
import { setAuthCookies } from '@app/api/_lib/authCookies';
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

export const POST = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;

  const code = searchParams.get('code');

  const grant_type = 'authorization_code';
  const client_id = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
  const redirect_uri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
  const client_secret = process.env.NEXT_PUBLIC_KAKAO_CLIENT_SECRET;
  try {
    console.log(code, 'AS');
    const { access_token } = await axios
      .post(
        `https://kauth.kakao.com/oauth/token?grant_type=${grant_type}&client_id=${client_id}&redirect_uri=${redirect_uri}&client_secret=${client_secret}&code=${code}`,
        {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
          }
        }
      )
      .then((res) => {
        return res.data;
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
    console.log(userInfo, 'userInfokakao');

    let jwtAccessToken;
    let jwtRefreshToken;
    // const jwtAccessToken = createAccessToken(userInfo.id, -1);
    // const jwtRefreshToken = createRefreshToken(userInfo.id, -1);

    const exitUser = await client.user.findUnique({
      where: {
        email: userInfo.kakao_account.email
      }
    });
    if (exitUser) {
      const { accessToken: acT, refreshToken: reT } = generateAndSaveTokens(
        exitUser.id.toString()
      );
      /**이거
      jwtAccessToken = createAccessToken(exitUser.id, -1);
      jwtRefreshToken = createRefreshToken(exitUser.id, -1);
       */
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
            accessToken: acT,
            refreshToken: reT
            /*이거
            accessToken: jwtAccessToken,
            refreshToken: jwtRefreshToken*/
          }
        });
        await setAuthCookies(acT, reT);
        /*이거
        sendAccesToken(jwtAccessToken);
        sendRefreshToken(jwtRefreshToken);
        */
        return NextResponse.json({
          ok: true,
          userInfo,
          accessToken: acT
          //이거 accessToken: jwtAccessToken
          // 바꾸기
          // accessToken: jwtAccessToken
        });
      } else {
        // user가 있고 social이 없으니깐 local이 있는거라 해당 이메일로 연동할거냐고 물어봐야함

        return NextResponse.json({
          ok: true,
          userId: exitUser.id,
          message: 'have localuser and ask to need link social-login',
          accessToken: acT,
          //이거 accessToken: jwtAccessToken,
          reason: 1
        });
      }
    } else {
      try {
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
        const { accessToken: acT, refreshToken: reT } = generateAndSaveTokens(
          user.id.toString()
        );

        jwtRefreshToken = reT;
        jwtAccessToken = acT;
        await setAuthCookies(acT, reT);
        //이거 jwtRefreshToken = createRefreshToken(user.id, -1);
        //이거 jwtAccessToken = createAccessToken(user.id, -1);
        //이거 sendRefreshToken(jwtRefreshToken);
        return NextResponse.json({
          ok: true,
          userInfo: user,
          accessToken: jwtAccessToken
        });
      } catch (error) {
        console.error(error, 'user가 없어서 user create');
      }
    }
  } catch (e: any) {
    console.log(e, 'ERR');
    NextResponse.json(
      {
        ok: false,
        error: e.message
      },
      {
        status: 500
      }
    );
  }
};
// const Kakao = async (
//   req: NextApiRequest,
//   res: NextApiResponse<ResponseType>
// ) => {
//   const code = req.query.code;

//   const grant_type = 'authorization_code';
//   const client_id = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
//   const redirect_uri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
//   const client_secret = process.env.NEXT_PUBLIC_KAKAO_CLIENT_SECRET;
//   try {
//     console.log(code, 'AS');
//     const { access_token, refresh_token } = await axios
//       .post(
//         `https://kauth.kakao.com/oauth/token?grant_type=${grant_type}&client_id=${client_id}&redirect_uri=${redirect_uri}&client_secret=${client_secret}&code=${code}`,
//         {
//           headers: {
//             'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
//           }
//         }
//       )
//       .then((res) => {
//         return res.data;
//       })
//       .catch((e) => console.log(e.response.data, 'tokenerror'));
//     const userInfo = await axios
//       .get<kakaoUserInfoResponse>('https://kapi.kakao.com/v2/user/me', {
//         headers: {
//           Authorization: `Bearer ${access_token}`
//         }
//       })
//       .then((res) => {
//         return res.data;
//       });

//     let jwtAccessToken;
//     let jwtRefreshToken;
//     // const jwtAccessToken = createAccessToken(userInfo.id, -1);
//     // const jwtRefreshToken = createRefreshToken(userInfo.id, -1);

//     const exitUser = await client.user.findUnique({
//       where: {
//         email: userInfo.kakao_account.email
//       }
//     });
//     if (exitUser) {
//       jwtAccessToken = createAccessToken(exitUser.id, -1);
//       jwtRefreshToken = createRefreshToken(exitUser.id, -1);
//       const findsocialUser = await client.socialUser.findFirst({
//         where: {
//           socialId: userInfo.id.toString()
//         }
//       });
//       if (findsocialUser) {
//         // user가 있고 social이 있으니깐 그냥 로그인
//         // socialuser에 kakao_accesstoken 저장
//         await client.socialUser.update({
//           where: {
//             socialId: userInfo.id.toString()
//           },
//           data: {
//             accessToken: jwtAccessToken,
//             refreshToken: jwtRefreshToken
//           }
//         });
//         sendRefreshToken(res, jwtRefreshToken);

//         return res.json({
//           ok: true,
//           userInfo,
//           accessToken: jwtAccessToken
//           // 바꾸기
//           // accessToken: jwtAccessToken
//         });
//       } else {
//         // user가 있고 social이 없으니깐 local이 있는거라 해당 이메일로 연동할거냐고 물어봐야함

//         return res.json({
//           ok: true,
//           userId: exitUser.id,
//           message: 'have localuser and ask to need link social-login',
//           accessToken: jwtAccessToken,
//           reason: 1
//         });
//       }
//     } else {
//       try {
//         // user가 없어서 user create
//         const user = await client.user.create({
//           data: {
//             email: userInfo.kakao_account.email,
//             emailActive: true,
//             image: userInfo.kakao_account.profile.thumbnail_image_url || '',
//             name: userInfo.kakao_account.profile.nickname
//           }
//         });
//         // user도 만들고 social도 만듬
//         await client.socialUser.create({
//           data: {
//             socialId: userInfo.id.toString(),
//             type: 'kakao',
//             userId: user.id
//           }
//         });
//         jwtRefreshToken = createRefreshToken(user.id, -1);
//         jwtAccessToken = createAccessToken(user.id, -1);
//         sendRefreshToken(res, jwtRefreshToken);
//         return res.json({
//           ok: true,
//           userInfo: user,
//           accessToken: jwtAccessToken
//         });
//       } catch (error) {
//         console.error(error, 'user가 없어서 user create');
//       }
//     }
//   } catch (e: any) {
//     console.log(e, 'ERR');
//     res.json({
//       ok: false,
//       error: e.message
//     });
//   }
// };
// export default Kakao;
