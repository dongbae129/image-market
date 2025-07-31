import type { NextPage } from 'next';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query';
import { getBoardsServer } from '@app/board/_lib/getBoardsServer';
import BoardContainer from '@app/board/_component/BoardContainer';

const Boards: NextPage = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['boards', 1, ''],
    queryFn: getBoardsServer
  });
  const dehydratedState = dehydrate(queryClient);
  return (
    <div className="board w-[60%] m-auto">
      <HydrationBoundary state={dehydratedState}>
        <BoardContainer />
      </HydrationBoundary>
    </div>
  );
};

export default Boards;
