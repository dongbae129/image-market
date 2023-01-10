import Button from '@components/button';
import Input from '@components/input';
import { User } from '@prisma/client';
import axios from 'axios';
import type { NextPage } from 'next';

import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';

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
  const signupUser = (data: RegisterForm) =>
    axios.post('/api/signup', data).then((res) => res.data);

  const signupMutate = useMutation(signupUser);
  const onValid = ({ name, userId, password, email }: RegisterForm) => {
    if (signupMutate.isLoading) return;
    if (userId === '' || password === '' || email === '') {
      return setError('formErrors', { message: 'please input everything' });
    }
    // mutate({ name, password, userId });
    signupMutate
      .mutateAsync({ name, userId, password, email })
      .then((res: RegisterResponse) => {
        console.log(res, '^%^%^%^');
        res.ok ? router.push('/signin') : null;
        // if (res.data.error) setError('formErrors', { message: res.data.error });
      });
  };

  return (
    <div className="registerwrap">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit(onValid)}>
        <Input
          label="이름"
          name="name"
          type="text"
          register={register('name', { required: true })}
          required
        />
        <Input
          label="아이디"
          name="userId"
          type="text"
          register={register('userId', { required: true })}
          required
        />
        <Input
          label="비밀번호"
          name="password"
          type="password"
          register={register('password', { required: true })}
          required
        />
        <Input
          label="이메일"
          name="email"
          type="email"
          register={register('email', { required: true })}
          required
        />
        {errors.formErrors ? <span>{errors.formErrors.message}</span> : null}
        <Button isLoading={signupMutate.isLoading} text="회원가입" />
      </form>
      <style jsx>{`
        .registerwrap {
          max-width: 28rem;
          margin: auto;
        }
        h2 {
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default Register;
