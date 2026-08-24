import Button from '@app/_components/button';
import Input from '@app/_components/input';
import Link from 'next/link';

import { IoIosSearch } from 'react-icons/io';
import { BoardWithUser } from '@app/board/_component/BoardContainer';

type BoardSearch = {
  search: string;
};
type BoardHeadProps = {
  setBoardSearch: (search: string) => void;
  setCurrentPage: (page: number) => void;
  currentPage: number;
  boardSearch: string;
  totalPage: number | undefined;
};
interface BoardResponse {
  ok: boolean;
  boards: BoardWithUser[];
  boardCount: number;
}
function BoardHead({
  setBoardSearch,
  setCurrentPage,
  currentPage,
  totalPage = 10
}: BoardHeadProps) {
  const boardShowCount = Number(process.env.NEXT_PUBLIC_POST_COUNT);

  const total = Math.ceil(totalPage / boardShowCount);
  // const { data } = GetComponentData<BoardResponse>(boardSearch);
  return (
    <>
      <div className="board-head">
        <div className="board__refresh">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            // viewBox="0 0 14 14"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
            data-slot="icon"
            className="w-full h-full text-gray-700 hover:cursor-pointer hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-200"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            ></path>
          </svg>
        </div>
        <Link href={'/upload'} className="min-h-[37px] h-[37px] w-[90px]">
          <Button isLoading={false} text="UPLOAD" />
        </Link>
        <div className="search">
          <form action={'/product'} method="GET">
            <Input
              name="search"
              type="text"
              paddingleft="3rem"
              classame="search__input"
            />
            <div className="search__button">
              <IoIosSearch size={'100%'} strokeWidth={2} />
            </div>
          </form>
        </div>
        <div className="board__pagecount">
          <span>페이지</span>
          {/* {data?.boardCount ? `1/${Math.ceil(data?.boardCount / 5)}` : '0/0'} */}
        </div>
      </div>
      <style jsx>{`
        .board-head {
          position: relative;
          min-height: 65px;
          height: 65px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid rgb(107, 114, 128);
          border-bottom: 1px solid rgb(107, 114, 128);
          padding-top: 1rem;
          padding-bottom: 1rem;

          .board__refresh {
            position: relative;
            width: 25px;
            height: 25px;
          }
          .board__pagecount {
            width: 100px;
            height: 90%;
          }
        }
        form {
          position: relative;
        }
        .search {
          position: relative;
          width: 40%;

          .search__button {
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
        }
      `}</style>
    </>
  );
}

export default BoardHead;
