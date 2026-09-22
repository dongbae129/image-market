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
  await queryClient.prefetchQuery({
    queryKey: ['board-detail', id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/board/${id}`,
        {
          next: {
            tags: ['board-detail', id]
          }
        }
      );
      return res.json();
    }
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BoardDetailPage boardId={id} key={id} />
    </HydrationBoundary>
  );
}
