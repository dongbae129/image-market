import type { NextPage } from 'next';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query';
import { getBoardsServer } from '@app/board/_lib/getBoardsServer';
import BoardContainer from '@app/board/_component/BoardContainer';
import { Suspense } from 'react';

const Boards: NextPage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['boards', 1, ''],
    queryFn: getBoardsServer
  });

  const dehydratedState = dehydrate(queryClient);
  console.log(queryClient.getQueryData(['getProducts']), 'ABCDE', '!!!!');
  return (
    <div className="board w-[60%] m-auto">
      <HydrationBoundary state={dehydratedState}>
        <Suspense>
          <BoardContainer />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
};

export default Boards;
