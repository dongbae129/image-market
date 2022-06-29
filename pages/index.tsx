import ImageProduct from '@components/imageproduct';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import styles from '../styles/Home.module.scss';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setAccessToken } from 'reducers/user';

const Home: NextPage = () => {
  // const { data: ddata, status } = useSession();
  // const csrfToekn = getCsrfToken();
  // csrfToekn
  //   .then((res) => {
  //     console.log(res, 'RES');
  //   })
  //   .catch((err) => {
  //     console.log(err, 'ERR');
  //   });
  // console.log(ddata, 'ddata');

  // console.log(status, 'status');

  const { accessToken } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const header = {
    headers: { authorization: `Bearer ${accessToken}` }
  };

  const getUserFetcher = () => axios.get('/api/user').then((res) => res.data);
  // const { data } = useQuery(['userInfo'], getUserFetcher, {
  //   onSuccess: (res) => {
  //     dispatch(setAccessToken(res.accessToken));
  //     axios.defaults.headers.common['authorization'] = '';
  //     axios.defaults.headers.common[
  //       'authorization'
  //     ] = `Bearer ${res.accessToken}`;
  //     // console.log(axios.defaults.headers.common['Authorization'], 'index');
  //   },
  //   onError: (res) => {
  //     console.log(res, '!');
  //   }
  // });

  return (
    <>
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
            <button>logout</button>
          </a>
        </Link>

        <Link href={'/logouttest'}>
          <a>
            <button>Logout Test</button>
          </a>
        </Link>
        <Link href={'/products'}>
          <a>
            <button>Products</button>
          </a>
        </Link>
        <Link href={'/upload'}>
          <a>
            <button>Product Upload</button>
          </a>
        </Link>
        <Link href={'/board'}>
          <a>
            <button>Board</button>
          </a>
        </Link>
        <Link href={'/payment'}>
          <a>
            <button>Pay</button>
          </a>
        </Link>
        <Link href={'/certification'}>
          <a>
            <button>certification</button>
          </a>
        </Link>
      </div>
      {/* <p>{ddata?.user?.name}</p> */}
      {/* <p>{data?.message || data?.error}</p> */}
    </>
  );
};

export default Home;
