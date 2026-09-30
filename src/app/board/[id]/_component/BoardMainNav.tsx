import { Heart, MoreHorizontal, Share2 } from 'lucide-react';

export default function BoardMainNav({ likeCount }: { likeCount: number }) {
  return (
    <div className="mt-5 flex justify-end gap-2">
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
      <button
        type="button"
        aria-label="더보기"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50"
      >
        <MoreHorizontal size={16} />
      </button>
    </div>
  );
}
