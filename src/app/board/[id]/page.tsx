import BoardDetailPage from './_component/BoardDetailPage';

type Props = {
  params: {
    id: string;
  };
};
export default function BoardDetail({ params }: Props) {
  return <BoardDetailPage boardId={params.id} />;
}
