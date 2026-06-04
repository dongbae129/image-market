'use client';
import { useFeedDetail } from '@app/@modal/(.)product/[id]/_lib/useFeedQuery';
// import { ChevronDown } from 'lucide-react';

export default function CommentButton({ productId }: { productId: string }) {
  const { data } = useFeedDetail(productId);
  return (
    // <div>{test?.product?.title}</div>

    <div>{data?.product?.title}</div>
    // <button className="flex items-center text-xs text-gray-500 hover:text-gray-700">
    //   <span>댓글 999+개</span>
    //   <ChevronDown size={14} className={`ml-1 transition-transform`} />
    // </button>
  );
}
