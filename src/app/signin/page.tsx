'use client';
import Button from '@app/_components/button';
import Input from '@app/_components/input';
import { AxiosError } from 'axios';
import type { NextPage } from 'next';
import Link from 'next/link';
import SvgData from '@/json/data.json';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setAccessToken, setLogedIn } from '@reducers/user';

import { userResponse } from '@app/_components/headmenu';
import SvgIcon from '@app/_components/svgIcon';
import { newAxios } from '@libs/client/fetcher';
import store from '@reducers/store';
import { useState } from 'react';
import SnsSign from '@app/_components/snsSign';
import { privateApi } from '@libs/client/axiosIntercepotr';

interface SignInForm {
  userId: string;
  password: string;
  formErrors?: string;
}
interface ErrorType {
  ok: boolean;
  meesage: string;
}
const Signin: NextPage = () => {
  const redirect_uri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${redirect_uri}&response_type=code`;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { restoreState } = store.getState().user;
  const { data } = useQuery<userResponse>({
    queryKey: ['userInfo'],
    enabled: !restoreState
  });
  const [errorMsg, setErrorMsg] = useState('');

  const { google, kakao, naver } = SvgData.SVG;
  if (data?.ok && data.user.id) router.push('/');
  // if (!restoreState) {
  //   router.push('/');
  // }

  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<SignInForm>();

  const signInUser = (data: SignInForm) =>
    privateApi.post('/api/login', data).then((res) => res.data);
  const { mutate, isPending } = useMutation({
    mutationFn: signInUser,
    onError: (error: AxiosError) => {
      setErrorMsg(error?.response?.data.message);
      alert(error.response.data.message);
    },
    onSuccess: (res) => {
      dispatch(setAccessToken(res.accessToken));
      // axios.defaults.headers.common['Authorization'] = '';

      // axios.defaults.headers.common['authorization'] =
      //   'Bearer ' + res.accessToken;
      // newAxios.defaults.headers.common['authorization'] =
      //   'Bearer ' + res.accessToken;

      // store.dispatch(setRestoreState(true));
      // store.dispatch(setLogedIn(true));
      queryClient.invalidateQueries({ queryKey: ['userInfo'] });
      router.push('/');
    }
  });

  const onValid = ({ userId, password }: SignInForm) => {
    if (isPending) return;
    if (userId === '' || password === '') {
      return setError('formErrors', { message: 'id and password is required' });
    }
    mutate({ userId, password });
  };

  return (
    <div className="signwrap">
      <div className="test">
        <SnsSign snsMessage="로그인" separationMessage="아이디로 로그인" />
        <div className="sign-login">
          <form onSubmit={handleSubmit(onValid)}>
            <div className="mt-1 mb-3">
              <Input
                label="id"
                name="userId"
                type="text"
                register={register('userId', { required: true })}
                required
              />
            </div>
            {/* <input type="text" name="abc" /> */}
            <div className="mt-1 mb-3">
              <Input
                label="password"
                name="password"
                type="password"
                register={register('password', { required: true })}
                required
              />
            </div>
            <div className="mt-8 h-10">
              <Button isLoading={isPending} text="LOGIN" />
            </div>
          </form>
        </div>
        <div className="errormsg">{errorMsg}</div>
      </div>
      <style jsx>{`
        .signwrap {
          max-width: 28rem;
          margin: auto;
          margin-top: 8rem;
        }
        form {
          margin-top: 2rem;
        }
        .errormsg {
          color: red;
        }
      `}</style>
    </div>
  );
};

export default Signin;
