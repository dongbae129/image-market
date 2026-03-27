'use client';
import { useFeedDetail } from '@app/@modal/(.)product/[id]/_lib/useFeedQuery';
import { Heart, MessageCircle } from 'lucide-react';
import { Product } from '@prisma/client';
type Props = {
  productId: string;
};
type ProductResponse = {
  ok: boolean;
  product: Product;
};
export default function LikeComment({ productId }: Props) {
  const { data } = useFeedDetail(productId) as { data: ProductResponse };
  return (
    <div className="flex items-center space-x-4 border-b border-gray-100 p-2">
      <div className="flex items-center space-x-1 text-gray-700">
        <Heart size={20} className="text-red-500" />
        <span className="text-sm font-semibold">
          +{data.product.likesCount}
        </span>
      </div>
      <div className="flex items-center space-x-1 text-gray-700">
        <MessageCircle size={20} />
        <span className="text-sm font-semibold">
          +{data.product.commentsCount}
        </span>
      </div>
    </div>
  );
}
