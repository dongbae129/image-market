import { Heart, MoreHorizontal, Share2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BoardMainNav({
  likeCount,
  isOwner,
  boardId
}: {
  likeCount: number;
  isOwner: boolean | undefined;
  boardId: number;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="relative mt-5">
      <div className="flex justify-end gap-2">
        <button
          type="button"
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-indigo-100 px-3.5 text-[11px] text-indigo-600 transition hover:bg-indigo-50"
        >
          <Heart size={14} /> 좋아요 {likeCount}
        </button>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-200 px-3.5 text-[11px] text-slate-600 transition hover:bg-slate-50"
        >
          <Share2 size={14} /> 공유하기
        </button>
        {isOwner !== false && (
          <button
            type="button"
            aria-label="더보기"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            disabled={isOwner === undefined}
            onClick={() => setMenuOpen((open) => !open)}
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors disabled:cursor-wait disabled:opacity-60 ${menuOpen ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}
          >
            <MoreHorizontal size={16} />
          </button>
        )}
      </div>
      {isOwner && (
        <div
          role="menu"
          className={`absolute right-0 top-full z-30 mt-2 min-w-36 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg transition-[opacity,transform] duration-150 ease-out ${menuOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-1 opacity-0'}`}
          aria-hidden={!menuOpen}
        >
          <button
            type="button"
            role="menuitem"
            tabIndex={menuOpen ? 0 : -1}
            onClick={() => router.push(`/board/${boardId}/setting`)}
            className="flex w-full items-center rounded-lg px-4 py-2.5 text-left text-xs font-semibold text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
          >
            수정하기
          </button>
        </div>
      )}
    </div>
  );
}
