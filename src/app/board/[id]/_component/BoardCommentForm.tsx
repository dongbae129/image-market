import { privateApi } from '@libs/client/axiosIntercepotr';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Send } from 'lucide-react';

type BoardCommentFormProps = {
  setComment: (value: React.SetStateAction<string>) => void;
  comment: string;
  avatarClass: string;
  boardId: string;
};
export default function BoardCommentForm({
  setComment,
  comment,
  avatarClass,
  boardId
}: BoardCommentFormProps) {
  const queryClient = useQueryClient();
  const createComment = useMutation({
    mutationFn: (chat: string) =>
      privateApi
        .post(`/api/chat/board/${boardId}`, { chat })
        .then((res) => res.data),
    onSuccess: () => {
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['board-comments', boardId] });
    }
  });
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (comment.trim()) createComment.mutate(comment.trim());
      }}
      className="mb-6 flex gap-3"
    >
      <span className={`${avatarClass} h-9 w-9 text-xs`}>나</span>
      <div className="relative flex-1">
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="댓글을 입력하세요."
          className="h-[69px] w-full resize-none rounded-[11px] border border-slate-200 p-3 pr-24 text-xs outline-none transition focus:border-indigo-300"
        />
        <button
          type="submit"
          disabled={!comment.trim() || createComment.isPending}
          className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-indigo-600 px-3 py-1.5 text-[10px] font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <Send size={11} /> 댓글 작성
        </button>
      </div>
    </form>
  );
}
