import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { getFetch } from './../../libs/client/fetcher';
import { userResponse } from './../index';

const UserProfile: NextPage = () => {
  const router = useRouter();

  const { data: userInfo } = useQuery<userResponse>(
    ['userInfo'],
    getFetch(`/api/user/${router.query.userId}`),
    {
      onSuccess: (res) => {
        console.log(res, 'res');
      },
      enabled: !!router.query.userId
    }
  );
  return (
    <div>
      <div>
        <div>
          <div>
            <img src="" alt="" />
          </div>
          <div>
            <span>Name</span>
            <h3>{userInfo?.user.name}</h3>
          </div>
          <div>
            <span>email</span>
            <h4>{userInfo?.user.email}</h4>
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
