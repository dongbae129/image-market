// 'use client';
// import CommentInput from '@app/@modal/(.)product/[id]/_component/commentInput';
// import LikeComment from '@app/@modal/(.)product/[id]/_component/likeComment';
// import ModalImage from '@app/@modal/(.)product/[id]/_component/modalImage';
// import UserInfo from '@app/@modal/(.)product/[id]/_component/userInfo';
// import { getProduct } from '@app/product/[id]/_lib/getProduct';
// import DeleteSkeleton from '@components/DeleteSkeleton';
// import DetailModal from '@components/DetailModal';
// import LoadingSkeleton from '@components/LoadingSkeleton';
// import { useQuery } from '@tanstack/react-query';
// import { useParams } from 'next/navigation';
// import { useState } from 'react';

// // type Props = {
// //   params: Promise<{ id: string }>;
// // };
// // type ProductResponse = {
// //   ok: boolean;
// //   product: Product;
// //   timeExpired: 'R' | 'F' | 'P';
// // };
// export default function IntercetProductPage() {
//   const [isCommentSheetOpen, setIsCommentSheetOpen] = useState(false); // 바텀시트 상태

//   const { id } = useParams();
//   const productId = id.toString();
//   const { data } = useQuery({
//     queryKey: ['product', id],
//     queryFn: () => getProduct(productId)
//   });

//   // if (data?.product?.tag !== '*&^$') return <LoadingSkeleton />;
//   // console.log(id, 'PID');
//   return (
//     <DetailModal>
//       {/* 1. 최상단 컨테이너: overflow-hidden으로 모달 밖으로 나가는 요소(숨긴 바텀시트)를 완전히 잘라냅니다. */}
//       <div className="h-full relative flex flex-col overflow-hidden bg-white -m-4">
//         {data?.timeExpired === 'P' ? (
//           <LoadingSkeleton />
//         ) : data?.timeExpired === 'F' ? (
//           <DeleteSkeleton />
//         ) : (
//           <>
//             {/* 2. 메인 컨텐츠 영역 (이미지, 좋아요 등) */}
//             {/* 🌟 pb-24 (약 96px)를 주어 맨 밑으로 스크롤해도 '더보기 버튼'이 고정된 입력창에 가려지지 않게 띄워줍니다. */}
//             <div className="flex-1 overflow-y-auto p-4">
//               <LikeComment productId={productId} />
//               <ModalImage productId={productId} />

//               <div className="space-y-3 p-2">
//                 <UserInfo productId={productId} />

//                 {/* 첫 번째 대표 댓글 1개 노출 */}
//                 <div className="flex items-start space-x-2 text-sm">
//                   <span className="font-semibold text-gray-900">
//                     {data?.product?.userId}
//                   </span>
//                   <span className="line-clamp-1 text-gray-600">
//                     와이어프레임이랑 똑같이 구현됐네요! 너무 멋집니다 ✨
//                   </span>
//                 </div>

//                 {/* 댓글 더보기 버튼 */}
//                 <button
//                   onClick={() => setIsCommentSheetOpen(true)}
//                   className="w-full text-sm text-gray-400 font-medium"
//                 >
//                   댓글 15개 모두 보기
//                 </button>
//               </div>
//             </div>

//             {/* 3. 뒷배경 딤처리 (바텀시트가 열릴 때만 메인 콘텐츠를 어둡게 덮음) */}
//             <div
//               className={`absolute inset-0 bg-black/20 transition-opacity duration-700 z-10 ${
//                 isCommentSheetOpen
//                   ? 'opacity-100 pointer-events-auto'
//                   : 'opacity-0 pointer-events-none'
//               }`}
//               onClick={() => setIsCommentSheetOpen(false)}
//             />

//             {/* ========================================================== */}
//             {/* 4. 🌟 바텀시트 & 단일 댓글 입력창 통합 래퍼 (깜빡임 완벽 해결) 🌟 */}
//             {/* ========================================================== */}

//             {/* 이 래퍼는 항상 모달의 최하단에 고정되어 있습니다. */}
//             <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col">
//               {/* [댓글 리스트 영역] - bottom-full을 통해 입력창 '바로 위'에 얹혀져 있습니다. */}
//               <div
//                 className={`absolute -left-[1px] -right-[1px] bottom-full bg-white rounded-t-2xl shadow-[0_-8px_20px_-5px_rgba(0,0,0,0.15)] transition-all duration-700 ease-in-out flex flex-col z-20 ${
//                   isCommentSheetOpen
//                     ? 'translate-y-0 opacity-100' // 열림: 제자리(입력창 위)에 나타남
//                     : 'translate-y-[calc(100%+20px)]' // 닫힘: 입력창 뒤쪽(밑)으로 완전히 슬라이드 다운되어 숨음
//                 }`}
//                 style={{ height: '60vh' }} // 댓글창의 전체 높이 조절
//               >
//                 {/* 바텀시트 헤더 */}
//                 <div className="flex justify-between items-center p-4 border-b">
//                   <div className="w-8"></div>
//                   <h3 className="font-semibold text-center flex-1">댓글</h3>
//                   <button
//                     onClick={() => setIsCommentSheetOpen(false)}
//                     className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
//                   >
//                     ✕
//                   </button>
//                 </div>

