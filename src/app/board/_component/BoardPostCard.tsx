import Link from 'next/link';
import { Eye, MessageSquare, Heart } from 'lucide-react';
import { Post } from './boardTypes';

interface BoardPostCardProps {
  post: Post;
}

export default function BoardPostCard({ post }: BoardPostCardProps) {
  return (
    <div className="w-full bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 font-bold text-[11px] rounded-md ${post.categoryColor}`}
            >
              {post.category}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {post.timeAgo}
            </span>
          </div>
          <Link
            href={`/board/${post.id}`}
            className="font-extrabold text-slate-900 text-base sm:text-lg group-hover:text-indigo-600 transition line-clamp-1"
          >
            {post.title}
          </Link>
          <p className="text-xs text-slate-500 line-clamp-2 font-medium leading-relaxed">
            {post.summary}
          </p>
        </div>

        {post.thumbnailUrl && (
          <img
            src={post.thumbnailUrl}
            alt="Thumbnail"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0 border border-slate-100"
          />
        )}
      </div>

      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-2">
          {post.author.avatar.startsWith('http') ? (
            <img
              src={post.author.avatar}
              alt="Author"
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-indigo-500 text-white font-bold text-[10px] flex items-center justify-center">
              {post.author.avatar}
            </div>
          )}
          <span className="font-bold text-slate-800">{post.author.name}</span>
          {post.author.isPro && (
            <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 font-semibold text-[10px] rounded">
              PRO
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 font-semibold text-slate-400">
          <span className="flex items-center gap-1 hover:text-slate-600">
            <Eye className="w-3.5 h-3.5" /> {post.views}
          </span>
          <span className="flex items-center gap-1 text-indigo-600 font-bold">
            <MessageSquare className="w-3.5 h-3.5" /> {post.comments}
          </span>
          <span className="flex items-center gap-1 hover:text-rose-500">
            <Heart className="w-3.5 h-3.5" /> {post.likes}
          </span>
        </div>
      </div>
    </div>
  );
}
