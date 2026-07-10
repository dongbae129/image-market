'use client';
import { useFeedDetail } from '@app/@modal/(.)product/[id]/_lib/useFeedQuery';
import { User } from 'lucide-react';

type Props = {
  productId: string;
};
export default function UserInfo({ productId }: Props) {
  const { data } = useFeedDetail(productId);
  console.log(data, 'userimage');
  return (
    <div className="flex items-center space-x-2">
      <div className="flex overflow-hidden h-8 w-8 items-center justify-center rounded-full bg-gray-200">
        {data?.product.user.image ? (
          <img
            src={data?.product.user.image}
            alt={`${data?.product.user.id}` || 'userimage'}
            className="w-full h-full object-cover"
          />
        ) : (
          <User size={16} className="text-gray-500" />
        )}
        {/* {data?.product.user.image ?? 
        <img src={data?.product?.user?.image} alt={data?.product.user.id! || "userimage"} className='w-full h-full object-cover'/> 
        : 
        <User size={16} className="text-gray-500" />} */}
      </div>
      <span className="font-bold text-gray-900">
        {data?.product.user.email}
      </span>
    </div>
  );
}
