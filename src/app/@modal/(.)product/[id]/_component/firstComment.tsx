import { User } from 'lucide-react';

type FirstCommentProps = {
  firstComment: {
    description: string;
    user: {
      image: string;
      name: string;
    };
  };
};
export default function FirstComment({ firstComment }: FirstCommentProps) {
  return (
    <div className="flex items-center space-x-2 w-full h-full min-w-0">
      {/* 유저 이미지 */}
      <div className="w-6 h-6 rounded-full bg-gray-200 shrink-0 overflow-hidden flex items-center justify-center">
        {firstComment.user.image ? (
          <img
            src={firstComment.user.image}
            alt={firstComment.user.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <User size={12} className="text-gray-400" />
        )}
      </div>

      <div className="flex items-center space-x-1.5 flex-1 min-w-0 h-full whitespace-nowrap overflow-hidden">
        <span className="font-semibold text-gray-900 shrink-0">
          {firstComment.user.name}
        </span>
        <span className="truncate text-gray-600 flex-1">
          {firstComment.description}
        </span>
      </div>
    </div>
  );
}
