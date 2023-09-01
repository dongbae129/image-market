import Link from 'next/link';
import { userResponse } from './headmenu';

interface userCardProps {
  userInfo: userResponse | undefined;
  logedIn: boolean | undefined;
}
const UserCard = ({ userInfo, logedIn }: userCardProps) => {
  return (
    <div className="h-full flex flex-col">
      {logedIn ? (
        <>
          <div className="flex flex-[2]">
            <div className="w-[63px] mr-5 flex items-center">
              <div className="user_image rounded-[50%] w-full h-[63px] relative">
                <span className="image_setting absolute w-6 h-6 rounded-[50%] border bottom-0 right-0 bg-white"></span>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <div className="font-bold">{userInfo?.user?.name}님</div>
              <div className="text-sm">{userInfo?.user?.email}</div>
            </div>
          </div>
          <>
            <div className="logedIn flex flex-[0.2] bg-slate-50 font-bold justify-around">
              <div>
                <Link href={`/profile/${userInfo?.user.id}`}>
                  <a className="block text-center text-sm">
                    <span className="w-full">내정보</span>
                  </a>
                </Link>
              </div>
              <div>
                <Link href={`/profile/${userInfo?.user.id}/myproducts`}>
                  <a className="profile_selection before:left-[-10px] block text-center relative text-sm">
                    <span className="w-full">게시물</span>
                  </a>
                </Link>
              </div>
              <div>
                <Link href={'/logout'}>
                  <a className="profile_selection before:left-[-9px] block text-center relative text-sm">
                    <span className="w-full">로그아웃</span>
                  </a>
                </Link>
              </div>
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
              <Link href={'/help/id'}>
                <a className="block text-center text-sm">
                  <span className="w-full">아이디 찾기</span>
                </a>
              </Link>
            </div>
            <div className="">
              <Link href={'/help/pw'}>
                <a className="profile_selection before:left-[-10px] block text-center relative text-sm">
                  <span className="w-full">비밀번호 찾기</span>
                </a>
              </Link>
            </div>
            <div className="">
              <Link href={'/register'}>
                <a className="profile_selection before:left-[-11px] block text-center relative text-sm">
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
          margin-top: 4px;
          width: 2px;
          height: 12px;
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
          background: url('/localimages/emptyuser2.png') no-repeat center;
          background-size: cover;
        }
      `}</style>
    </div>
  );
};

export default UserCard;
