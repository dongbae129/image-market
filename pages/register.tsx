import Input from "@components/input";
import type { NextPage } from "next";
import { useForm } from "react-hook-form";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}
const Register: NextPage = () => {
  const { register, handleSubmit } = useForm<RegisterForm>();
  const onValid = (data: RegisterForm) => {
    console.log(data);
  };
  return (
    <div>
      <h3>Login Page</h3>
      <form onSubmit={handleSubmit(onValid)}>
        <Input
          label="이름"
          name="name"
          type="text"
          register={register("name", { required: true })}
          required
        />
        <Input
          label="아이디"
          name="userId"
          type="email"
          register={register("email", { required: true })}
          required
        />
        <Input
          label="비밀번호"
          name="password"
          type="password"
          register={register("password", { required: true })}
          required
        />
        <button>회원가입</button>
      </form>
    </div>
  );
};

export default Register;
