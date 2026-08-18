import { Post } from '@app/board/_component/boardTypes';
import { Eye, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function BoardNotice() {
  const notice = {
    id: 'pinned-1',
    category: '공지사항',
    categoryColor: 'bg-amber-100 text-amber-900',
    title:
      '[공지] Pinz 크리에이터 커뮤니티 클린 이용 수칙 및 저작권 가이드라인 안내',
    summary: '',
    author: { name: 'Pinz 관리자', avatar: 'P' },
    timeAgo: '2026.08.10',
    views: 3420,
    comments: 42,
    likes: 128,
    isPinned: true
  };
  return (
    <div className="w-full bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-4 hover:shadow-xs transition">
      <span className="px-2.5 py-1 bg-amber-400 text-amber-950 font-extrabold text-[11px] rounded-lg shrink-0 mt-0.5">
        필독 공지
      </span>
      <div className="flex-1 min-w-0">
        <Link
          href={`/board/${notice.id}`}
          className="font-extrabold text-slate-900 text-sm sm:text-base hover:text-indigo-600 transition truncate block"
        >
          {notice.title}
        </Link>
        <div className="flex items-center gap-4 mt-2 text-xs font-medium text-slate-500">
          <span className="font-bold text-slate-800">{notice.author.name}</span>
          <span>{notice.timeAgo}</span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /> {notice.views.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" /> {notice.comments}
          </span>
        </div>
      </div>
    </div>
  );
}
