import ImageProduct from '@components/imageproduct';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { useInfiniteQuery, useQuery } from 'react-query';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { Product, User } from '@prisma/client';
import NextImage from 'next/image';
import { getFetch } from '@libs/client/fetcher';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

export interface GetProductsResponse {
  // ok: boolean;
  products: Product[];
}
export interface userResponse {
  ok: boolean;
  user: User;
}
const Home: NextPage = () => {
  const [mousehover, setMouseHover] = useState(false);
  const masonryColumn = 6;
  const divRef = useRef<number[]>([]);
  const countRef = useRef(null);
  const { accessToken } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const header = {
    headers: { authorization: `Bearer ${accessToken}` }
  };

  const { ref, inView } = useInView({
    threshold: 0.3
  });
  const getProducts = ({ pageParam = 1 }) =>
    axios.get(`/api/product?id=${pageParam}`).then((res) => res.data);

  // const { data } = useQuery(['getProducts'], getProducts);

  const { data, hasNextPage, fetchNextPage, isLoading } =
    useInfiniteQuery<GetProductsResponse>(
      ['getProducts'],

      getProducts,

      {
        getNextPageParam: (lastPage, allPage) => {
          // console.log(allPage, '@@@');
          if (lastPage.products.length === 0) return false;

          return lastPage.products[lastPage.products.length - 1].id + 1;
        }
      }
    );

  console.log(divRef.current, 'Ref');
  useEffect(() => {
    divRef.current = [];
    if (inView && hasNextPage) fetchNextPage();
  }, [inView]);

  const { data: userInfo } = useQuery<userResponse>(
    ['userInfo'],
    getFetch('/api/user'),
    {
      onSuccess: (res) => {
        console.log(res, 'res');
      }
    }
  );

  console.log(mousehover, 'M');

  return (
    <div className="main_wrap">
      <div className="menu">
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
          <Link href={'/imgspheretest'}>
            <a>
              <button>imgsphere</button>
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
          <Link href={'/threetest'}>
            <a>
              <button>threejs</button>
            </a>
          </Link>
          <Link href={'/thtest'}>
            <a>
              <button>fiber</button>
            </a>
          </Link>
        </div>
        <div>
          <Link href={`/profile/${userInfo?.user?.id}`}>
            <button>User</button>
          </Link>
          {/* {userInfo?.user ? (
            <Link href={`/profile/${userInfo?.user?.id}`}>
              {userInfo?.user?.name}
            </Link>
          ) : null}

          <br />
          {userInfo?.user?.email} */}
        </div>
      </div>

      <div className="product-wrap" ref={countRef}>
        <Masonry columnsCount={masonryColumn} gutter="2rem">
          {data ? (
            data?.pages?.map((v, j) =>
              v.products.map((product, i) => (
                <div
                  key={product.id}
                  className={`product`}
                  style={{
                    height: `${divRef.current[i] * (80 / masonryColumn)}vw`
                  }}
                  data-count={divRef.current[i + 1]}
                  ref={i === v.products.length - 1 ? ref : null}
                >
                  <Link href={`/product/${product.id}`} passHref>
                    <div className="imgwrap">
                      <NextImage
                        src={`/uploads/${product.image}`}
                        priority
                        alt=""
                        layout="fill"
                        onLoad={(v) => {
                          const num =
                            (v.target as HTMLImageElement).naturalWidth /
                            (v.target as HTMLImageElement).naturalHeight;

                          divRef.current.push(num);
                        }}
                      />
                    </div>
                  </Link>
                  <span>{product.title}</span>
                  <span>{product.description}</span>
                </div>
              ))
            )
          ) : (
            <></>
          )}
        </Masonry>
      </div>
      <style jsx>{`
        .main_wrap {
          width: 100%;
        }
        .menu {
          display: flex;
          justify-content: space-between;
        }
        .product-wrap {
          width: 80vw;
          margin: 0 auto;

          .product {
            cursor: pointer;

            > div {
              position: relative;
              width: 100%;
              height: 100%;
              border-radius: 10px;
              overflow: hidden;
            }
          }
        }
        .imgwrap:hover {
          filter: brightness(60%);
        }
      `}</style>
    </div>
  );
};

export default Home;
