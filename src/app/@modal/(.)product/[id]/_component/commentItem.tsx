import { timeForToday } from '@libs/client/timeForToday';
import { User, Heart } from 'lucide-react';

export type CommentType = {
  id: number;
  description: string;
  createdAt: string;
  productId: number;
  user: {
    image: string;
    name: string;
  };
};

export default function CommentItem({ comment }: { comment: CommentType }) {
  return (
    <div className="flex items-start space-x-3 mb-4">
      {/* 1. 유저 이미지 (좌측 고정) */}
      <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0 overflow-hidden flex items-center justify-center">
        {comment.user.image ? (
          <img
            src={comment.user.image}
            alt={comment.user.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <User size={16} className="text-gray-400" />
        )}
      </div>

      {/* 2. 콘텐츠 영역 (min-w-0을 주어 flex 자식이 화면 밖으로 넘어가지 않고 줄바꿈 되게 함) */}
      <div className="flex-1 min-w-0 pt-0.5">
        {/* 🌟 상단: 아이디와 댓글 내용이 한 줄로 시작하고 길면 자동 줄바꿈 */}
        <p className="text-sm text-left text-gray-800 leading-snug break-words">
          <span className="font-semibold text-gray-900 mr-2">
            {comment.user.name}
          </span>
          <span>{comment.description}</span>
        </p>

        {/* 🌟 하단: 시간, 좋아요 수, 답글 달기 등 부가 정보 */}
        <div className="flex items-center space-x-3 mt-1.5 text-xs text-gray-500 font-medium">
          {/* 작성 시간 */}
          <span>{timeForToday(comment.createdAt)}</span>

          {/* 좋아요 카운트 (하트 아이콘 + 숫자) */}
          <button className="flex items-center space-x-1 hover:text-gray-700 transition-colors">
            <Heart
              size={12}
              className={
                'text-red-500 fill-red-500'
                // comment.likesCount > 0 ? 'text-red-500 fill-red-500' : ''
              }
            />
            0
            {/* {comment.likesCount > 0 && <span>{comment.likesCount}</span>} */}
          </button>

          {/* 답글 달기 버튼 (선택사항) */}
          <button className="hover:text-gray-700 transition-colors">
            답글 달기
          </button>
        </div>
      </div>
    </div>
  );
}
