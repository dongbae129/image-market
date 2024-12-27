'use client';
import Button from '@components/button';
import Input from '@components/input';
import { User } from '@prisma/client';
import axios from 'axios';
import type { NextPage } from 'next';

import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { userResponse } from '@components/headmenu';
import SnsSign from '@components/snsSign';

interface RegisterForm {
  name: string;
  userId: string;
  password: string;
  email: string;
  formErrors?: string;
}
interface RegisterResponse {
  ok: boolean;
  error?: string;
  message?: string;
  user: User;
}
const Register: NextPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<RegisterForm>();

  const { data } = useQuery<userResponse>({ queryKey: ['userInfo'] });
  if (data?.ok && data.user.id) router.push('/');
  const signupUser = (data: RegisterForm) =>
    axios.post('/api/signup', data).then((res) => res.data);

  const signupMutate = useMutation({ mutationFn: signupUser });
  const onValid = ({ name, userId, password, email }: RegisterForm) => {
    if (signupMutate.isPending) return;
    if (userId === '' || password === '' || email === '') {
      return setError('formErrors', { message: 'please input everything' });
    }
    // mutate({ name, password, userId });
    signupMutate
      .mutateAsync({ name, userId, password, email })
      .then((res: RegisterResponse) => {
        console.log(res, '^%^%^%^');
        return res.ok ? router.push('/signin') : null;
        // res.ok ? router.push('/signin') : null;
        // if (res.data.error) setError('formErrors', { message: res.data.error });
      });
  };

  return (
    <div className="registerwrap">
      <SnsSign
        snsMessage="회원가입"
        separationMessage="회원가입에 필요한 기본정보를 입력해주세요."
      />
      <form onSubmit={handleSubmit(onValid)}>
        <div className="mt-1 mb-3">
          <Input
            label="name"
            name="name"
            type="text"
            register={register('name', { required: true })}
            required
          />
        </div>
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
        <div className="mt-1 mb-3">
          <Input
            label="email"
            name="email"
            type="email"
            register={register('email', { required: true })}
            required
          />
        </div>
        {errors.formErrors ? <span>{errors.formErrors.message}</span> : null}
        <div className="mt-8">
          <Button isLoading={signupMutate.isPending} text="회원가입" />
        </div>
      </form>
      <style jsx>{`
        .registerwrap {
          max-width: 28rem;
          margin: auto;
          margin-top: 4rem;
        }
        h2 {
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default Register;
