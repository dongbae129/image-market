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
  console.log('MainTest');
  // const toekn = cookies();

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
  await queryClient.prefetchQuery({
    queryKey: ['userInfo'],
    queryFn: getUserServer
  });
  const dehydratedState = dehydrate(queryClient);
  console.log(queryClient.getQueryData(['userInfo']), 'userTest');
  return (
    <div>
      <HydrationBoundary state={dehydratedState}>
        <Main />
      </HydrationBoundary>
    </div>
    // <div className="main_wrap">
    //   <div className="main_header flex w-[94vw] h-[500px] m-auto mb-12">
    //     <div className="banner rounded-lg overflow-hidden border border-[#e3e5e8] shadow-md w-[75%] max-lg:w-full relative">
    //       <button className='bg-[url("/localimages/left-arrow.svg")] arrow'></button>
    //       <NextImage
    //         src={'/localimages/banner.webp'}
    //         alt="banner"
    //         fill={true}
    //       />
    //       <button className='bg-[url("/localimages/right-arrow.svg")] arrow right-0'></button>
    //     </div>
    //     <div className="profile shadow-lg border border-[#e3e5e8] ml-7 w-auto min-w-[320px] h-40 rounded-lg max-lg:hidden overflow-hidden p-5 flex flex-col justify-between">
    //       <UserCard />
    //     </div>
    //   </div>

    //   <ResponsiveProducts />
    //   {/* <Sidebar /> */}

    // </div>
  );
}
