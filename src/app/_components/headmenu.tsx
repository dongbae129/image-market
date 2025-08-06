import Input from '@app/_components/input';
import style from './headmenu.module.css';
import { NextPage } from 'next';
import Link from 'next/link';
// import { useForm } from 'react-hook-form';
import { IoIosSearch } from 'react-icons/io';
// import { useRouter } from 'next/navigation';
// import { useQuery } from '@tanstack/react-query';
// import { getFetch } from '@libs/client/fetcher';
// import { useSelector } from 'react-redux';
import { User } from '@prisma/client';
// import Sidebar from './sidebar';
// import store from '@/reducers/store';

interface HeadSearch {
  search: string;
}
export interface userResponse {
  ok: boolean;
  user: User;
}
interface UploadProductForm {
  image: FileList;
  title: string;
  description?: string;
  productAuth: boolean;
  ratio: number;
}
const HeadMenu: NextPage = () => {
  // const router = useRouter();
  // const { register, handleSubmit } = useForm<HeadSearch>();

  // const { accessToken } = useSelector((state: any) => state.user);
  const accessToken = 'qwdqf';
  // const getSearchData = (search: string) =>
  //   axios.get(`/api/product?search=${search}`).then((res) => res.data);

  const header = {
    headers: { authorization: `Bearer ${accessToken}` }
  };
  // const onValid = ({ search }: HeadSearch) => {
  //   // searchElementRef.current?.click();
  //   router.push(`/product?search=${search}`);
  //   // router.push({
  //   //   pathname: '/product/search',
  //   //   query: { find: search }
  //   // });
  // };
  // const { data: userInfo } = useQuery<userResponse>({
  //   queryKey: ['userInfo'],
  //   queryFn: getFetch('/api/user'),

  //   enabled: !store.getState().user.restoreState
  // });
  return (
    <div className={`${style.headmenuwrap} z-10 bg-white relative`}>
      <div className={style.golinkwrap}>
        <Link href={'/'}>
          <span className={style.golinkwrap}>HOME</span>
        </Link>

        <Link href={'/board?id=1'}>
          <span className={style.golinkwrap}>BOARD</span>
        </Link>
      </div>
      <div className={style.searchform}>
        <form action={'/product'} method="GET">
          <div className={style.searchbutton}>
            <IoIosSearch size={'100%'} />
          </div>
          <input
            // label="search"
            name="search"
            type="text"
            // paddingleft="3rem"
            required
            // style={{ width: '100%' }}
          />
        </form>
        {/* <form onSubmit={handleSubmit(onValid)}>
          <Input
            // label="search"
            name="search"
            type="text"
            paddingleft="3rem"
            required
            register={register('search', { required: true })}
            // style={{ width: '100%' }}
          />
          <div className="searchbutton">
            <IoIosSearch size={'100%'} />
          </div>
        </form> */}
      </div>
      {/* {userInfo?.ok ? ( */}
      <div className={`${style.golinkwrap} right`}>
        <Link href={'/payment'}>
          <span className={style.golinkwrap}>PAY</span>
        </Link>
        <Link href={'/upload'}>
          <span className={style.golinkwrap}>UPLOAD</span>
        </Link>
        {/* <Sidebar userInfo={userInfo.user} /> */}
      </div>
      {/* ) : (
        <div className="golinkwrap">
          <Link href={'/payment'}>
            <span className={style.golinkwrap}>PAY</span>
          </Link>
          <Link href={'/signin'}>
            <span className={style.golinkwrap}>SIGNIN</span>
          </Link>
          <Link href={'/register'}>
            <span className={style.golinkwrap}>SIGNUP</span>
          </Link>
        </div>
      )} */}

      {/* <style jsx>{`
        .headmenuwrap {
          display: flex;
          justify-content: space-around;
          align-items: center;
          height: 4rem;
          padding: 4px;
          padding-left: 16px;
          padding-right: 16px;
          margin-bottom: 1rem;

          .golinkwrap {
            display: flex;
            align-items: center;

            height: 100%;
            width: 15%;
            span {
              font-weight: 700;
              font-size: 1.3rem;
            }

            > span {
              margin-right: 1rem;
            }
          }
          .golinkwrap.right {
            justify-content: center;
          }
        }
        .golinkinhead {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 5rem;
          height: 80%;
          cursor: pointer;
          border-bottom: 3px solid rgba(51, 154, 240, 0);

          :hover {
            border-bottom: 3px solid rgba(51, 154, 240, 1);
          }
        }
        .searchform {
          width: 60%;
          height: 80%;
          position: relative;
          border-radius: 10px;
          > form {
            position: relative;
            height: 100%;
            width: 100%;
          }
        }
        .searchinput {
          input {
            width: 100%;
          }
        }
        .searchbutton {
          position: absolute;
          margin-left: 10px;
          height: 80%;
          border-top-right-radius: 15px;
          border-bottom-right-radius: 15px;
          cursor: pointer;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      `}</style> */}
    </div>
  );
};

export default HeadMenu;
