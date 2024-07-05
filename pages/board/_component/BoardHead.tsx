import Button from '@components/button';
import Input from '@components/input';
import Link from 'next/link';
import React, { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { IoIosSearch } from 'react-icons/io';
import { GetComponentData } from '../_lib/getComponentData';

type BoardSearch = {
  search: string;
};
type BoardHeadProps = {
  boardSearch: string;
  setBoardSearch: Dispatch<SetStateAction<string>>;
};
function BoardHead({ boardSearch, setBoardSearch }: BoardHeadProps) {
  const { isLoading } = GetComponentData(boardSearch);
  const { register, handleSubmit } = useForm<BoardSearch>();
  const onValid = ({ search }: BoardSearch) => {
    if (isLoading) return;
    console.log(search);
    setBoardSearch(search);
    // mutate({ search });
  };
  return (
    <>
      <div className="board-head">
        <div className="board__refresh"></div>
        <Link href={'/board/upload'}>
          <a>
            <Button isLoading={false} text="Upload" />
          </a>
        </Link>
        <div className="search">
          <form onSubmit={handleSubmit(onValid)}>
            <Input
              name="search"
              type="text"
              paddingleft="3rem"
              register={register('search', { required: true })}
              classame="search__input"
              required
            />
            <div className="search__button">
              <IoIosSearch size={'100%'} />
            </div>
          </form>
        </div>
        <div className="board__pagecount"></div>
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
            width: 50px;
            height: 90%;
            border: 1px solid black;
          }
          .board__pagecount {
            border: 1px solid black;
            width: 100px;
            height: 90%;
          }
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
