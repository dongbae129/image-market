import { getFetch } from '@libs/client/fetcher';
import { Board, User } from '@prisma/client';
import { AxiosError } from 'axios';
import React from 'react';
import { useQuery } from '@tanstack/react-query';

import Link from 'next/link';
import Button from '@components/button';

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
interface BoardUser {
  ok: boolean;
  user: User;
}
type Props = {
  boardId: string;
};
function BoardUserInfo({ boardId }: Props) {
  const { data: boardDetail } = useQuery<boardDetailResponse, AxiosError>({
    queryKey: ['getBoard'],
    queryFn: getFetch(`/api/board/${boardId}`),

    enabled: !!boardId
  });
  const { data: userInfo } = useQuery<BoardUser>({ queryKey: ['userInfo'] });
  return (
    <>
      <div className="userwrap">
        <div className="useraccountinfo">
          <div className="userimage">
            <img src="/localimages/emptyuser2.png" alt="avt" />
          </div>
          <div className="userinfo">
            <span>{boardDetail?.board?.user?.email}</span>
            <br />
            <span>{boardDetail?.board?.user?.name}</span>
          </div>
        </div>

        {userInfo?.user?.id === boardDetail?.board.user.id ? (
          <div>
            <Link href={`/board/${boardDetail?.board?.id}/setting`}>
              <div>
                <Button isLoading={false} text="수정" />
              </div>
            </Link>
          </div>
        ) : null}
      </div>
      <style jsx>{`
        .userwrap {
          display: flex;
        }

        .useraccountinfo {
          width: 80%;
          position: relative;
          display: flex;

          .userinfo {
            margin-left: 8px;
          }
        }
        .userimage {
          width: 50px;
          min-width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-right: 5px;
          overflow: hidden;
          position: relative;
        }
      `}</style>
    </>
  );
}

export default BoardUserInfo;
