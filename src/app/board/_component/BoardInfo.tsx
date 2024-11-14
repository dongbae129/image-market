import { timeForToday } from '@libs/client/timeForToday';
import Link from 'next/link';
import React from 'react';
import { BiCommentDetail } from 'react-icons/bi';
import { GrView } from 'react-icons/gr';
import { BoardWithUser } from './BoardList';

type BoardInfoProps = {
  board: BoardWithUser;
};
function BoardInfo({ board }: BoardInfoProps) {
  return (
    <>
      <div className="board-list__main">
        <div className="board-list__user">
          <Link href={'#'}>
            <a>{board.user.name}</a>
          </Link>
          <span className="board-list__howmanytime">
            {timeForToday(
              board.createdAt
                .toString()
                .slice(0, board.createdAt.toString().indexOf('.'))
            )}
          </span>
        </div>
        <Link href={`/board/${board.id}`}>
          <a className="board-list__title">{board.title}</a>
        </Link>
      </div>
      <div className="board-list__subinfo">
        <div>
          <span>
            <GrView size={20} />
          </span>
          <span>{board.boardHit.hit}</span>
        </div>
        <div>
          <span>
            <BiCommentDetail size={20} />
          </span>
          <span>{board._count.boardChat}</span>
        </div>
      </div>

      <style jsx>{`
        .board-list__main {
          display: flex;
          flex-direction: column;
          flex: 1;

          a:hover {
            color: #1c7ed6;
          }
          .board-list__howmanytime {
            margin-left: 1rem;
          }
          .board-list__user {
            font-size: 0.875rem;
          }

          .board-list__title {
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
          }
        }

        .board-list__subinfo {
          display: flex;
          align-items: center;

          div {
            display: flex;
            align-items: center;

            > span:first-child {
              margin-right: 4px;
            }
          }
          > div:first-child {
            margin-right: 10px;
          }
        }
      `}</style>
    </>
  );
}

export default BoardInfo;
