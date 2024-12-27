import { Board, User } from '@prisma/client';
import React, { useEffect } from 'react';
import { GetComponentData } from '../_lib/getComponentData';
import BoardInfo from './BoardInfo';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getFetch, newAxios } from '@libs/client/fetcher';
import { useInView } from 'react-intersection-observer';
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
type BoardListProps = {
  boardSearch: string;
};
function BoardList({ boardSearch }: BoardListProps) {
  // const { data } = GetComponentData<BoardResponse>(boardSearch);
  const { ref, inView } = useInView({
    threshold: 0.3
  });
  const getBoards = ({ pageParam = 0 }) => {
    const search = boardSearch;
    return newAxios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/board?id=${pageParam}${boardSearch === '' ? '' : '&search=' + search}`
      )
      .then((res) => res.data);
  };
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['boards', boardSearch],
      queryFn: getBoards,
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPage) => {
        const lastPageLength = lastPage.boards?.length;
        if (lastPageLength === 0 || lastPageLength < 4) return undefined;
        return lastPageLength >= 4 && lastPage.boards[lastPageLength - 1].id;
      }
    });
  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);
  return (
    <>
      <div className="board-list">
        <ul>
          {data?.pages?.map((boards) =>
            boards.boards.map((board: Board) => (
              <li key={board.id} className="gap-x-4">
                <BoardInfo board={board} />
              </li>
            ))
          )}
        </ul>
      </div>
      {isFetchingNextPage ? (
        <div>Loading...</div>
      ) : (
        <div ref={ref} style={{ height: '100px' }}></div>
      )}
      <style jsx>{`
        .board-list {
          margin-bottom: 4rem;
        }
        ul {
          list-style: none;
          padding: 0;

          li {
            border-bottom: 1px solid #ced4da;
            padding-top: 1rem;
            padding-bottom: 1rem;
            display: flex;
            justify-content: space-between;
          }
        }
      `}</style>
    </>
  );
}

export default BoardList;
