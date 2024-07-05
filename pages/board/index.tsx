import type { NextPage } from 'next';
import { useQuery } from 'react-query';
import { getFetch } from '@libs/client/fetcher';
import { Board, BoardHit, User } from '@prisma/client';
import Link from 'next/link';
import Input from '@components/input';
import { useForm } from 'react-hook-form';
import { IoIosSearch } from 'react-icons/io';
import { useState } from 'react';
import { timeForToday } from '@libs/client/timeForToday';
import Button from '@components/button';
import { BiCommentDetail } from 'react-icons/bi';
import { GrView } from 'react-icons/gr';
import BoardList from './_component/BoardList';
import BoardHead from './_component/BoardHead';
import { GetComponentData } from './_lib/getComponentData';
interface BoardWithUser extends Board {
  user: User;
  boardHit: {
    hit: number;
  };
  _count: {
    boardChat: number;
  };
}
interface BoardResponse {
  ok: boolean;
  boards: BoardWithUser[];
}

const Boards: NextPage = () => {
  const [boardSearch, setBoardSearch] = useState<string>('');
  const { isLoading, error, isSuccess } =
    GetComponentData<BoardResponse>(boardSearch);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error...</div>;

  return (
    <div className="board">
      <BoardHead boardSearch={boardSearch} setBoardSearch={setBoardSearch} />
      {isSuccess && <BoardList boardSearch={boardSearch} />}
      <style jsx>{`
        .board {
          width: 60%;
          margin: auto;
        }
      `}</style>
    </div>
  );
};

export default Boards;
