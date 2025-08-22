import style from './main.module.scss';
export default function Banner() {
  return (
    <div className="banner rounded-lg overflow-hidden border border-[#e3e5e8] shadow-md w-[75%] max-lg:w-full relative">
      <button
        className={`bg-[url("/localimages/left-arrow.svg")] ${style.arrow}`}
      ></button>
      <div className={style.banner} />
      <button
        className={`bg-[url("/localimages/right-arrow.svg")] ${style.arrow} right-0`}
      ></button>
    </div>
  );
}
