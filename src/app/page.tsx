// import type { NextPage } from 'next';

// import { useSelector } from 'react-redux';
// import './home.css';
import { Product } from '@prisma/client';
import Main from '@components/Main';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query';
import { getFetch } from '@libs/client/fetcher';
import { getUserServer } from '@app/_libs/getUserServer';
import { getProducts } from '@app/_libs/getProducts';
import { cookies, headers } from 'next/headers';
import { getColumnsCount } from '@app/_libs/getColumnsCount';
// import { useSelector } from 'react-redux';
// import { cookies } from 'next/headers';
// import { useQuery } from '@tanstack/react-query';

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
type Props = { pageParam?: number };

export default async function Home() {
  const headerList = headers();
  // const cookieStore = cookies();
  const secViewport = headerList.get('sec-ch-viewport-width'); // e.g. "375"
  const secUaMobile = headerList.get('sec-ch-ua-mobile'); // "?1" or "?0"
  const ua = headerList.get('user-agent') || '';
  const columns = getColumnsCount(ua);
  const columnCount = 4;
  // const clientVwCookie = cookieStore.get('client_vw')?.value ?? null;

  // if (secViewport) {
  //   const w = parseInt(secViewport, 10);
  //   if (w < 640) columnCount = 1;
  //   else if (w < 1024) columnCount = 2;
  //   else if (w < 1440) columnCount = 3;
  //   else columnCount = 4;
  // } else if (secUaMobile === '?1' || /Mobi|Android/i.test(ua)) {
  //   columnCount = 1;
  // } else {
  //   columnCount = 3; // fallback
  // }
  // const { accessToken } = useSelector((state: any) => state.user);
  // const accessToken = 'abcdefg';
  // const header = {
  //   headers: { authorization: `Bearer ${accessToken}` }
  // };
  async function getTest() {
    const res = await fetch('/api/user', {
      next: {
        tags: ['userInfo']
      },
      credentials: 'include',
      // headers: {
      //   Authorization: `Bearer ${toekn.get('accesToken')}`
      // }
      cache: 'no-store'
    });
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data');
    }
    return res.json();
  }
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchInfiniteQuery({
      queryKey: ['getProducts'],
      queryFn: ({ pageParam = 0 }) => getProducts(pageParam),
      initialPageParam: 0
    }),
    queryClient.prefetchQuery({
      queryKey: ['userInfo'],
      queryFn: getUserServer,
      staleTime: 1000 * 60 * 10
    })
  ]);
  const initialQueryData: { pages?: GetProductsResponse[] } | undefined =
    queryClient.getQueryData(['getProducts']);

  let ssrItemCount = 0;
  if (initialQueryData?.pages?.[0]?.products) {
    ssrItemCount = initialQueryData.pages[0].products.length; // (e.g., 6)
  }
  console.log(queryClient.getQueryData(['userInfo']), 'ssr user test');
  const dehydratedState = dehydrate(queryClient);

  return (
    <div>
      <HydrationBoundary state={dehydratedState}>
        <Main ssrItemCount={ssrItemCount} />
      </HydrationBoundary>
    </div>
  );
}
