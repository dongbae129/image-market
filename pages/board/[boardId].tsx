import type { NextPage } from 'next';
import { useRouter } from 'next/router';

const BoardDetail: NextPage = () => {
  const router = useRouter();

  return <div>{router.query.boardId}</div>;
};

export default BoardDetail;
