// // CommentInput.tsx
// export default function CommentInput() {
//   return (
//     // pt-2 제거 (부모에서 이미 패딩 관리 중)
//     <div className="relative flex items-center">
//       <input
//         type="text"
//         placeholder="댓글 추가..."
//         // 🌟 py-2.5 -> py-2 로 변경하여 입력창 뚱뚱함 살짝 줄임
//         className="w-full rounded-full border border-gray-300 bg-gray-50 px-4 py-2 pr-10 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//       />
//       {/* ... 버튼 ... */}
//     </div>
//   );
// }
// CommentInput.tsx
// CommentInput.tsx
// CommentInput.tsx
import { Send } from 'lucide-react';

export default function CommentInput() {
  return (
    // 🌟 겉을 감싸던 <div className="pt-2"> 를 삭제하거나 아래처럼 바꿨습니다.
    <div className="relative flex items-center w-full">
      <input
        type="text"
        placeholder="댓글 추가..."
        className="w-full rounded-full border border-gray-300 bg-gray-50 px-4 py-2 pr-10 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
      <button className="absolute right-2 p-1 text-blue-500 hover:text-blue-600">
        <Send size={18} />
      </button>
    </div>
  );
}
