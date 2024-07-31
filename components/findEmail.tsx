import Link from 'next/link';
import React from 'react';
import NextImage from 'next/image';
import Button from './button';

type FindEmailProps = {
  email: string;
  key: string;
};
function FindEmail({ email, key }: FindEmailProps) {
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
          <h1>계정찾기</h1>
          <p>
            아이디: <strong>{email}</strong>
          </p>
          <p>
            비밀번호 변경을 원하시면 아래 링크를 통해 변경하 실 수 있습니다.
          </p>
          <Link href={`/user/password?key=${key}`}>
            <Button isLoading={false} text="비밀번호 변경하기" />
          </Link>
        </div>
      </div>
    </>
  );
}

export default FindEmail;
