import Link from 'next/link';
import { userResponse } from './headmenu';
import { useQuery } from 'react-query';
import useLogout from '@libs/client/logout';
import { useSelector } from 'react-redux';
import { getFetch } from '@libs/client/fetcher';

interface userCardProps {
  userInfo: userResponse | undefined;
  logedIn: boolean | undefined;
}
const UserCard = () => {
  const { accessToken } = useSelector((state: any) => state.user);
  // const dispatch = useDispatch();
  const header = {
    headers: { authorization: `Bearer ${accessToken}` }
  };

  const { data } = useQuery<userResponse>(
    ['userInfo'],
    getFetch('/api/user', header)
  );
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
              {/* <ImgDiv>
                <span className="image_setting absolute w-6 h-6 rounded-[50%] border bottom-0 right-0 bg-white"></span>
              </ImgDiv> */}
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
                  <a className="block text-center text-sm">
                    <span className="w-full">내정보</span>
                  </a>
                </Link>
              </div>
              <div>
                <Link href={`/profile/${data?.user.id}/myproducts`}>
                  <a className="profile_selection before:left-[-10px] block text-center relative text-sm">
                    <span className="w-full">게시물</span>
                  </a>
                </Link>
              </div>
              <div>
                {/* <Link href="/logout" data-testid="atest1"> */}
                {/* <a
                    // data-testid="atest"

                    className="atest profile_selection before:left-[-9px] block text-center relative text-sm"
                  > */}
                <div
                  className="atest cursor-pointer profile_selection before:left-[-9px] block text-center relative text-sm"
                  onClick={onLogout}
                >
                  로그아웃
                </div>
                {/* </a> */}
                {/* </Link> */}
                {/* <span
                  className="w-full"
                  data-testid="atest"
                  onClick={() => {
                    router.push('/logout');
                  }}
                >
                  로그아웃
                </span> */}
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
          <div className="flex flex-[2]">
            <Link href="/signin">
              <a className="bg-blue-200 text-center w-full flex items-center justify-center h-[80%] rounded">
                <i className="font-bold text-xl">
                  <span>I-MARKET </span>
                  <span className="font-normal text-base">로그인</span>
                </i>
              </a>
            </Link>
          </div>

          <div className="flex flex-[0.2] bg-slate-50 rounded font-bold justify-around">
            <div className="">
              <Link href={'/help/account'}>
                <a className="block text-center text-sm">
                  <span className="w-full">계정찾기</span>
                </a>
              </Link>
            </div>

            {/* <div className="">
              <Link href={'/help/pw'}>
                <a className="profile_selection before:left-[-10px] block text-center relative text-sm">
                  <span className="w-full">비밀번호 찾기</span>
                </a>
              </Link>
            </div> */}
            <div className="">
              <Link href={'/register'}>
                <a className="profile_selection before:left-[-41px] block text-center relative text-sm">
                  <span className="w-full">회원가입</span>
                </a>
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
