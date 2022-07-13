import ImageProduct from '@components/imageproduct';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { useQuery } from 'react-query';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { Product } from '@prisma/client';
import Image from 'next/image';
import { getFetch } from '@libs/client/fetcher';

interface GetProductsResponse {
  ok: boolean;
  products: Product[];
}
export interface userResponse {
  ok: boolean;
  user: {
    email: string;
    name: string;
    id: number;
  };
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

  const { data: userInfo } = useQuery<userResponse>(
    ['userInfo'],
    getFetch('/api/user'),
    {
      onSuccess: (res) => {
        console.log(res, 'res');
      }
    }
  );
  if (isLoading) return <div>Loading Products...</div>;
  if (error) return <div>Error...</div>;
  return (
    <>
      <div className="main_wrap">
        <div>
          <Head>
            <title>이름 못정했어</title>
            <meta name="description" content="Main Title" />
          </Head>

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
          <Link href={`/profile/${userInfo?.user.id}`}>
            {userInfo?.user.name}
          </Link>
          <br />
          {userInfo?.user.email}
        </div>
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
      <style jsx>{`
        .main_wrap {
          display: flex;
        }
      `}</style>
    </>
  );
};

export default Home;
