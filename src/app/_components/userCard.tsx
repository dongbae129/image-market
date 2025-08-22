'use client';
import Link from 'next/link';
import { userResponse } from './headmenu';
import { QueryClient, useQuery } from '@tanstack/react-query';
import useLogout from '@libs/client/logout';
import { useSelector } from 'react-redux';
import { getFetch } from '@libs/client/fetcher';

interface userCardProps {
  userInfo: userResponse | undefined;
  logedIn: boolean | undefined;
}

const UserCard = () => {
  const { accessToken } = useSelector((state: any) => state.user);
  const query = new QueryClient();
  const test = query.getQueryData(['userInfo']);
  console.log(test, 'TTT');
  console.log(accessToken, 'ACCTest');
  async function getTest2() {
    const res = await fetch('/api/user', {
      next: {
        tags: ['userInfo']
      },
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
      // cache: 'no-store'
    });
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data');
    }
    return res.json();
  }
  // const accessToken = '2122';
  // const dispatch = useDispatch();
  const header = {
    headers: { authorization: `Bearer ${accessToken}` }
  };

  const { data } = useQuery<userResponse>({
    queryKey: ['userInfo'],
    // queryFn: getFetch('/api/user', header)
    queryFn: getTest2
  });
  // const data = {
  //   ok: true,
  //   user: {
  //     id: 1,
  //     name: 'usercard name test',
  //     email: 'usercard email test',
  //     coin: 10000,
  //     bonusCoupon: 3,
  //     image:
  //       'http://k.kakaocdn.net/dn/FRyFD/btsEkvAIYBR/WqePYvRTpNncSYv6zsah2k/img_110x110.jpg',
  //     emailActive: true
  //   }
  // };
  console.log(data, 'userCard Data');

  const logout = useLogout();
  const onLogout = async () => {
    console.log('로그아웃');
    await logout();
  };
  return (
    <div className="h-full flex flex-col">
      {data?.ok ? (
        <>
          <div className="flex flex-[2]">
            <div className="w-[63px] mr-5 flex items-center">
              <div className="user_image rounded-[50%] w-full h-[63px] relative">
                <span className="image_setting absolute w-6 h-6 rounded-[50%] border bottom-0 right-0 bg-white"></span>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <div className="font-bold">{data?.user?.name}님</div>
              <div className="text-sm">{data?.user?.email}</div>
            </div>
          </div>
          <>
            <div className="logedIn flex flex-[0.2] bg-slate-50 font-bold justify-around">
              <div>
                <Link href={`/profile/${data?.user.id}`}>
                  <div className="block text-center text-sm">
                    <span className="w-full">내정보</span>
                  </div>
                </Link>
              </div>
              <div>
                <Link href={`/profile/${data?.user.id}/myproducts`}>
                  <div className="profile_selection before:left-[-10px] block text-center relative text-sm">
                    <span className="w-full">게시물</span>
                  </div>
                </Link>
              </div>
              <div>
                <div
                  className="atest cursor-pointer profile_selection before:left-[-9px] block text-center relative text-sm"
                  onClick={onLogout}
                >
                  로그아웃
                </div>
              </div>
            </div>
            <div className="flex flex-[0.2] bg-slate-50 rounded font-bold justify-around">
              <div>코인: {data?.user.coin}</div>
              <div>쿠폰: {data?.user.bonusCoupon}</div>
            </div>
          </>
        </>
      ) : (
        <>
          <div className="flex-1">
            <Link href="/signin">
              <div className="bg-blue-200 text-center w-full flex items-center justify-center h-[80%] rounded">
                <i className="font-bold text-xl">
                  <span>I-MARKET </span>
                  <span className="font-normal text-base">로그인</span>
                </i>
              </div>
            </Link>
          </div>

          <div className="flex flex-[0.2] bg-slate-50 rounded font-bold justify-around">
            <div className="">
              <Link href={'/help/account'}>
                <div className="block text-center text-sm">
                  <span className="w-full">계정찾기</span>
                </div>
              </Link>
            </div>

            <div className="">
              <Link href={'/register'}>
                <div className="profile_selection before:left-[-41px] block text-center relative text-sm">
                  <span className="w-full">회원가입</span>
                </div>
              </Link>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .profile_selection::before {
          content: '';
          display: block;
          position: absolute;
          width: 1.5px;
          height: 70%;
          top: 15%;
          background-color: rgb(148, 163, 184);
        }
        .logedIn .profile_selection::before {
          transform: translateX(-13px);
        }
        .image_setting::before {
          content: '';
          display: block;
          width: 27px;
          height: 27px;
          position: absolute;
          background-image: url('/localimages/settings-icon.png');
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          top: -2px;
          bottom: 0;
          right: 0;
          left: -2.5px;
          margin: auto;
        }
        .user_image {
          background: url(${data?.user?.emailActive
              ? data?.user?.image
              : data?.user?.image
                ? `/uploads/${data?.user?.image}`
                : '/localimages/emptyuser2.png'})
            no-repeat center;
          background-size: cover;
        }
      `}</style>
    </div>
  );
};

export default UserCard;
