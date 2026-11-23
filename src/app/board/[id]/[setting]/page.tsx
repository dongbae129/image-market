'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getFetch } from '@libs/client/fetcher';
import ProductEditor, {
  BoardEditorData
} from '@app/upload/_component/ProductEditor';

type BoardResponse = {
  ok: boolean;
  board?: BoardEditorData & { userId: number };
};
type UserResponse = { ok: boolean; user?: { id: number } };

export default function BoardSettingPage({
  params
}: {
  params: { id: string };
}) {
  const boardId = params.id;
  const router = useRouter();
  const { data: boardResponse, isLoading: boardLoading } =
    useQuery<BoardResponse>({
      queryKey: ['board-detail', boardId],
      queryFn: () => getFetch(`/api/board/${boardId}`),
      enabled: !!boardId
    });
  const { data: userResponse, isLoading: userLoading } = useQuery<UserResponse>(
    {
      queryKey: ['current-user'],
      queryFn: () => getFetch('/api/user')
    }
  );

  const board = boardResponse?.board;
  const isOwner = !!board && userResponse?.user?.id === board.userId;
  useEffect(() => {
    if (!boardLoading && !userLoading && board && !isOwner)
      router.replace(`/board/${boardId}`);
  }, [board, boardId, boardLoading, isOwner, router, userLoading]);

  if (boardLoading || userLoading)
    return (
      <div className="p-8 text-center">게시글 정보를 불러오는 중입니다.</div>
    );
  if (!isOwner || !board)
    return <div className="p-8 text-center">작성자만 수정할 수 있습니다.</div>;

  return (
    <ProductEditor
      key={boardId}
      mode="edit"
      editType="board"
      boardId={boardId}
      initialBoard={board}
    />
  );
}
