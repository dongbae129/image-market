import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/server/client';
import axios from 'axios';
const logoutTest = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client_secret = process.env.NEXT_PUBLIC_KAKAO_CLIENT_SECRET;
    const client_id = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
    const socialUser = await client.socialUser.findUnique({
      where: {
        id: 1
      }
    });

    const userInfo = await axios
      .post(
        'https://kapi.kakao.com/v1/user/logout',
        {},
        {
          headers: {
            // Authorization: `Bearer ${socialUser?.accessToken}`
            Authorization: `Bearer w9SDvXceKhxFTLZ6Cz1_hMBoh8stoOUT9nbRNuIACj1zFwAAAYGuZed6`
          }
        }
      )
      .then((res) => {
        return res.data;
      })
      .catch(async (e) => {
        console.error(e, 'EEEEEEEEE');
        const { data: renweal } = await axios.post(
          `https://kauth.kakao.com/oauth/token?grant_type=refresh_token&client_id=${client_id}&refresh_token=${socialUser?.refreshToken}&client_secret=${client_secret}`,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
          }
        );
        await client.socialUser.update({
          where: {
            id: 1
          },
          data: {
            accessToken: renweal.access_token
          }
        });
        console.log(renweal, '토큰 갱신');
      });
    console.log(userInfo);

    return res.json({
      ok: true
    });
  } catch (e) {
    console.log(e, 'api logouttest error');
    return res.json({
      ok: false
    });
  }
};
export default logoutTest;
