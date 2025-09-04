'use client';
import { Board, User } from '@prisma/client';
import React, { useState } from 'react';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { newAxios } from '@libs/client/fetcher';
import BoardPaging from './BoardPaging';
import { useSearchParams } from 'next/navigation';
import BoardHead from '@app/board/_component/BoardHead';
import BoardList from '@app/board/_component/BoardList';
export interface BoardWithUser extends Board {
  user: User;
  boardHit: {
    hit: number;
  };
  boardTag: {
    hashtag: string;
  }[];
  _count: {
    boardChat: number;
  };
}
interface BoardResponse {
  ok: boolean;
  boards: BoardWithUser[];
  boardCount: number;
}

function BoardContainer() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const [boardSearch, setBoardSearch] = useState(search);
  const [currentPage, setCurrentPage] = useState(page);

  const getBoards = () => {
    const search = boardSearch;
    return newAxios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/board?id=${currentPage}${boardSearch === '' ? '' : '&search=' + search}`
      )
      .then((res) => res.data);
  };
  const { data } = useQuery<BoardResponse>({
    queryKey: ['boards', currentPage, boardSearch],
    queryFn: getBoards,
    enabled: !!currentPage
  });

  return (
    <>
      <BoardHead
        setBoardSearch={setBoardSearch}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        boardSearch={boardSearch}
        totalPage={data?.boardCount}
      />
      <BoardList boards={data?.boards} />
      <BoardPaging
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={data?.boardCount}
        boardSearch={boardSearch}
      />
    </>
  );
}

export default BoardContainer;
