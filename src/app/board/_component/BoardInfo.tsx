import { timeForToday } from '@libs/client/timeForToday';
import Link from 'next/link';
import React from 'react';
import { BiCommentDetail } from 'react-icons/bi';
import { GrView } from 'react-icons/gr';
import { BoardWithUser } from './BoardContainer';
// import DOMPurify from 'dompurify';
import DOMPurify from 'isomorphic-dompurify';

type BoardProps = {
  board: BoardWithUser;
};

function BoardInfo({ board }: BoardProps) {
  return (
    <>
      <div>
        <div className="w-16 h-16 border-gray-400 border rounded-md text-center pt-4 leading-4">
          <span className="text-gray-500">답변</span>
          <div className="mt-1">{board?._count.boardChat}</div>
        </div>
      </div>
      <div className="board-list__main">
        <div className="board-list__user gap-x-1">
          <Link href={'#'} className="rounded-[50%] overflow-hidden">
            <img src="localimages/emptyuser3.png" alt="avatar" />
          </Link>
          <Link href={'#'}>
            <div className="t_h">{board?.user.name}</div>
          </Link>
          <span className="board-list__howmanytime">
            {timeForToday(
              board?.createdAt
                .toString()
                .slice(0, board?.createdAt.toString().indexOf('.'))
            )}
          </span>
        </div>
        <Link href={`/board/${board?.id}`} className="mt-2">
          <div className="flex flex-col gap-y-3">
            <div className="board-list__title font-semibold text-lg text-gray-900 t_h">
              {board?.title}
            </div>
            <div
              className="t_h line-clamp-2 text-sm text-gray-500 font-normal"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(board.description)
              }}
            />
            <div>
              {board?.boardTag[0]?.hashtag.length > 0 &&
                board?.boardTag[0]?.hashtag.split(',').map((hashtag, i) => (
                  <span className="hashtag" key={i} role="hashtag">
                    <span>#</span>
                    <span>{hashtag}</span>
                  </span>
                ))}
            </div>
          </div>
        </Link>
      </div>
      <div className="board-list__subinfo">
        <div>
          <span>
            <GrView size={20} />
          </span>
          <span>{board?.boardHit.hit}</span>
        </div>
        <div>
          <span>
            <BiCommentDetail size={20} />
          </span>
          <span>{board?._count.boardChat}</span>
        </div>
      </div>

      <style jsx>{`
        .board-list__main {
          display: flex;
          flex-direction: column;
          flex: 1;

          .board-list__howmanytime {
            margin-left: 1rem;
          }
          .board-list__user {
            display: flex;
            font-size: 0.875rem;
          }
        }
        .t_h:hover {
          color: #1c7ed6;
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
        .hashtag {
          background-color: #f8f9fa;
          display: inline-block;
          border-radius: 1rem;
          height: 2rem;
          line-height: 2rem;
          padding-left: 1rem;
          padding-right: 1rem;
          margin-right: 0.75rem;
          margin-bottom: 1rem;
          &:hover {
            cursor: pointer;
            background-color: darkgray;
          }
          span {
            font-weight: bold;
          }

          span:nth-child(1) {
            color: #12b886;
            font-weight: bold;
            padding-right: 0.2rem;
          }
        }
      `}</style>
    </>
  );
}

export default BoardInfo;
