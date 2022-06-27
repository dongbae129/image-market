import Button from '@components/button';
import Input from '@components/input';
import axios from 'axios';
import type { NextPage } from 'next';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { setAccessToken } from 'reducers/user';

interface SingInForm {
  userId: string;
  password: string;
  formErrors?: string;
}

const Signin: NextPage = () => {
  const redirect_uri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${redirect_uri}&response_type=code`;

  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<SingInForm>();

  const router = useRouter();
  const signInUser = (data: SingInForm) =>
    axios.post('/api/login', data).then((res) => res.data);
  const { mutate, isLoading } = useMutation(signInUser, {
    onError: (error) => {
      console.log(error, '%^%^%^');
    },
    onSuccess: (res) => {
      console.log(res, '$$');
      dispatch(setAccessToken(res.accessToken));
      // axios.defaults.headers.common['Authorization'] = '';

      axios.defaults.headers.common['authorization'] =
        'Bearer ' + res.accessToken;
      console.log(axios.defaults.headers, '$$$');
      router.push('/');
    }
  });

  const onValid = ({ userId, password }: SingInForm) => {
    if (isLoading) return;
    if (userId === '' || password === '') {
      return setError('formErrors', { message: 'id and password is required' });
    }
    mutate({ userId, password });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onValid)}>
        <Input
          label="ID"
          name="userId"
          type="text"
          register={register('userId', { required: true })}
          required
        />
        <Input
          label="PASSWORD"
          name="password"
          type="password"
          register={register('password', { required: true })}
          required
        />
        <Button isLoading={isLoading} text="LOGIN" />
      </form>
      {/* <button onClick={() => signIn('kakao')}>kakaoLogin</button> */}
      <button onClick={() => signIn('naver')}>naverLogin</button>
      <button onClick={() => signIn('credentials')}>credential</button>
      {/* <button onClick={kakaoLogin}>kakaoLogin</button> */}
      <a href={KAKAO_AUTH_URL}>
        <button>kakaoLogin</button>
      </a>
    </div>
  );
};

export default Signin;
