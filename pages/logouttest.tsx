import axios from 'axios';
import type { NextPage } from 'next';
import { useEffect } from 'react';

const Logouttest: NextPage = () => {
  useEffect(() => {
    const logout = async () => {
      await axios
        .post('/api/logouttest')
        .then(({ data }) => {
          console.log(data, 'logoutTest');
        })
        .catch((e) => console.log(e, 'error'));
    };
    logout();
  }, []);
  return <div>testttt</div>;
};

export default Logouttest;
