import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Button from '@components/button';
import { useMutation, useQuery } from 'react-query';
import axios, { AxiosError } from 'axios';
import { getFetch, newAxios } from '@libs/client/fetcher';
import { Board, Chat, User } from '@prisma/client';
import Link from 'next/link';
import NextImage from 'next/image';
import { timeForToday } from '@libs/client/timeForToday';
import Editor from '@components/editor';
import Dompurify from 'dompurify';
export interface boardChat {
  chat: string;
}
interface chatWithUser extends Chat {
  user: {
    name: string;
  };
}
interface BoardUser {
  ok: boolean;
  user: User;
}
export interface UploadChatResponse {
  ok: boolean;
  comments: chatWithUser[];
  error?: string;
  message?: string;
}
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
const BoardDetail: NextPage = () => {
  const router = useRouter();

  const boardId = router.query.id;

  const { data: boardDetail } = useQuery<boardDetailResponse, AxiosError>(
    ['getBoard'],
    getFetch(`/api/board/${boardId}`),
    {
      enabled: !!boardId,
      onSuccess: (res) => {
        if (
          res instanceof AxiosError &&
          res.response &&
          res.response.status > 400
        )
          router.replace('/board');
      },
      onError: (err) => {
        console.log(err, 'error');
        // if(err && err?.status >= 400)
      }
    }
  );
  const { data, refetch } = useQuery<UploadChatResponse>(
    ['getChats'],
    getFetch(`/api/chat/board/${boardId}`),
    {
      enabled: !!boardId
    }
  );
  console.log(data, 'Data');
  const chatting = (data: boardChat) =>
    newAxios.post(`/api/chat/board/${boardId}`, data).then((res) => res.data);
  const { mutate, isLoading } = useMutation<UploadChatResponse, any, boardChat>(
    chatting,
    {
      onError: (error) => {
        console.error(error);
      },
      onSuccess: (res) => {
        console.log(res, 'RES');
        refetch();
      }
    }
  );
  const { data: userInfo } = useQuery<BoardUser>(['userInfo']);
  console.log(userInfo, 'userinfo');
  return (
    <div className="articlewrap">
      <div className="infoline">
        <span>게시판</span>
      </div>
      <div>
        <h1>제목: {boardDetail?.board?.title}</h1>
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
            boardDetail?.board?.boardTag[0].hashtag
              .split(',')
              .map((hashtag, i) => (
                <span className="hashtag" key={i}>
                  <span>#</span>
                  <span>{hashtag}</span>
                </span>
              ))}
        </div>
        <div className="infoline">
          <span></span>
        </div>
        <h3>{data?.comments.length}개의 댓글</h3>
        <div className="chatformwrap">
          <div className="chatform">
            <div className="userimage">
              <NextImage
                src="/localimages/emptyuser.png"
                layout="fill"
                alt="userImage"
              />
            </div>
            <div className="chatinput">
              <div
                style={{
                  minHeight: '200px',
                  height: '200px',
                  position: 'relative'
                }}
              >
                <Editor
                  mutate={mutate}
                  isLoading={isLoading}
                  btntrue={true}
                  btnActive={userInfo?.user ? false : true}
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          {data?.comments.map((comment) => (
            <div key={comment.id} className="comment_list">
              <div>
                <div className="userimage">
                  <NextImage
                    src="/localimages/emptyuser.png"
                    layout="fill"
                    alt="userImage"
                  />
                </div>
                <div>
                  <div className="comment_list_name">{comment.user.name}</div>

                  <span className="comment_time">
                    {timeForToday(
                      comment.createdAt
                        .toString()
                        .slice(0, comment.createdAt.toString().indexOf('.'))
                    )}
                  </span>
                </div>
              </div>
              {typeof window && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: Dompurify.sanitize(comment.description)
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <style jsx>
        {`
          a {
            color: blue;
          }
          .articlewrap {
            margin: auto;
            width: 50vw;
          }
          .infoline {
            display: flex;
            justify-content: center;
            margin-top: 1.75rem;
            position: relative;
            > span {
              background-color: white;
              color: rgba(0, 0, 0, 0.45);
              padding-left: 0.5rem;
              padding-right: 0.5rem;
              font-weight: 600;
            }
            > span::before {
              content: '';
              position: absolute;

              z-index: -1;
              width: 100%;
              top: 50%;
              left: 0;
              border-top: 1px solid rgba(0, 0, 0, 0.16);
            }
          }
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
          .chatformwrap {
            display: flex;
            justify-content: center;
            border: 1px solid rgba(0, 0, 0, 0.16);
            border-radius: 0.5rem;
            margin-top: 4rem;
            margin-bottom: 4rem;
            padding: 1rem;
          }
          .chatform {
            display: flex;
            width: 80%;
            margin-top: 2rem;
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
          .chatinput_btn {
            display: flex;
            justify-content: flex-end;
            margin-top: 0.8rem;

            > div {
              width: 15%;
              min-width: 90px;
            }
          }
          .chatinput {
            position: relative;
            width: 80%;
            display: flex;
            flex-direction: column;
            > div:first-child {
              min-height: 200px;
              height: 200px;
              position: relative;
            }
          }

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
          .comment_list {
            border-bottom: 1px solid rgba(0, 0, 0, 0.16);
            padding-top: 1rem;
            padding-bottom: 1rem;

            > div:first-child {
              display: flex;
            }
          }
          .comment_list_name {
            font-weight: bold;
          }
          .comment_time {
            font-size: 0.9rem;
          }
        `}
      </style>
    </div>
  );
};

export default BoardDetail;
