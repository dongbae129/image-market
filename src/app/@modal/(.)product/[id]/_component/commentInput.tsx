import { Send } from 'lucide-react';

export default function CommentInput() {
  return (
    <div className="pt-2">
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="댓글 추가..."
          className="w-full rounded-full border border-gray-300 bg-gray-50 px-4 py-2.5 pr-10 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <button className="absolute right-2 p-1 text-blue-500 hover:text-blue-600">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
