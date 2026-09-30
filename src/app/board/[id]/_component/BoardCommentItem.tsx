import { formatDate } from '@app/board/[id]/_component/BoardDetailPage';
import { BoardChat } from '@prisma/client';
import sanitizeHtml from 'sanitize-html';
type BoardCommentProps = {
  item: BoardChat & {
    user: {
      image: string;
      name: string;
    };
  };
  avatarClass: string;
};
export default function BoardCommentItem({
  item,
  avatarClass
}: BoardCommentProps) {
  return (
    <article
      key={item.id}
      className="flex gap-3 border-t border-slate-100 py-[18px]"
    >
      <span
        className={`${avatarClass} h-9 w-9 text-xs rounded overflow-hidden`}
      >
        {item.user.image ? (
          <img src={item.user.image} alt="avatar" />
        ) : (
          item.user.name?.slice(0, 1)
        )}
        {/* {item.user.name?.slice(0, 1) ?? 'U'} */}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-extrabold text-slate-700">
          {item.user.name || '익명'}
          <span className="ml-2 text-[9px] font-normal text-slate-400">
            {formatDate(item.createdAt)}
          </span>
        </p>
        <div
          className="mt-1.5 text-[11px] leading-relaxed text-slate-500"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(item.description)
          }}
        />
      </div>
    </article>
  );
}
