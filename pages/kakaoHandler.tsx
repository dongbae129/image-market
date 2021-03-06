import axios from 'axios';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface LoginResponse {
  ok: boolean;
  accessToken: string;
  refresh?: string;
  reason?: number;
  userInfo: any;
  userId: number;
}
const KakaoHandler: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    const params = new URL(window.location.toString()).searchParams;
    const code = params.get('code'); // 인가코드 받는 부분
    console.log(code, 'Cde');
    axios
      .get<LoginResponse>(`/api/oauth/kakao?code=${code}`)
      .then(async (res) => {
        // axios.defaults.headers.common['Authorization'] = '';
        if (res.data.reason === 1) {
          if (confirm('해당 이메일이 존재합니다, 연동 하시겠습니까?')) {
            axios.defaults.headers.common[
              'authorization'
            ] = `Bearer ${res.data.accessToken}`;
            const lintResponse = await axios.get(
              `/api/oauth/link?linkask=true&type=kakao&user=${res.data.userId}`
            );

            router.replace('/');
          } else {
            router.replace('signin');
          }
        }
        axios.defaults.headers.common[
          'authorization'
        ] = `Bearer ${res.data.accessToken}`;
        res.data.userInfo ? router.replace('/') : null;
      });
  }, []);

  return <div>카톡 로그인중</div>;
};

export default KakaoHandler;
