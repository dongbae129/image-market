import type { NextPage } from 'next';
import { useQuery } from 'react-query';
import { getFetch } from '@libs/client/fetcher';
import { Board as BoardPrisma } from '@prisma/client';
import Link from 'next/link';
import Button from '@components/button';

const Board: NextPage = () => {
  const { data, isLoading } = useQuery(['boards'], getFetch('/api/board'));
  // console.log(data, 'Data');
  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      {data?.boards.map((board: BoardPrisma) => (
        <Link key={board.id} href={`/board/${board.id}`}>
          <a>
            <div>{board.title}</div>
          </a>
        </Link>
      ))}
      <Link href="/board/upload">
        <a>
          <Button isLoading={false} text="Uplaod" />
        </a>
      </Link>
    </div>
  );
};

export default Board;
