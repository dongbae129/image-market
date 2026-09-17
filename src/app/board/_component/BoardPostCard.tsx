import Link from 'next/link';
import { Eye, MessageSquare, Heart } from 'lucide-react';
import { timeForToday } from '@libs/client/timeForToday';
import { Board, User } from '@prisma/client';
import Image from 'next/image';

interface BoardCardProps {
  post: Board & {
    user: User;
    images: {
      image: string;
    }[];
  };
}

// return (
//   <div className="w-full bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-md transition-all duration-200 group">
//     <div className="flex items-start justify-between gap-4">
//       <div className="space-y-2 flex-1 min-w-0">
//         <div className="flex items-center gap-2">
//           <span
//             className={`px-2 py-0.5 font-bold text-[11px] rounded-md ${post.categoryColor}`}
//           >
//             {post.category}
//           </span>
//           <span className="text-xs text-slate-400 font-medium">
//             {timeForToday(post.createdAt)}
//           </span>
//         </div>
//         <Link
//           href={`/board/${post.id}`}
//           className="font-extrabold text-slate-900 text-base sm:text-lg group-hover:text-indigo-600 transition line-clamp-1"
//         >
//           {post.title}
//         </Link>
//         <p className="text-xs text-slate-500 line-clamp-2 font-medium leading-relaxed">
//           {post.description}
//         </p>
//       </div>

//       {/* {post.thumbnailUrl && (
//         <img
//           src={post.thumbnailUrl}
//           alt="Thumbnail"
//           className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0 border border-slate-100"
//         />
//       )} */}
//     </div>

//     <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-xs">
//       <div className="flex items-center gap-2">
//         {post.user.name.startsWith('배동현') ? (
//           <img
//             src="/localimages/janmang.jpg"
//             alt="Author"
//             className="w-6 h-6 rounded-full object-cover"
//           />
//         ) : (
//           <div className="w-6 h-6 rounded-full bg-indigo-500 text-white font-bold text-[10px] flex items-center justify-center">
//             {'3D'}
//           </div>
//         )}
//         <span className="font-bold text-slate-800">{post.user.name}</span>
//         {true && (
//           <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 font-semibold text-[10px] rounded">
//             PRO
//           </span>
//         )}
//       </div>

//       <div className="flex items-center gap-4 font-semibold text-slate-400">
//         <span className="flex items-center gap-1 hover:text-slate-600">
//           <Eye className="w-3.5 h-3.5" /> {post.viewCount}
//         </span>
//         <span className="flex items-center gap-1 text-indigo-600 font-bold">
//           <MessageSquare className="w-3.5 h-3.5" /> {post.commentCount}
//         </span>
//         <span className="flex items-center gap-1 hover:text-rose-500">
//           <Heart className="w-3.5 h-3.5" /> {post.likeCount}
//         </span>
//       </div>
//     </div>
//   </div>
// );

