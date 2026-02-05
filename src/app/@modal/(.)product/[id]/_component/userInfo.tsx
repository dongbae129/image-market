'use client';
import { useFeedDetail } from '@app/@modal/(.)product/[id]/_lib/useFeedQuery';
import Loading from '@app/@modal/(.)product/[id]/loading';
import { User } from 'lucide-react';

type Props = {
  productId: string;
};
export default function UserInfo({ productId }: Props) {
  const { data, isFetching, isLoading } = useFeedDetail(productId);
  console.log(data?.product?.user?.name, isFetching, isLoading, 'infodata');
  // return <Loading />;
  if (!data?.product?.user?.name && isFetching) return <Loading />;

  return (
    <div className="flex items-center space-x-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
        <User size={16} className="text-gray-500" />
      </div>
      <span className="font-bold text-gray-900">userId</span>
    </div>
  );
}
