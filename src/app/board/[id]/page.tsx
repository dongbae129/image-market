import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query';
import BoardDetailPage from './_component/BoardDetailPage';

type Props = {
  params: {
    id: string;
  };
};
export default async function BoardDetail({ params }: Props) {
  const queryClient = new QueryClient();
  const { id } = await params;
  console.log('🔥 PAGE SSR EXECUTED:', id);
  await queryClient.prefetchQuery({
    queryKey: ['board-detail', id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/board/${id}`,
        {
          next: {
            tags: ['board-detail', id]
          },
          cache: 'no-store'
        }
      );
      const data = await res.json();
      console.log('🔥 PAGE SSR DATA:', data.board.boardHit);

      // console.log(data, 'ssr data');
      return data;
    }
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BoardDetailPage boardId={id} />
    </HydrationBoundary>
  );
}
