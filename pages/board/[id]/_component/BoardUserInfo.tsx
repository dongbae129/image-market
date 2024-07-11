import { getFetch } from '@libs/client/fetcher';
import { Board, User } from '@prisma/client';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import React from 'react';
import { useQuery } from 'react-query';
import Link from 'next/link';
import Button from '@components/button';
import NextImage from 'next/image';
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
function BoardUserInfo({}) {
  const router = useRouter();
  console.log(router, 'rou');
  const { id: boardId } = router.query;
  const { data: boardDetail } = useQuery<boardDetailResponse, AxiosError>(
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
  const { data: userInfo } = useQuery<BoardUser>(['userInfo']);
  return (
    <>
      <div className="userwrap">
        <div className="useraccountinfo">
          <div className="userimage">
            <NextImage
              src="/localimages/emptyuser.png"
              layout="fill"
              alt="userImage"
            />
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
              <a>
                <Button isLoading={false} text="수정" />
              </a>
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
