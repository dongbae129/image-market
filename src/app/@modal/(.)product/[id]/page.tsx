'use client';
import CommentButton from '@app/@modal/(.)product/[id]/_component/commentButton';
import CommentInput from '@app/@modal/(.)product/[id]/_component/commentInput';
import FeedModal from '@app/@modal/(.)product/[id]/_component/feedModal';
import LikeComment from '@app/@modal/(.)product/[id]/_component/likeComment';
import ModalImage from '@app/@modal/(.)product/[id]/_component/modalImage';
import ModalTest from '@app/@modal/(.)product/[id]/_component/modalTest';
import SusTest from '@app/@modal/(.)product/[id]/_component/susTest';
import UserInfo from '@app/@modal/(.)product/[id]/_component/userInfo';
import Loading from '@app/@modal/(.)product/[id]/loading';
import { getProduct } from '@app/product/[id]/_lib/getProduct';
import DeleteSkeleton from '@components/DeleteSkeleton';
import DetailModal from '@components/DetailModal';
import LoadingSkeleton from '@components/LoadingSkeleton';
import { Product } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';

type Props = {
  params: Promise<{ id: string }>;
};
type ProductResponse = {
  ok: boolean;
  product: Product;
  timeExpired: 'R' | 'F' | 'P';
};
export default function IntercetProductPage() {
  const { id } = useParams();
  const productId = id.toString();
  const { data } = useQuery<ProductResponse>({
    queryKey: ['product', id],
    queryFn: () => getProduct(productId)
  });

  // if (data?.product?.tag !== '*&^$') return <LoadingSkeleton />;
  // console.log(id, 'PID');
  return (
    <DetailModal>
      <div className="h-full">
        {/* <LoadingSkeleton /> */}
        {data?.timeExpired === 'P' ? (
          <LoadingSkeleton />
        ) : data?.timeExpired === 'F' ? (
          <DeleteSkeleton />
        ) : (
          <div>
            <LikeComment productId={productId} />
            <ModalImage productId={productId} />
            <div className="space-y-3 p-2">
              <UserInfo productId={productId} />
              <CommentButton productId={productId} />
              <div className="flex items-start space-x-2 text-sm">
                <span className="font-semibold text-gray-900">
                  {data?.product?.userId}
                </span>
                <span className="line-clamp-1 text-gray-600">
                  와이어프레임이랑 똑같이 구현됐네요! 너무 멋집니다 ✨
                </span>
              </div>
              <CommentInput />
            </div>
          </div>
        )}
      </div>
    </DetailModal>
    // <div className="TEST">
    //   TESTTTTT
    //   <ModalTest />
    // </div>
    // <DetailModal>
    //   <div className="fixed inset-0 z-[999] mx-auto flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-8">
    //     <div className="relative w-full max-w-[1000px] h-full max-h-[85vh] md:max-h-[800px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200">
    //       <button
    //         onClick={onClose}
    //         aria-label="closeButton"
    //         className="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 hover:bg-gray-100 shadow-sm transition-all md:right-6 md:top-6"
    //       >
    //         <svg
    //           className="h-6 w-6 text-gray-700"
    //           fill="none"
    //           viewBox="0 0 24 24"
    //           stroke="currentColor"
    //         >
    //           <path
    //             strokeLinecap="round"
    //             strokeLinejoin="round"
    //             strokeWidth={2.5}
    //             d="M6 18L18 6M6 6l12 12"
    //           />
    //         </svg>
    //       </button>
    //       모달 열리는지 테스트
    //     </div>
    //   </div>
    // </DetailModal>
  );
}
