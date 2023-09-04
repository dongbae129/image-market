import type { NextPage } from 'next';

import Link from 'next/link';

import { useInfiniteQuery, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { Product, User } from '@prisma/client';
import NextImage from 'next/future/image';
import { getFetch, newAxios } from '@libs/client/fetcher';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

import Sidebar from '@components/sidebar';
import HeadMenu, { userResponse } from '@components/headmenu';
import Image from 'next/future/image';

import UserCard from '@components/userCard';

// const keyStr =
//   'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

// const triplet = (e1: number, e2: number, e3: number) =>
//   keyStr.charAt(e1 >> 2) +
//   keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
//   keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
//   keyStr.charAt(e3 & 63);

// const rgbDataURL = (r: number, g: number, b: number) =>
//   `data:image/gif;base64,R0lGODlhAQABAPAA${
//     triplet(0, r, g) + triplet(b, 255, 255)
//   }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`;
export interface GetProductsResponse {
  // ok: boolean;
  products: Product[];
}

interface IndexProductImageType {
  width: number;
  height: number;
  src: string;
  id: number;
  title: string;
  description: string;
}
const Home: NextPage = () => {
  // const [mousehover, setMouseHover] = useState(false);
  // const masonryColumn = 4;
  const divRef = useRef<number[]>([]);
  const countRef = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();
  const { accessToken } = useSelector((state: any) => state.user);
  // const dispatch = useDispatch();
  const header = {
    headers: { authorization: `Bearer ${accessToken}` }
  };

  const { ref, inView } = useInView({
    threshold: 0.3
  });
  const [divWidth, setDivWidth] = useState(0);

  const getProducts = ({ pageParam = 0 }) =>
    newAxios.get(`/api/product?id=${pageParam}`).then((res) => res.data);

  // const getProducts = async ({ pageParam = 1 }) => {
  //   const { products } = await axios
  //     .get(`/api/product?id=${pageParam}`)
  //     .then((res) => res.data);
  //   const imagePromise = products.map((product: Product) => {
  //     return new Promise((resolve, reject) => {
  //       const blobTest = new Blob();
  //       blobTest.slice();
  //       const img = new Image();
  //       img.src = `/uploads/${product.image}`;
  //       img.onload = () =>
  //         resolve({
  //           // width: countRef.current?.clientWidth / 3,
  //           width: img.naturalWidth,
  //           height: img.naturalHeight,
  //           // height:
  //           //   ((img.naturalHeight / img.naturalWidth) *
  //           //     countRef.current?.clientWidth) /
  //           //   3,
  //           src: `/uploads/${decodeURIComponent(product.image)}`,
  //           // src: `/uploads/${product.image}`,
  //           id: product.id,
  //           title: product.title,
  //           description: product.description
  //         });
  //       img.onerror = (error) => reject(error);
  //     });
  //   });
  //   const images = await Promise.all(imagePromise);
  //   return images;
  // };

  // const { data } = useQuery(['getProducts'], getProducts);
  // console.log(data, 'Data');
  // product data 가져오기
  const { data, hasNextPage, fetchNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery<any>(['getProducts'], getProducts, {
      getNextPageParam: (lastPage, allPage) => {
        const lastPageLength = lastPage.products.length;
        if (lastPageLength === 0 || lastPageLength < 6) return false;
        return lastPageLength >= 6 && lastPage.products[lastPageLength - 1].id;
      }
    });

  useEffect(() => {
    if (countRef.current) {
      const test = +window
        .getComputedStyle(countRef.current)
        .getPropertyValue('width')
        .slice(0, -2);

      const size =
        +window
          .getComputedStyle(countRef.current)
          .getPropertyValue('font-size')
          .slice(0, -2) * 3;
      setDivWidth((test - size) / 4);
      console.log('in');
    }
    console.log('out');
  }, []);

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);

  const { data: userInfo } = useQuery<userResponse>(
    ['userInfo'],
    getFetch('/api/user', header)
  );

  return (
    <div className="main_wrap">
      {/* <div className="menu">
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
       
        </div>
      </div> */}
      <div className="main_header flex w-[94vw] h-[500px] m-auto mb-12">
        <div className="banner rounded-lg overflow-hidden border border-[#e3e5e8] shadow-md w-[75%] max-lg:w-full relative">
          <button className='bg-[url("/localimages/left-arrow.svg")] arrow'></button>
          <NextImage
            src={'/localimages/banner.webp'}
            alt="banner"
            fill={true}
          />
          <button className='bg-[url("/localimages/right-arrow.svg")] arrow right-0'></button>
        </div>
        <div className="profile shadow-lg border border-[#e3e5e8] ml-7 w-auto min-w-[320px] h-40 rounded-lg max-lg:hidden overflow-hidden p-5 flex flex-col justify-between">
          <UserCard logedIn={userInfo?.ok} userInfo={userInfo} />
        </div>
      </div>
      <div className="product-wrap" ref={countRef}>
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 350: 2, 750: 3, 900: 5, 1200: 6 }}
        >
          <Masonry
            /*columnsCount={masonryColumn}*/ gutter="1em"
            className="mas"
          >
            {data ? (
              data.pages.map((products) =>
                products.products.map((product: Product) => (
                  <div
                    key={product.id}
                    className="product"
                    style={{ height: divWidth * Number(product.ratio) }}
                    ref={ref}
                  >
                    {divWidth ? (
                      <Link href={`/product/${product.id}`} passHref>
                        <div className="imgwrap">
                          <NextImage
                            alt=""
                            src={`/uploads/${product.image}`}
                            // layout="fill"
                            fill={true}
                            // width={'100%'}
                            // height={divWidth * Number(product.ratio)}
                            sizes="33vw"
                            // objectFit="contain"
                            // style={{
                            //   // width: '100%',
                            //   height: divWidth * Number(product.ratio),
                            //   objectFit: 'fill'
                            // }}
                            // priority={true}
                          />
                        </div>
                      </Link>
                    ) : (
                      <></>
                    )}
                    <span className="product-title">{product.title}</span>
                  </div>
                ))
              )
            ) : (
              <></>
            )}
          </Masonry>
        </ResponsiveMasonry>
        {isFetchingNextPage ? (
          <div>Loading...</div>
        ) : (
          <div ref={ref} style={{ height: '100px' }}></div>
        )}
      </div>

      {/* <Sidebar /> */}
      <style jsx>{`
        .arrow {
          z-index: 2;
          width: 6.67vw;
          height: 6.67vw;
          background-repeat: no-repeat;
          background-position: center;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          color: transparent;
        }
        .main_wrap {
          position: relative;
        }
        .product-wrap {
          width: 94vw;
          margin: 0 auto;
          .imgwrap {
            position: relative;
            cursor: pointer;
            display: block;
            width: 100%;
            height: 90%;
            border-radius: 20px;
            overflow: hidden;
          }

          .product-title {
            display: inline-block;
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