//                 {/* 댓글 목록 스크롤 영역 */}
//                 <div className="flex-1 overflow-y-auto p-4 space-y-4">
//                   <div className="text-center text-sm text-gray-500 mt-10">
//                     전체 댓글 목록이 여기에 렌더링 됩니다.
//                   </div>
//                   {/* 여기에 {comments.map(...)} 렌더링 */}
//                 </div>
//               </div>

//               {/* [댓글 입력창 영역] - 렌더링은 오직 여기서 한 번만! */}
//               {/* z-30을 주어 위에서 슬라이드 다운되어 내려오는 바텀시트를 자연스럽게 가려줍니다. */}
//               <div className="relative z-30 bg-white border-t px-4 p-2">
//                 <CommentInput />
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </DetailModal>
//   );
// }
// 'use client';
// import CommentInput from '@app/@modal/(.)product/[id]/_component/commentInput';
// import LikeComment from '@app/@modal/(.)product/[id]/_component/likeComment';
// import ModalImage from '@app/@modal/(.)product/[id]/_component/modalImage';
// import UserInfo from '@app/@modal/(.)product/[id]/_component/userInfo';
// import { getProduct } from '@app/product/[id]/_lib/getProduct';
// import DeleteSkeleton from '@components/DeleteSkeleton';
// import DetailModal from '@components/DetailModal';
// import LoadingSkeleton from '@components/LoadingSkeleton';
// import { useQuery } from '@tanstack/react-query';
// import { useParams } from 'next/navigation';
// import { useState } from 'react';

// export default function IntercetProductPage() {
//   const [isCommentSheetOpen, setIsCommentSheetOpen] = useState(false);
//   const { id } = useParams();
//   const productId = id.toString();

//   const { data } = useQuery({
//     queryKey: ['product', id],
//     queryFn: () => getProduct(productId)
//   });

//   return (
//     <DetailModal>
//       <div className="h-full relative flex flex-col overflow-hidden bg-white -m-4">
//         {data?.timeExpired === 'P' ? (
//           <div className="p-4">
//             <LoadingSkeleton />
//           </div>
//         ) : data?.timeExpired === 'F' ? (
//           <div className="p-4">
//             <DeleteSkeleton />
//           </div>
//         ) : (
//           <>
//             {/* 🌟 1. 메인 영역 (flex-1로 남은 공간만 꽉 채움, pb-24 제거!) */}
//             <div className="flex-1 overflow-y-auto p-4 flex flex-col">
//               <div className="shrink-0">
//                 <LikeComment productId={productId} />
//               </div>

//               {/* 이미지 영역이 너무 크면 유연하게 줄어들 수 있도록 설정 */}
//               <div className="flex-1 flex flex-col justify-center py-2 min-h-[150px]">
//                 <ModalImage productId={productId} />
//               </div>

//               {/* 이 부분(UserInfo + 버튼)이 이미지 때문에 밀려나지 않게 shrink-0 적용 */}
//               <div className="shrink-0 space-y-3 pt-2">
//                 <UserInfo productId={productId} />

//                 <div className="flex items-start space-x-2 text-sm">
//                   <span className="font-semibold text-gray-900">
//                     {data?.product?.userId}
//                   </span>
//                   <span className="line-clamp-1 text-gray-600">
//                     와이어프레임이랑 똑같이 구현됐네요! 너무 멋집니다 ✨
//                   </span>
//                 </div>

//                 <button
//                   onClick={() => setIsCommentSheetOpen(true)}
//                   className="w-full text-sm text-gray-400 font-medium pb-2"
//                 >
//                   댓글 15개 모두 보기
//                 </button>
//               </div>
//             </div>

//             {/* 딤(어두운) 배경 */}
//             <div
//               className={`absolute inset-0 bg-black/20 transition-opacity duration-500 z-10 ${
//                 isCommentSheetOpen
//                   ? 'opacity-100 pointer-events-auto'
//                   : 'opacity-0 pointer-events-none'
//               }`}
//               onClick={() => setIsCommentSheetOpen(false)}
//             />

//             {/* 🌟 2. 하단 댓글 입력창 (absolute 제거! 그냥 바닥에 쌓이게 둡니다) */}
//             <div className="relative shrink-0 w-full z-20 flex flex-col bg-white border-t px-4 py-2">
//               {/* 바텀시트는 입력창 '지붕(bottom-[100%])' 위로 올라옵니다 */}
//               <div
//                 className={`absolute -left-[1px] -right-[1px] bottom-[100%] bg-white rounded-t-2xl shadow-[0_-8px_20px_-5px_rgba(0,0,0,0.15)] transition-transform duration-500 ease-in-out flex flex-col overflow-hidden ${
//                   isCommentSheetOpen ? 'translate-y-0' : 'translate-y-[120%]'
//                 }`}
//                 style={{ height: '60vh' }}
//               >
//                 <div className="flex justify-between items-center p-4 border-b">
//                   <div className="w-8"></div>
//                   <h3 className="font-semibold text-center flex-1">댓글</h3>
//                   <button
//                     onClick={() => setIsCommentSheetOpen(false)}
//                     className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
//                   >
//                     ✕
//                   </button>
//                 </div>

