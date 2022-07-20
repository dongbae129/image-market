import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { getFetch } from '@libs/client/fetcher';
import { userResponse } from '../index';
import Link from 'next/link';

const UserProfile: NextPage = () => {
  const router = useRouter();

  const { data } = useQuery<userResponse>(
    ['userInfo'],
    getFetch(`/api/user/${router.query.name}`),
    {
      enabled: !!router.query.name,
      staleTime: 1000 * 60
    }
  );
  return (
    <div>
      <div>
        <Link href="/profile/settings">
          <a>
            <button>설정</button>
          </a>
        </Link>
      </div>
      <div>
        <div>
          <div>{/* <img src="" alt="" /> */}</div>
          <div>
            <span>name</span>
            <h3>{data?.user?.name}</h3>
          </div>
          <div>
            <span>email</span>
            <h4>{data?.user?.email}</h4>
          </div>
        </div>
        <div>
          <h3>사진태그</h3>
          <span>#11</span>
          <span>#22</span>
          <span>#33</span>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
