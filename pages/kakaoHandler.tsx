import { newAxios } from '@libs/client/fetcher';
import axios from 'axios';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface LoginResponse {
  ok: boolean;
  accessToken: string;
  userInfo: any;
}
const KakaoHandler: NextPage = () => {
  const router = useRouter();
  console.log(router, 'RR');
  // let params;
  // let code: string;
  // if (typeof window !== 'undefined') {
  //   console.log(window.location, 'QQ');
  //   params = new URL(window && window.location.toString()).searchParams;
  //   code = params.get('code')!;
  // }
  // // const params = new URL(window && window.location.toString()).searchParams;
  // // const code = params.get('code'); // 인가코드 받는 부분
  // useQuery(
  //   ['userInfos'],
  //   () => axios.get<LoginResponse>(`/api/oauth/kakao?code=${code}`),
  //   {
  //     onSuccess: (res) => {
  //       axios.defaults.headers.common[
  //         'Authorization'
  //       ] = `Bearer ${res.data.accessToken}`;
  //       res.data.userInfo ? router.push('/') : null;
  //     }
  //     // enabled: !!code
  //   }
  // );
  useEffect(() => {
    const params = new URL(window.location.toString()).searchParams;
    const code = params.get('code'); // 인가코드 받는 부분
    console.log(code, 'Cde');
    axios.get<LoginResponse>(`/api/oauth/kakao?code=${code}`).then((res) => {
      axios.defaults.headers.common[
        'authorization'
      ] = `Bearer ${res.data.accessToken}`;
      res.data.userInfo ? router.push('/') : null;
    });
  }, []);

  return <div>카톡 로그인중</div>;
};

export default KakaoHandler;
