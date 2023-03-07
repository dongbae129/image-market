import { userResponse } from '@components/headmenu';
import Input from '@components/input';
import axios from 'axios';
import type { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import Button from '@components/button';

interface UserCheck {
  password: string;
  prevPassword: string;
  passwordCheck: string;
}

const Security: NextPage = () => {
  const { register, handleSubmit } = useForm<UserCheck>();
  const { data } = useQuery<userResponse>(['userInfo']);
  console.log(data, 'logined user info');
  const checkPassword = (checkPass: UserCheck) =>
    axios
      .post(`/api/user/${data?.user.id}/security`, checkPass)
      .then((res) => res.data);
  const { mutate, isLoading } = useMutation(checkPassword);

  const onValid = ({ prevPassword, password, passwordCheck }: UserCheck) => {
    if (isLoading) return;
    if (!password || !prevPassword || !passwordCheck) {
      alert('비밀번호를 입력 해주세요');
      return;
    }
    if (password !== passwordCheck) {
      alert('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }
    const info = {
      userId: data?.user.id,
      prevPassword,
      password,
      passwordCheck
    };
    info.userId = data?.user.id;
    mutate(info);
  };
  return (
    <div className="securitywrap">
      <div className="security">
        <div></div>
        <div></div>
        <div></div>
        <div>
          <form onSubmit={handleSubmit(onValid)}>
            <Input
              label="prevPassword"
              name="prevPassword"
              type="password"
              required
              register={register('prevPassword', { required: true })}
            />
            <Input
              label="password"
              name="password"
              type="password"
              required
              register={register('password', { required: true })}
            />
            <Input
              label="passwordCheck"
              name="passwordCheck"
              type="password"
              required
              register={register('passwordCheck', { required: true })}
            />
            <div>
              <Button isLoading={false} text="LOGIN" />
            </div>
          </form>
        </div>
      </div>
      <style jsx>{`
        .securitywrap {
          display: flex;
          position: absolute;
          width: 100%;
          height: calc(100% - 70px);
          justify-content: center;
          align-items: center;
        }
        .security {
          width: 450px;
          padding: 48px 40px 36px;
          box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default Security;
