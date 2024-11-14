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
import { getTest } from './_lib/getTest';

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
  const { data: testData } = useQuery({
    queryKey: ['test'],
    queryFn: getTest
  });

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
        res.ok ? router.push('/signin') : null;
        // res.ok ? router.push('/signin') : null;
        // if (res.data.error) setError('formErrors', { message: res.data.error });
      });
  };

  return (
    <div className="registerwrap">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit(onValid)}>
        <Input
          label="name"
          name="name"
          type="text"
          register={register('name', { required: true })}
          required
        />
        <Input
          label="id"
          name="userId"
          type="text"
          register={register('userId', { required: true })}
          required
        />
        <Input
          label="password"
          name="password"
          type="password"
          register={register('password', { required: true })}
          required
        />
        <Input
          label="email"
          name="email"
          type="email"
          register={register('email', { required: true })}
          required
        />
        {errors.formErrors ? <span>{errors.formErrors.message}</span> : null}
        <Button isLoading={signupMutate.isPending} text="회원가입" />
      </form>
      <style jsx>{`
        .registerwrap {
          max-width: 28rem;
          margin: auto;
          margin-top: 8rem;
        }
        h2 {
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default Register;
