import type { NextPage } from 'next';
import { useQuery } from 'react-query';
import { getFetch } from '@libs/client/fetcher';
import { userResponse } from './../index';
import Link from 'next/link';
import UploadImage from '@components/uploadImage';

const EditProfile: NextPage = () => {
  const { data } = useQuery<userResponse>(['userInfo'], getFetch('/api/user'), {
    // staleTime: 1000 * 60
  });
  return (
    <div>
      <div>
        <Link href="/profile/password/change">
          <a>
            <button>비밀번호 변경</button>
          </a>
        </Link>
      </div>
      <UploadImage
        component={['email', 'name']}
        elementType={['input', 'input']}
        url={`user/${data?.user?.id}`}
      />
      <div>{data?.user?.email}</div>
      <div>{data?.user?.name}</div>
      <div>{data?.user?.id}</div>
    </div>
  );
};

export default EditProfile;
