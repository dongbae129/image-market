import { Heart, MessageCircle } from 'lucide-react';

export default function LikeComment() {
  return (
    <div className="flex items-center space-x-4 border-b border-gray-100 p-2">
      <div className="flex items-center space-x-1 text-gray-700">
        <Heart size={20} className="text-red-500" />
        <span className="text-sm font-semibold">+999</span>
      </div>
      <div className="flex items-center space-x-1 text-gray-700">
        <MessageCircle size={20} />
        <span className="text-sm font-semibold">+999</span>
      </div>
    </div>
  );
}
