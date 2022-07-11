import ImageProduct from '@components/imageproduct';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import styles from '../styles/Home.module.scss';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setAccessToken } from 'reducers/user';
import { Product } from '@prisma/client';
import Image from 'next/image';

interface GetProductsResponse {
  ok: boolean;
  products: Product[];
}
const Home: NextPage = () => {
  const { accessToken } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const header = {
    headers: { authorization: `Bearer ${accessToken}` }
  };

  const getProducts = () => axios.get('/api/product').then((res) => res.data);
  const { data, isLoading, error } = useQuery<GetProductsResponse>(
    ['getProducts'],
    getProducts
  );
  console.log(data, 'productsData');

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
  if (isLoading) return <div>Loading Products...</div>;
  if (error) return <div>Error...</div>;
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
      <div>
        {data?.products.map((product) => (
          <div key={product.id}>
            <span>{product.title}</span>
            <span>{product.description}</span>
            <Link href={`/product/${product.id}`} passHref>
              <div>
                <Image
                  src={`/uploads/${product.image}`}
                  alt=""
                  width={100}
                  height={100}
                />
              </div>
            </Link>
          </div>
        ))}
      </div>
      <style jsx>{``}</style>
    </>
  );
};

export default Home;
