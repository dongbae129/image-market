import Link from 'next/link';

export default function UserInfocard({
  avatarClass,
  authorName,
  boardUserTrue,
  boardId
}) {
  return (
    <section className="rounded-[18px] border border-slate-200 bg-white p-5">
      <h2 className="mb-4 text-sm font-extrabold text-slate-800">
        작성자 정보
      </h2>
      <div className="flex items-center gap-3">
        <span className={`${avatarClass} h-[51px] w-[51px] text-lg`}>
          {authorName.slice(0, 1)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-extrabold text-slate-700">
            {authorName}
          </p>
          <p className="mt-1 text-[9px] text-slate-400">크리에이터</p>
          <p className="mt-1 text-[9px] text-slate-400">
            게시글을 공유하는 멤버
          </p>
        </div>
        {boardUserTrue ? (
          <Link
            href={`/board/${boardId}/setting`}
            className="shrink-0 rounded-full border border-indigo-300 px-2.5 py-1.5 text-[9px] font-bold text-indigo-600"
          >
            수정
          </Link>
        ) : (
          <button
            type="button"
            className="shrink-0 rounded-full border border-indigo-300 px-2.5 py-1.5 text-[9px] font-bold text-indigo-600"
          >
            + 팔로우
          </button>
        )}
      </div>
    </section>
  );
}
