import type { NextPage } from 'next';
import { useQuery } from 'react-query';
import { getFetch } from '@libs/client/fetcher';
import { Board, User } from '@prisma/client';
import Link from 'next/link';
import Button from '@components/button';
interface BoardWithUser extends Board {
  user: User;
}
interface BoardResponse {
  ok: boolean;
  boards: BoardWithUser[];
}
const Boards: NextPage = () => {
  const { data, isLoading, error } = useQuery<BoardResponse>(
    ['boards'],
    getFetch('/api/board')
  );
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error...</div>;
  console.log(data, 'Data');
  return (
    <div>
      {data?.boards?.map((board, i) => (
        <Link key={i} href={`/board/${board.id}`}>
          <a>
            <div>
              <div>{board?.title}</div>
              <div>{board.user.name}</div>
            </div>
          </a>
        </Link>
      ))}
      <Link href="/board/upload">
        <a>
          <Button isLoading={false} text="Uplaod" />
        </a>
      </Link>
      <style jsx>
        {`
          .board {
            margin-bottom: 5px;
          }
          a {
            line-height: 2rem;
          }
          a > div {
            display: flex;
            justify-content: space-around;
            width: 70%;
            margin: 0 auto;
            border-bottom: 1px solid black;
            margin-bottom: 10px;
          }
        `}
      </style>
    </div>
  );
};

export default Boards;
