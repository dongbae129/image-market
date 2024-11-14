import { Board, User } from '@prisma/client';
import React from 'react';
import { GetComponentData } from '../_lib/getComponentData';
import BoardInfo from './BoardInfo';
export interface BoardWithUser extends Board {
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
type BoardListProps = {
  boardSearch: string;
};
function BoardList({ boardSearch }: BoardListProps) {
  const { data } = GetComponentData<BoardResponse>(boardSearch);

  return (
    <>
      <div className="board-list">
        <ul>
          {data?.boards?.map((board) => (
            <li key={board.id}>
              <BoardInfo board={board} />
            </li>
          ))}
        </ul>
      </div>
      <style jsx>{`
        .board-list {
          margin-bottom: 4rem;
        }
        ul {
          list-style: none;
          padding: 0;

          li {
            padding-top: 1rem;
            padding-bottom: 1rem;
            display: flex;
            justify-content: space-between;
            :not(:last-child) {
              border-bottom: 1px solid rgb(107, 114, 128);
            }
            :hover {
              background-color: #f8f9fa;
            }
          }
        }
      `}</style>
    </>
  );
}

export default BoardList;
