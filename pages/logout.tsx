import axios from 'axios';
import type { NextPage } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQueryClient } from 'react-query';

const Logout: NextPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const logout = async () => {
    await axios
      .post('/api/logout?type=local')
      .then(({ data }) => {
        if (data.ok) {
          delete axios.defaults.headers.common['authorization'];
          queryClient.invalidateQueries(['userInfo']);
          router.push('/');
        }
      })
      .catch((e) => console.log(e, 'error'));
  };
  logout();

  return <div>logout</div>;
};

export default Logout;
