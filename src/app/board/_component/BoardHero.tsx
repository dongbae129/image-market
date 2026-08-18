import Link from 'next/link';
import { PenTool } from 'lucide-react';

interface BoardHeroProps {
  totalPostCount: number;
}

export default function BoardHero({ totalPostCount }: BoardHeroProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 text-[11px] font-extrabold bg-indigo-50 text-indigo-600 rounded-md">
            PINZ COMMUNITY
          </span>
          <span className="text-xs text-slate-400 font-medium">
            실시간 게시글 {totalPostCount.toLocaleString()}개
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          크리에이터 게시판
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          영감을 나누고, 피드백을 주고받으며 자유롭게 창작 이야기를
          공유해보세요.
        </p>
      </div>

      <Link
        href="/upload"
        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-full shadow-md shadow-indigo-500/20 transition-all active:scale-95 shrink-0"
      >
        <PenTool className="w-4 h-4" /> 새 글 쓰기
      </Link>
    </div>
  );
}
