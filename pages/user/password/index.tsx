import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import NextImage from 'next/image';
import Input from '@components/input';
import { useForm } from 'react-hook-form';
import Button from '@components/button';
import axios from 'axios';

type ModifyPassword = {
  password: string;
  passwordCheck: string;
};
function ModifyPassword() {
  const [isSubmit, setIsSubmit] = useState(false);
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError
  } = useForm<ModifyPassword>();

  const { key } = router.query;
  const onValid = async ({ password, passwordCheck }: ModifyPassword) => {
    if (isSubmit) return;
    setIsSubmit(true);
    if (password === '' || passwordCheck === '') {
      setError('passwordCheck', { message: 'input password' });
      setIsSubmit(false);
    }
    if (password !== passwordCheck) {
      setError('passwordCheck', { message: "Password doesn't match" });
      setIsSubmit(false);
    }
    try {
      await axios.post('/api/user/password', {
        key,
        password,
        passwordCheck
      });
      router.replace('/signin');
    } catch (error) {
      console.error(error, 'fail update password');
      setIsSubmit(false);
    }
  };
  return (
    <>
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
          <h2>변경하실 비밀번호를 입력해주세요.</h2>
          <div>
            <form onSubmit={handleSubmit(onValid)}>
              <Input
                name="password"
                label="password"
                type="password"
                register={register('password', { required: true })}
              />
              <Input
                name="passwordCheck"
                label="passwordCheck"
                type="password"
                register={register('passwordCheck', { required: true })}
              />
              <div className="button_wrap">
                <Button
                  disabled={isSubmit}
                  isLoading={false}
                  text={isSubmit ? '비밀번호 변경중' : '비밀번호 변경'}
                />
              </div>
            </form>
            {errors.passwordCheck && (
              <div className="mt-7">
                <div className="p-4 bg-blue-50 border-red-100 rounded-md border">
                  <div>
                    <div className="flex">
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                          data-slot="icon"
                          className="h-5 w-5 text-red-800 dark:text-red-200"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm text-red-800 font-semibold">
                          비밀번호 변경 실패
                        </h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>{errors.passwordCheck.message}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
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

        form {
          margin-top: 2rem;
        }
        .button_wrap {
          margin-top: 3rem;
        }
        .error_message {
        }
      `}</style>
    </>
  );
}

export default ModifyPassword;
