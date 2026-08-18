import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BestPost } from './boardTypes';

interface BoardSidebarProps {
  bestPosts: BestPost[];
  keywords: string[];
}

export default function BoardSidebar({
  bestPosts,
  keywords
}: BoardSidebarProps) {
  return (
    <div className="w-full space-y-5">
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
            🔥 이번 주 베스트 글
          </h3>
          <span className="text-[11px] font-bold text-indigo-600">TOP 3</span>
        </div>

        <div className="space-y-3.5">
          {bestPosts.map((post) => (
            <Link
              key={post.id}
              href={`/board/${post.id}`}
              className="flex items-start gap-3 group"
            >
              <span
                className={`w-5 h-5 rounded-md font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${
                  post.rank === 1
                    ? 'bg-amber-400 text-amber-950 font-black'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {post.rank}
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition line-clamp-1">
                  {post.title}
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 font-medium">
                  <span>{post.author}</span>
                  <span>•</span>
                  <span>❤️ {post.likes}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
            💬 피드백이 필요해요!
          </h3>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <p className="text-xs text-slate-600 font-medium mb-3 leading-relaxed">
          동료 크리에이터의 작품에 따뜻한 피드백을 남기고 소통해보세요.
        </p>
        <Link
          href="/board?category=feedback"
          className="w-full py-2.5 bg-white hover:bg-slate-50 border border-indigo-200/80 rounded-xl text-indigo-600 font-bold text-xs flex items-center justify-center gap-1 shadow-2xs transition"
        >
          피드백 게시글 보기 <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
        <h3 className="font-extrabold text-slate-900 text-sm mb-3">
          🏷️ 게시판 인기 키워드
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {keywords.map((tag) => (
            <Link
              key={tag}
              href={`/board?search=${encodeURIComponent(tag)}`}
              className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-lg text-xs font-semibold transition"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
