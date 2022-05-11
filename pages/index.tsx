import ImageProduct from '@components/imageproduct';
import Layout from '@components/layout';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import styles from '../styles/Home.module.scss';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setAccessToken } from 'reducers/user';

const Home: NextPage = () => {
  const { accessToken } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const header = {
    headers: { Authorization: `Bearer ${accessToken}` }
  };

  const getUserFetcher = () =>
    axios.get('/api/user', header).then((res) => res.data);
  const { data } = useQuery(['userInfo'], getUserFetcher, {
    onSuccess: (res) => {
      dispatch(setAccessToken(res.accessToken));
      // axios.defaults.headers.common['Authorization'] = '';
      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${res.accessToken}`;
      // console.log(axios.defaults.headers.common['Authorization'], 'index');
    },
    onError: (res) => {
      console.log(res, '!');
    }
  });

  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>이름 못정했어</title>
          <meta name="description" content="Main Title" />
        </Head>
        {[1, 2, 3, 4, 5].map((v) => (
          <ImageProduct key={v} />
        ))}
        <Link href={'/register'}>
          <a>
            <button>SIGNUP</button>
          </a>
        </Link>
        <Link href={'/signin'}>
          <a>
            <button>SIGNIN</button>
          </a>
        </Link>
        <Link href={'/test'}>
          <a>
            <button>Test User</button>
          </a>
        </Link>
        <Link href={'/products'}>
          <a>
            <button>Products</button>
          </a>
        </Link>
      </div>
      <p>{data?.message || data?.error}</p>
    </Layout>
  );
};

export default Home;
