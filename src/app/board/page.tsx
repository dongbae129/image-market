'use client';
import type { NextPage } from 'next';

import { Board, User } from '@prisma/client';

import { useState } from 'react';

import BoardList from './_component/BoardList';
import BoardHead from './_component/BoardHead';
import { GetComponentData } from './_lib/getComponentData';
import BoardPaging from '@app/board/_component/BoardPaging';
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
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 100;
  // const { isLoading, error, isSuccess } =
  //   GetComponentData<BoardResponse>(boardSearch);

  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error...</div>;

  return (
    <div className="board">
      <BoardHead boardSearch={boardSearch} setBoardSearch={setBoardSearch} />
      {<BoardList boardSearch={boardSearch} />}
      <BoardPaging
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
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
