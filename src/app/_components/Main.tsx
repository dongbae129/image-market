import style from './main.module.scss';
import UserCard from '@app/_components/userCard';
import ResponsiveProducts from '@app/_components/ResponsiveProducts';
import Banner from '@components/Banner';

export default function Main() {
  return (
    <div className={style.main_wrap}>
      <div className="main_header flex w-[94vw] h-[500px] m-auto mb-12">
        <Banner />
        <div className="profile shadow-lg border border-[#e3e5e8] ml-7 w-auto min-w-[320px] h-40 rounded-lg max-lg:hidden overflow-hidden p-5 flex flex-col justify-between">
          <UserCard />
        </div>
      </div>

      <ResponsiveProducts />
      {/* <Sidebar /> */}
    </div>
  );
}
