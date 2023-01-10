import type { NextPage } from 'next';
import { useQuery } from 'react-query';
import { getFetch } from '@libs/client/fetcher';
import { Board, BoardHit, User } from '@prisma/client';
import Link from 'next/link';
import Input from '@components/input';
import { useForm } from 'react-hook-form';
import { IoIosSearch } from 'react-icons/io';
import { useState } from 'react';
import { timeForToday } from '@libs/client/timeForToday';
import Button from '@components/button';
import { BiCommentDetail } from 'react-icons/bi';
import { GrView } from 'react-icons/gr';
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
interface BoardSearch {
  search: string;
}
const Boards: NextPage = () => {
  const [boardSearch, setBoardSearch] = useState<string>('');
  const { data, isLoading, error } = useQuery<BoardResponse>(
    ['boards', boardSearch],
    getFetch(`/api/board${boardSearch === '' ? '' : '?search=' + boardSearch}`)
  );

  const { register, handleSubmit } = useForm<BoardSearch>();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error...</div>;

  const onValid = ({ search }: BoardSearch) => {
    if (isLoading) return;
    console.log(search);
    setBoardSearch(search);
    // mutate({ search });
  };
  // const timeForToday = (value) => {
  //   const today = new Date();
  //   const timeValue = new Date(value);

  //   const betweenTime = Math.floor(
  //     (today.getTime() - timeValue.getTime()) / 1000 / 60
  //   );
  //   if (betweenTime < 1) return '방금전';
  //   if (betweenTime < 60) {
  //     return `${betweenTime}분전`;
  //   }

  //   const betweenTimeHour = Math.floor(betweenTime / 60);
  //   if (betweenTimeHour < 24) {
  //     return `${betweenTimeHour}시간전`;
  //   }

  //   const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
  //   if (betweenTimeDay < 365) {
  //     return `${betweenTimeDay}일전`;
  //   }

  //   return `${Math.floor(betweenTimeDay / 365)}년전`;
  // };

  console.log(data, 'Data');
  return (
    <div className="board">
      <div className="board-head">
        <div className="board__refresh"></div>
        <Link href={'/board/upload'}>
          <a>
            <Button isLoading={false} text="Uplaod" />
          </a>
        </Link>
        <div className="search">
          <form onSubmit={handleSubmit(onValid)}>
            <Input
              name="search"
              type="text"
              paddingleft="3rem"
              register={register('search', { required: true })}
              classame="search__input"
              required
            />
            <div className="search__button">
              <IoIosSearch size={'100%'} />
            </div>
          </form>
        </div>
        <div className="board__pagecount"></div>
      </div>
      <div className="board-list">
        <ul>
          {data?.boards.map((board) => (
            <li key={board.id} className="board-list_li">
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
                <div className="board-list__title">
                  <Link href={`/board/${board.id}`}>
                    <a>{board.title}</a>
                  </Link>
                </div>
                {/* <div className="board-list__tag">
                  <span>{board.createdAt.toString()}</span>
                </div> */}
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
            </li>
          ))}
        </ul>
      </div>
      <style jsx>{`
        .board {
          width: 60%;
          margin: auto;
        }

        .board-head {
          position: relative;
          min-height: 65px;
          height: 65px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid rgb(107, 114, 128);
          border-bottom: 1px solid rgb(107, 114, 128);
          padding-top: 1rem;
          padding-bottom: 1rem;

          .board__refresh {
            width: 50px;
            height: 90%;
            border: 1px solid black;
          }
          .board__pagecount {
            border: 1px solid black;
            width: 100px;
            height: 90%;
          }
        }
        .search {
          position: relative;
          width: 40%;

          .search__button {
            position: absolute;
            margin-left: 10px;
            height: 80%;
            border-top-right-radius: 15px;
            border-bottom-right-radius: 15px;
            cursor: pointer;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }
        .board-list {
          margin-bottom: 4rem;

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
              .board-list__main {
                display: flex;
                flex-direction: column;

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
                }
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
          }
        }
      `}</style>
    </div>
  );
};

export default Boards;
