import Input from '@components/input';
import axios from 'axios';
import type { NextPage } from 'next';

import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';

interface RegisterForm {
  name: string;
  userId: string;
  password: string;
  formErrors?: string;
}
// interface RegisterResponse {
//   ok: boolean;
//   error?: string;
//   message?: string
// }
const Register: NextPage = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<RegisterForm>();
  const signupUser = (data: RegisterForm) =>
    axios.post('/api/signup', data).then((res) => res.data);

  const signupMutate = useMutation(signupUser);

  // const { mutate, data, isLoading } = useMutation<
  //   RegisterResponse,
  //   any,
  //   RegisterForm
  // >((data) => axios.post('/api/signup', data).then((res) => res.data));
  const onValid = ({ name, userId, password }: RegisterForm) => {
    if (signupMutate.isLoading) return;
    if (userId === '' || password === '') {
      return setError('formErrors', { message: 'id and password is required' });
    }

    signupMutate.mutateAsync({ name, userId, password }).then((res) => {
      console.log(res.data);
      setError('formErrors', { message: res.data.error });
    });
  };

  return (
    <div>
      <h3>Login Page</h3>
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
          type="email"
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
        {errors.formErrors ? <span>{errors.formErrors.message}</span> : null}
        <button>회원가입</button>
      </form>
    </div>
  );
};

export default Register;
