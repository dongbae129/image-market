import { getFetch } from '@libs/client/fetcher';
import { Board, User } from '@prisma/client';
import { useRouter } from 'next/router';
import React from 'react';
import { useQuery } from 'react-query';
import Dompurify from 'dompurify';
interface boardDetailResponse {
  ok: boolean;
  board: Board & {
    user: User;
    boardHit: {
      hit: number;
    };
    boardTag: {
      hashtag: string;
    }[];
  };
}
function BoardDetailInfo() {
  const boardId = useRouter().query.id;
  const { data: boardDetail } = useQuery<boardDetailResponse>(
    ['getBoard'],
    getFetch(`/api/board/${boardId}`),
    {
      enabled: !!boardId,

      onError: (err) => {
        console.log(err, 'error');
        // if(err && err?.status >= 400)
      }
    }
  );
  return (
    <>
      <h1>제목: {boardDetail?.board?.title}</h1>
      <main>
        {boardDetail && (
          <div
            dangerouslySetInnerHTML={{
              __html: Dompurify.sanitize(boardDetail?.board?.description)
            }}
          />
        )}
      </main>
      <div>
        {boardDetail?.board?.boardTag[0] &&
          boardDetail?.board?.boardTag[0].hashtag.length > 0 &&
          boardDetail?.board?.boardTag[0].hashtag
            .split(',')
            .map((hashtag, i) => (
              <span className="hashtag" key={i} role="hashtag">
                <span>#</span>
                <span>{hashtag}</span>
              </span>
            ))}
      </div>
      <style jsx>{`
        main {
          margin-top: 2rem;
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

export default BoardDetailInfo;
