import Button from '@components/button';
import Input from '@components/input';
import axios, { AxiosError } from 'axios';
import type { NextPage } from 'next';
import Link from 'next/link';
import SvgData from 'json/data.json';
import cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import {
  removeAccessToken,
  setAccessToken,
  setLogedIn,
  setRestoreState
} from 'reducers/user';

import { userResponse } from '@components/headmenu';
import SvgIcon from '@components/svgIcon';
import { newAxios } from '@libs/client/fetcher';
import store from 'reducers/store';
import { useEffect, useState } from 'react';
import worker from '../mocks/browser';

interface SingInForm {
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
  const { data } = useQuery<userResponse>(['userInfo'], {
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
  } = useForm<SingInForm>();

  const signInUser = (data: SingInForm) =>
    newAxios.post('/api/login', data).then((res) => res.data);
  const { mutate, isLoading } = useMutation(signInUser, {
    onError: (error: AxiosError) => {
      console.log(error.response.data.message, 'eresponse');
      setErrorMsg(error?.response?.data.message);
      alert(error.response.data.message);
    },
    onSuccess: (res) => {
      dispatch(setAccessToken(res.accessToken));
      // axios.defaults.headers.common['Authorization'] = '';

      // axios.defaults.headers.common['authorization'] =
      //   'Bearer ' + res.accessToken;
      console.log(res, 'component res');
      newAxios.defaults.headers.common['authorization'] =
        'Bearer ' + res.accessToken;

      // store.dispatch(setRestoreState(true));
      store.dispatch(setLogedIn(true));
      queryClient.invalidateQueries(['userInfo']);
      router.push('/');
    }
  });

  const onValid = ({ userId, password }: SingInForm) => {
    console.log(userId, 'user');
    if (isLoading) return;
    if (userId === '' || password === '') {
      return setError('formErrors', { message: 'id and password is required' });
    }
    mutate({ userId, password });
  };

  return (
    <div className="signwrap">
      <input type="text" data-testid="abc" name="abc" />
      <div className="test">
        <div className="sign-head">
          <h2 data-testid="testh">환영합니다</h2>
        </div>
        <div className="sign-login">
          <div className="sign-login-sns">
            <span>SNS 로그인</span>
            <div className="sign-login-sns_main">
              <Link href={KAKAO_AUTH_URL}>
                <a className="sns_main_link">
                  <div
                    style={{ width: '25px', height: '25px', margin: 'auto' }}
                  >
                    <SvgIcon svgInfo={kakao} viewBox="0 0 25 25" />
                    {/* <RiKakaoTalkFill /> */}
                  </div>
                </a>
              </Link>
              <Link href={'#'}>
                <a className="sns_main_link">
                  <div
                    style={{ width: '25px', height: '25px', margin: 'auto' }}
                  >
                    <SvgIcon svgInfo={naver} viewBox="0 0 25 25" />
                    {/* <SiNaver /> */}
                  </div>
                </a>
              </Link>
              <Link href={'#'}>
                <a className="sns_main_link">
                  <div
                    style={{ width: '25px', height: '25px', margin: 'auto' }}
                  >
                    <SvgIcon svgInfo={google} viewBox="0 0 48 48" />
                  </div>
                  {/* <FcGoogle size={25} /> */}
                </a>
              </Link>
              {/* <a href={KAKAO_AUTH_URL}>
              <button>kakaoLogin</button>
            </a> */}
            </div>
            <div className="sign-login-local_text">
              <span>아이디로 로그인</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onValid)}>
            <Input
              label="id"
              name="userId"
              type="text"
              register={register('userId', { required: true })}
              required
            />
            {/* <input type="text" name="abc" /> */}
            <Input
              label="password"
              name="password"
              type="password"
              register={register('password', { required: true })}
              required
            />
            <div>
              <Button isLoading={isLoading} text="LOGIN" />
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
        .sign-head {
          text-align: center;
        }
        .sign-login-sns > span {
          font-weight: 500;
          line-height: 1.25rem;
        }
        .sign-login-sns_main {
          margin-top: 0.5rem;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0.75rem;
        }
        .sns_main_link {
          box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
          text-align: center;
          border-radius: 5px;
          padding: 0.5rem;
        }
        .sign-login-local_text {
          display: flex;
          justify-content: center;
          margin-top: 1.75rem;
          position: relative;
          > span {
            background-color: white;
            color: rgba(0, 0, 0, 0.45);
            padding-left: 0.5rem;
            padding-right: 0.5rem;
            font-weight: 600;
          }
          > span::before {
            content: '';
            position: absolute;

            z-index: -1;
            width: 100%;
            top: 50%;
            left: 0;
            border-top: 1px solid rgba(0, 0, 0, 0.16);
          }
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
