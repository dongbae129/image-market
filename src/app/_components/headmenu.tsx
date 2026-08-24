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
      </div>
      <div className={`${style.golinkwrap} right`}>
        <Link href={'/payment'}>
          <span className={style.golinkwrap}>PAY</span>
        </Link>
        <Link href={'/upload'}>
          <span className={style.golinkwrap}>UPLOAD</span>
        </Link>
      </div>
    </div>
  );
};

export default HeadMenu;
