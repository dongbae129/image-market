import { ChevronLeft, ChevronRight } from 'lucide-react';
import BoardPostCard from './BoardPostCard';
import { Post } from './boardTypes';
import { useQuery } from '@tanstack/react-query';
import { getBoardsServer } from '@app/board/_lib/getBoardsServer';
import { Board } from '@prisma/client';
import BoardNotice from '@app/board/_component/BoardNotice';

interface BoardPostListProps {
  posts: Post[];
}
type BoardResponse = {
  ok: boolean;
  boards: Board[];
  boardCount: number;
};
export default function BoardPostList({ posts }: BoardPostListProps) {
  // const { data } = useQuery<BoardResponse>({
  //   queryKey: ['boards', 1, ''],
  //   queryFn: getBoardsServer
  // });
  {
    /* {data?.boards.map((board) => (
        <BoardPostCard key={board.id} post={board} />
      ))} */
  }
  return (
    <div className="w-full space-y-3">
      <BoardNotice />
      {posts.map((post) => (
        <BoardPostCard key={post.id} post={post} />
      ))}

      <div className="flex items-center justify-center gap-1.5 pt-6">
        <button className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-400 text-xs font-bold transition">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button className="w-9 h-9 rounded-xl bg-slate-900 text-white font-extrabold text-xs shadow-xs">
          1
        </button>
        <button className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition">
          2
        </button>
        <button className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition">
          3
        </button>
        <button className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 text-xs font-bold transition">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
