import { Product } from '@prisma/client';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import NextImage from 'next/image';
import { useInView } from 'react-intersection-observer';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  useInfiniteQuery
} from '@tanstack/react-query';
import { newAxios } from '@libs/client/fetcher';
import { useParams, useRouter } from 'next/navigation';
import { getUserProducts } from '@app/profile/_lib/getUserProducts';
import { getUserServer } from '@app/_libs/getUserServer';
import Main from '@components/Main';
import { getProducts } from '@app/_libs/getProducts';
import ProfilePage from '@app/profile/_component/ProfilePage';
import { getUserInfo } from '@app/profile/_lib/getUserInfo';
import { cookies } from 'next/headers';

type Props = {
  params: {
    name: string;
  };
};
export interface GetProductsResponse {
  // ok: boolean;
  products: Product[];
}
export default async function MyProducts({ params }: Props) {
  const { name } = await params;
  const cookie = await cookies();
  console.log(cookie, 'COCOCO');
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchInfiniteQuery({
      queryKey: ['userProducts', name],
      queryFn: ({ pageParam = 0 }) => getUserProducts(name, pageParam),
      initialPageParam: 0
    }),
    queryClient.prefetchQuery({
      queryKey: ['userInfo', name],
      queryFn: () => getUserInfo(name)
    })
  ]);

  // await queryClient.prefetchInfiniteQuery({
  //   queryKey: ['userProducts', name],
  //   queryFn: ({ pageParam = 0 }) => getUserProducts(name, pageParam),
  //   initialPageParam: 0
  // });

  // await queryClient.prefetchQuery({
  //   queryKey: ['userInfo'],
  //   queryFn: getUserServer
  // });

  // await Promise.all([
  //   queryClient.prefetchInfiniteQuery({
  //     queryKey: ['userProducts', name],
  //     queryFn: ({ pageParam = 0 }) => getUserProducts(name, pageParam),
  //     initialPageParam: 0
  //   }),
  //   queryClient.prefetchQuery({
  //     queryKey: ['userInfo'],
  //     queryFn: getUserServer
  //   })
  // ]);
  const initialQueryData: { pages?: GetProductsResponse[] } | undefined =
    queryClient.getQueryData(['userProducts', name]);
  let ssrItemCount = 0;
  if (initialQueryData?.pages?.[0]?.products) {
    ssrItemCount = initialQueryData.pages[0].products.length; // (e.g., 6)
  }
  const dehydratedState = dehydrate(queryClient);
  return (
    <div>
      <HydrationBoundary state={dehydratedState}>
        <ProfilePage ssrItemCount={ssrItemCount} name={name} />
      </HydrationBoundary>
    </div>
  );
  // const countRef = useRef<HTMLDivElement>(null);
  // const [divWidth, setDivWidth] = useState(0);
  // const { ref, inView } = useInView({
  //   threshold: 0.3
  // });
  // const router = useRouter();

  // const getProducts = ({ pageParam = 0 }) =>
  //   newAxios
  //     .get(`/api/user/${name}/products?id=${pageParam}`)
  //     .then((res) => res.data);

  // const { data, hasNextPage, fetchNextPage, isLoading, isFetchingNextPage } =
  //   useInfiniteQuery({
  //     queryKey: ['userProducts'],
  //     queryFn: getProducts,
  //     initialPageParam: 0,
  //     getNextPageParam: (lastPage, allPage) => {
  //       const lastPageLength = lastPage.products.length;
  //       if (lastPageLength === 0 || lastPageLength < 6) return undefined;
  //       return lastPageLength >= 6 && lastPage.products[lastPageLength - 1].id;
  //     },
  //     enabled: !!name
  //   });

  // useEffect(() => {
  //   if (countRef.current) {
  //     const test = +window
  //       .getComputedStyle(countRef.current)
  //       .getPropertyValue('width')
  //       .slice(0, -2);

  //     const size =
  //       +window
  //         .getComputedStyle(countRef.current)
  //         .getPropertyValue('font-size')
  //         .slice(0, -2) * 3;
  //     setDivWidth((test - size) / 4);
  //     console.log('in');
  //   }
  //   console.log('out');
  // }, []);
  // useEffect(() => {
  //   if (inView && hasNextPage) fetchNextPage();
  // }, [inView, hasNextPage, fetchNextPage]);
  // const convertUrl = (image: string) => {
  //   return image.endsWith('.jpeg') ? image.replace(/\.jpeg$/i, '.jpg') : image;
  // };
  // return (
  //   <div>
  //     <div className="product-wrap" ref={countRef}>
  //       <ResponsiveMasonry
  //         columnsCountBreakPoints={{ 350: 2, 750: 3, 900: 5, 1200: 6 }}
  //       >
  //         <Masonry
  //           /*columnsCount={masonryColumn}*/ gutter="1em"
  //           className="mas"
  //         >
  //           {data ? (
  //             data.pages.map((products) =>
  //               products.products.map((product: Product) => (
  //                 <div
  //                   key={product.id}
  //                   className="product"
  //                   style={{ height: divWidth * Number(product.ratio) }}
  //                   ref={ref}
  //                 >
  //                   {divWidth ? (
  //                     <Link href={`/product/${product.id}`} passHref>
  //                       <div className="imgwrap">
  //                         <NextImage
  //                           alt=""
  //                           // src={`/uploads/${product.image}`}
  //                           src={`474x/${convertUrl(product.image)}`}
  //                           // layout="fill"
  //                           fill={true}
  //                           // width={'100%'}
  //                           // height={divWidth * Number(product.ratio)}
  //                           sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px"
  //                           // objectFit="contain"
  //                           // style={{
  //                           //   // width: '100%',
  //                           //   height: divWidth * Number(product.ratio),
  //                           //   objectFit: 'fill'
  //                           // }}
  //                           // priority={true}
  //                         />
  //                       </div>
  //                     </Link>
  //                   ) : (
  //                     <></>
  //                   )}
  //                   <span className="product-title">{product.title}</span>
  //                 </div>
  //               ))
  //             )
  //           ) : (
  //             <></>
  //           )}
  //         </Masonry>
  //       </ResponsiveMasonry>
  //       {isFetchingNextPage ? (
  //         <div>Loading...</div>
  //       ) : (
  //         <div ref={ref} style={{ height: '100px' }}></div>
  //       )}
  //     </div>
  //     <style jsx>{`
  //       .arrow {
  //         z-index: 2;
  //         width: 6.67vw;
  //         height: 6.67vw;
  //         background-repeat: no-repeat;
  //         background-position: center;
  //         position: absolute;
  //         top: 50%;
  //         transform: translateY(-50%);
  //         color: transparent;
  //       }
  //       .main_wrap {
  //         position: relative;
  //       }
  //       .product-wrap {
  //         width: 94vw;
  //         margin: 0 auto;
  //         .imgwrap {
  //           position: relative;
  //           cursor: pointer;
  //           display: block;
  //           width: 100%;
  //           height: 90%;
  //           border-radius: 20px;
  //           overflow: hidden;
  //         }

  //         .product-title {
  //           display: inline-block;
  //         }
  //       }

  //       .imgwrap:hover {
  //         filter: brightness(60%);
  //       }
  //     `}</style>
  //   </div>
  // );
}
