import Button from '@components/button';
import Input from '@components/input';
import React, { useEffect, useState } from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import ForgotPassword from './_component/forgot';

type HelpForm = {
  email: string;
};
function FindAccount() {
  const [showA, setShowA] = useState(false);
  const [myEmail, setMyEmail] = useState('');

  const { handleSubmit, register } = useForm<HelpForm>();
  const onValid = async ({ email }: HelpForm) => {
    console.log(email, 'email');
    try {
      await axios.post('/api/find', {
        email
      });
      setShowA(true);
      setMyEmail(email);
    } catch (error) {
      console.error('email send fail');
      alert('이메일 전송에 실패 했습니다');
    }
  };
  return (
    <>
      {showA ? (
        <ForgotPassword email={myEmail} />
      ) : (
        <div className="helpid">
          <div>
            <div className="gohome">
              <Link href={'/'}>
                <a>
                  <NextImage
                    src={'/localimages/emptyuser.png'}
                    height="48px"
                    width="48px"
                  />
                </a>
              </Link>
            </div>
            <h2>계정찾기</h2>
            <div>
              <span className="helpinfo">
                회원 가입시 입력하신 이메일 주소를 입력하시면,
                <br />
                해당 이메일로 아이디 및 비밀번호 변경 링크를 보내드립니다.
              </span>
              <form onSubmit={handleSubmit(onValid)}>
                <Input
                  name="email"
                  label="email"
                  type="text"
                  register={register('email', { required: true })}
                />
                <div>
                  <Button isLoading={false} text="계정찾기" />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .helpid {
          display: flex;
          justify-content: center;
          position: relative;
          margin-top: 8rem;
          > div {
            max-width: 28rem;
            width: 100%;
          }
        }
        .gohome {
          width: 100%;
          display: flex;
          justify-content: center;
        }
        h2 {
          font-weight: 700;
          font-size: 1.875rem;
          text-align: center;
          line-height: 2.25rem;
          margin-top: 1.5rem;
        }
        .helpinfo {
          display: flex;
          justify-content: center;
          text-align: center;
          font-size: 0.875rem;
          color: rgb(75, 85, 99);
          margin-top: 0.5rem;
        }
        form {
          margin-top: 2rem;
        }
      `}</style>
    </>
  );
}

export default FindAccount;
