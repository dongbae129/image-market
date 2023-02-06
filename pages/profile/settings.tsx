import type { NextPage } from 'next';
import { useQuery } from 'react-query';
import { getFetch } from '@libs/client/fetcher';

import Link from 'next/link';
import UploadImage from '@components/uploadImage';
import { userResponse } from '@components/headmenu';
import NextImage from 'next/image';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const EditProfile: NextPage = () => {
  const [imagePreview, setImagePreview] = useState('');
  const { data } = useQuery<userResponse>(['userInfo'], getFetch('/api/user'), {
    // staleTime: 1000 * 60
  });
  const { watch, register } = useForm();
  const imageWatch = watch('image');

  useEffect(() => {
    if (imageWatch && imageWatch.length > 0) {
      const file = imageWatch[0];
      setImagePreview(URL.createObjectURL(file));
    }
  }, [imageWatch]);
  if (!data?.ok) return <div>로그인 해주세요</div>;
  return (
    <div className="pfsettingwrap">
      <div>
        <UploadImage
          component={['email', 'name', 'password', 'passwordcheck']}
          elementType={['input', 'input', 'input', 'input']}
          url={`user/${data?.user?.id}`}
          buttontext={'수정'}
          elementValue={{
            이메일: data?.user.email,
            이름: data?.user.name,
            비밀번호: '',
            '비밀번호 확인': ''
          }}
          image={data?.user?.image}
          hashtrue={false}
        />
      </div>
      <style jsx>{`
        .pfsettingwrap {
          display: flex;
          justify-content: center;
          margin-top: 2rem;

          > div {
            max-width: 400px;
            width: 400px;
          }
        }
      `}</style>
    </div>
  );
};

export default EditProfile;