export default function BoardPostCard({ post }: BoardCardProps) {
  const categoryDatas: Record<string, { color: string; name: string }> = {
    작품피드백: {
      color: 'bg-rose-50 text-rose-600',
      name: '🎨 작품 피드백'
    },
    노하우팁: {
      color: 'bg-emerald-50 text-emerald-600',
      name: '💡 노하우 & 팁'
    },
    자유수다: {
      color: 'bg-indigo-50 text-indigo-600',
      name: '💬 자유수다'
    },
    협업구인: {
      color: 'bg-amber-50 text-amber-600',
      name: '🤝 협업/구인'
    },
    공지사항: {
      color: 'bg-slate-50 text-slate-600',
      name: '📢 공지사항'
    }
  };
  return (
    <div className="w-full bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 font-bold text-[11px] rounded-md ${categoryDatas[post.category].color}`}
            >
              {categoryDatas[post.category].name}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {timeForToday(post.createdAt)}
            </span>
          </div>
          <Link
            href={`/board/${post.id}`}
            className="font-extrabold text-slate-900 text-base sm:text-lg group-hover:text-indigo-600 transition line-clamp-1"
          >
            {post.title}
          </Link>
          <p className="text-xs text-slate-500 line-clamp-2 font-medium leading-relaxed">
            {post.description}
          </p>
        </div>
        {/* {post.images.length > 0 && (
          <div className="w-full h-full block relative">
            <Image
              src={`474x/${convertedUrl(post.images[0].image)}`}
              alt="Thumbnail"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px"
              fill
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0 border border-slate-100"
            />
          </div>
        )} */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-slate-100">
          <Image
            className="object-fill"
            src={`474x/${post.images[0].image}`}
            alt="Thumbnail"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px"
            fill
          />
        </div>
        {/* <img
          src="https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=200&auto=format&fit=crop&q=80"
          alt="Thumbnail"
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0 border border-slate-100"
        /> */}
      </div>

      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-2">
          {(post?.user?.name as string).startsWith('배동현') ? (
            <img
              src="/localimages/janmang.jpg"
              alt="Author"
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-indigo-500 text-white font-bold text-[10px] flex items-center justify-center">
              {'3D'}
            </div>
          )}
          <span className="font-bold text-slate-800">{post.user.name}</span>
          {true && (
            <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 font-semibold text-[10px] rounded">
              PRO
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 font-semibold text-slate-400">
          <span className="flex items-center gap-1 hover:text-slate-600">
            <Eye className="w-3.5 h-3.5" /> {post.viewCount}
          </span>
          <span className="flex items-center gap-1 text-indigo-600 font-bold">
            <MessageSquare className="w-3.5 h-3.5" /> {post.commentCount}
          </span>
          <span className="flex items-center gap-1 hover:text-rose-500">
            <Heart className="w-3.5 h-3.5" /> {post.likeCount}
          </span>
        </div>
      </div>
    </div>
  );
  // return (
  //   <div className="w-full bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-md transition-all duration-200 group">
  //     <div className="flex items-start justify-between gap-4">
  //       <div className="space-y-2 flex-1 min-w-0">
  //         <div className="flex items-center gap-2">
  //           <span
  //             className={`px-2 py-0.5 font-bold text-[11px] rounded-md ${Colors[post.category]}`}
  //           >
  //             {post.category}
  //           </span>
  //           <span className="text-xs text-slate-400 font-medium">
  //             {post.timeAgo}
  //           </span>
  //         </div>
  //         <Link
  //           href={`/board/${post.id}`}
  //           className="font-extrabold text-slate-900 text-base sm:text-lg group-hover:text-indigo-600 transition line-clamp-1"
  //         >
  //           {post.title}
  //         </Link>
  //         <p className="text-xs text-slate-500 line-clamp-2 font-medium leading-relaxed">
  //           {post.summary}
  //         </p>
  //       </div>

  //       {post.thumbnailUrl && (
  //         <img
  //           src={post.thumbnailUrl}
  //           alt="Thumbnail"
  //           className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0 border border-slate-100"
  //         />
  //       )}
  //     </div>

  //     <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-xs">
  //       <div className="flex items-center gap-2">
  //         {post.author.avatar.startsWith('http') ? (
  //           <img
  //             src={post.author.avatar}
  //             alt="Author"
  //             className="w-6 h-6 rounded-full object-cover"
  //           />
  //         ) : (
  //           <div className="w-6 h-6 rounded-full bg-indigo-500 text-white font-bold text-[10px] flex items-center justify-center">
  //             {post.author.avatar}
  //           </div>
  //         )}
  //         <span className="font-bold text-slate-800">{post.author.name}</span>
  //         {post.author.isPro && (
  //           <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 font-semibold text-[10px] rounded">
  //             PRO
  //           </span>
  //         )}
  //       </div>

  //       <div className="flex items-center gap-4 font-semibold text-slate-400">
  //         <span className="flex items-center gap-1 hover:text-slate-600">
  //           <Eye className="w-3.5 h-3.5" /> {post.views}
  //         </span>
  //         <span className="flex items-center gap-1 text-indigo-600 font-bold">
  //           <MessageSquare className="w-3.5 h-3.5" /> {post.comments}
  //         </span>
  //         <span className="flex items-center gap-1 hover:text-rose-500">
  //           <Heart className="w-3.5 h-3.5" /> {post.likes}
  //         </span>
  //       </div>
  //     </div>
  //   </div>
  // );
}