//                 <div className="flex-1 overflow-y-auto p-4 space-y-4">
//                   <div className="text-center text-sm text-gray-500 mt-10">
//                     전체 댓글 목록이 여기에 렌더링 됩니다.
//                   </div>
//                 </div>
//               </div>

//               {/* 댓글 입력창 렌더링 */}
//               <CommentInput />
//             </div>
//           </>
//         )}
//       </div>
//     </DetailModal>
//   );
// }
// IntercetProductPage.tsx
'use client';
import CommentInput from '@app/@modal/(.)product/[id]/_component/commentInput';
import LikeComment from '@app/@modal/(.)product/[id]/_component/likeComment';
import ModalImage from '@app/@modal/(.)product/[id]/_component/modalImage';
import UserInfo from '@app/@modal/(.)product/[id]/_component/userInfo';
import { getProduct } from '@app/product/[id]/_lib/getProduct';
import DeleteSkeleton from '@components/DeleteSkeleton';
import DetailModal from '@components/DetailModal';
import LoadingSkeleton from '@components/LoadingSkeleton';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function IntercetProductPage() {
  const [isCommentSheetOpen, setIsCommentSheetOpen] = useState(false);
  const { id } = useParams();
  const productId = id.toString();

  const { data } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(productId)
  });

  return (
    <DetailModal>
      {/* 🌟 더 이상 -m-4 같은 꼼수를 쓸 필요가 없습니다. 깔끔하게 h-full 유지! */}
      <div className="h-full flex flex-col bg-white">
        {data?.timeExpired === 'P' ? (
          <div className="p-4">
            <LoadingSkeleton />
          </div>
        ) : data?.timeExpired === 'F' ? (
          <div className="p-4">
            <DeleteSkeleton />
          </div>
        ) : (
          <>
            <div className="relative flex-1 flex flex-col overflow-hidden bg-white">
              {/* 🌟 1. 본문 스크롤 영역: 여기에 p-4를 주어 기존 레이아웃 간격을 완벽히 복구합니다 */}
              <div className="flex-1 overflow-y-auto flex flex-col p-4 pb-0">
                <div className="shrink-0">
                  <LikeComment productId={productId} />
                </div>

                <div className="flex-1 flex flex-col justify-center py-2 min-h-[150px]">
                  <ModalImage productId={productId} />
                </div>

                <div className="shrink-0 space-y-3 pt-2 pb-4">
                  <UserInfo productId={productId} />
                  <div className="flex items-start space-x-2 text-sm">
                    <span className="font-semibold text-gray-900">
                      {data?.product?.userId}
                    </span>
                    <span className="line-clamp-1 text-gray-600">
                      와이어프레임이랑 똑같이 구현됐네요!
                    </span>
                  </div>
                  <button
                    onClick={() => setIsCommentSheetOpen(true)}
                    className="w-full text-sm text-gray-400 font-medium"
                  >
                    댓글 {data?.product.commentsCount}개 모두 보기
                  </button>
                </div>
              </div>

              {/* 🌟 2. 딤 배경: 부모(DetailModal)에 패딩이 없어졌으므로 모달 모서리 끝까지 완벽하게 덮습니다! */}
              <div
                className={`absolute inset-0 bg-black/20 transition-opacity duration-300 z-10 ${
                  isCommentSheetOpen
                    ? 'opacity-100 pointer-events-auto'
                    : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsCommentSheetOpen(false)}
              />

              {/* 바텀 시트 */}
              <div
                className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl transition-all duration-300 z-20 flex flex-col ${
                  isCommentSheetOpen
                    ? 'translate-y-0 shadow-[0_-8px_20px_-5px_rgba(0,0,0,0.15)]'
                    : 'translate-y-[110%] shadow-none'
                }`}
                style={{ height: '75%' }}
              >
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                  <div className="w-8"></div>
                  <h3 className="font-semibold text-center flex-1">댓글</h3>
                  <button
                    onClick={() => setIsCommentSheetOpen(false)}
                    className="w-8 h-8 flex justify-center items-center rounded-full hover:bg-gray-100"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div className="text-center text-sm text-gray-500 mt-10">
                    댓글 목록
                  </div>
                </div>
              </div>
            </div>

            {/* 🌟 3. 댓글 입력창: 위쪽 스크롤 영역과 동일하게 좌우에 px-4를 줍니다 */}
            <div className="shrink-0 bg-white border-t border-gray-100 px-4 py-3 z-30">
              <CommentInput />
            </div>
          </>
        )}
      </div>
    </DetailModal>
  );
}
