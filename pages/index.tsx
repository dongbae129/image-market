import type { NextPage } from 'next';
import { useSelector } from 'react-redux';
import { Product } from '@prisma/client';
import NextImage from 'next/future/image';
import { getFetch } from '@libs/client/fetcher';
import { userResponse } from '@components/headmenu';
import UserCard from '@components/userCard';
import ResponsiveProducts from '@components/ResponsiveProducts';
import { useQuery } from 'react-query';

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
  const { accessToken } = useSelector((state: any) => state.user);
  // const dispatch = useDispatch();
  const header = {
    headers: { authorization: `Bearer ${accessToken}` }
  };

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
          <UserCard />
        </div>
      </div>

      <ResponsiveProducts />
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
      `}</style>
    </div>
  );
};

export default Home;
