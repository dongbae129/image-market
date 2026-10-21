'use client';
import BoardPostCard from './BoardPostCard';
import { useQuery } from '@tanstack/react-query';
import { getBoardsServer } from '@app/board/_lib/getBoardsServer';
import { Board } from '@prisma/client';
import BoardNotice from '@app/board/_component/BoardNotice';
import { useSearchParams } from 'next/navigation';
import { Pagination } from '@app/board/_component/Pagination';

export default function BoardPostList() {
  // const router = useRouter();
  // const pathName = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const { data } = useQuery({
    queryKey: ['boards', { page: currentPage }],
    queryFn: () => getBoardsServer(currentPage),
    staleTime: 5 * 1000
  });
  console.log(data, 'board ata');
  const { page, totalPages } = data.meta;
  return (
    <div className="w-full space-y-3">
      <BoardNotice />

      {data?.boards.map((board: Board) => (
        <BoardPostCard key={board.id} post={board} />
      ))}

      {/* {posts.map((post) => (
        <BoardPostCard key={post.id} post={post} />
      ))} */}
      <Pagination currentPage={page} totalPages={totalPages} />
      {/* <div className="flex items-center justify-center gap-1.5 pt-6">
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
      </div> */}
    </div>
  );
}
