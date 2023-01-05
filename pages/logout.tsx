import axios from 'axios';
import type { NextPage } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Logout: NextPage = () => {
  const router = useRouter();

  const logout = async () => {
    await axios
      .post('/api/logout?type=local')
      .then(({ data }) => {
        if (data.ok) {
          delete axios.defaults.headers.common['authorization'];
          router.push('/');
        }
      })
      .catch((e) => console.log(e, 'error'));
  };
  logout();

  return <div>logout</div>;
};

export default Logout;
