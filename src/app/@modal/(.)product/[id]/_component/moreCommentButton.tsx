type Props = {
  commentCount: number;
  setIsCommentSheetOpen: (value: React.SetStateAction<boolean>) => void;
};
export default function MoreCommentButton({
  setIsCommentSheetOpen,
  commentCount
}: Props) {
  return (
    <div>
      <button
        onClick={() => setIsCommentSheetOpen(true)}
        className="w-full text-sm text-gray-400 font-medium"
        style={{ height: '20px' }} // 🌟 버튼 높이도 20px로 강제 고정
      >
        댓글 {commentCount || 0}개 모두 보기
      </button>
    </div>
  );
}
