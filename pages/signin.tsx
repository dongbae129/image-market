import Input from '@components/input';
import axios from 'axios';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';

interface SingInForm {
  userId: string;
  password: string;
  formErrors?: string;
}
const Signin: NextPage = () => {
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
    onSuccess: () => {
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
          type="email"
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
        <button>{isLoading ? 'Loading...' : 'LOGIN'}</button>
      </form>
    </div>
  );
};

export default Signin;
