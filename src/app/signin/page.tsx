'use client';
import Button from '@app/_components/button';
import Input from '@app/_components/input';
import axios, { AxiosError } from 'axios';
import type { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { userResponse } from '@app/_components/headmenu';
import store from '@reducers/store';
import { useState } from 'react';
import SnsSign from '@app/_components/snsSign';

interface SignInForm {
  userId: string;
  password: string;
  formErrors?: string;
}

const Signin: NextPage = () => {
  // const { restoreState } = store.getState().user;
  // const { data } = useQuery<userResponse>({
  //   queryKey: ['userInfo'],
  //   enabled: !restoreState
  // });
  const [errorMsg, setErrorMsg] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { register, handleSubmit, setError } = useForm<SignInForm>();

  const signInUser = (data: SignInForm) =>
    axios.post('/api/auth/login', data).then((res) => res.data);
  const { mutate, isPending } = useMutation({
    mutationFn: signInUser,
    onError: (error: AxiosError<{ message: string }>) => {
      const errorMessage =
        error.response?.data?.message || '로그인 실패했습니다';
      setErrorMsg(errorMessage);
      alert(errorMessage);
    },
    onSuccess: () => {
      setIsRedirecting(true);
      window.location.href = '/';
    }
  });

  const onValid = ({ userId, password }: SignInForm) => {
    if (isPending) return;
    if (userId === '' || password === '') {
      return setError('formErrors', { message: 'id and password is required' });
    }
    mutate({ userId, password });
  };
  const isLoading = isPending || isRedirecting;

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
