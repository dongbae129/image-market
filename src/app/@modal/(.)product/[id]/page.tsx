// 'use client';
// import CommentInput from '@app/@modal/(.)product/[id]/_component/commentInput';
// import CommentItem, {
//   CommentType
// } from '@app/@modal/(.)product/[id]/_component/commentItem';
// import LikeComment from '@app/@modal/(.)product/[id]/_component/likeComment';
// import ModalImage from '@app/@modal/(.)product/[id]/_component/modalImage';
// import UserInfo from '@app/@modal/(.)product/[id]/_component/userInfo';
// import { getProduct } from '@app/product/[id]/_lib/getProduct';
// import DeleteSkeleton from '@components/DeleteSkeleton';
// import DetailModal from '@components/DetailModal';
// import LoadingSkeleton from '@components/LoadingSkeleton';
// import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import { User } from 'lucide-react';
// import { useParams } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { useInView } from 'react-intersection-observer';

// export default function IntercetProductPage() {
//   const [isCommentSheetOpen, setIsCommentSheetOpen] = useState(false);
//   const { id } = useParams();
//   const productId = id.toString();
//   const { ref: inViewRef, inView } = useInView({ threshold: 0.5 });
//   const { data } = useQuery({
//     queryKey: ['product', id],
//     queryFn: () => getProduct(productId)
//   });
//   const getProductComments = async ({
//     pageParam = 0
//   }: {
//     pageParam: number;
//   }) => {
//     try {
//       const res = await axios(
//         `/api/chat/product/${Number(id)}?comment=${pageParam}`
//       );
//       return res.data;
//     } catch (error) {
//       console.error(error);
//       throw new Error('comment test fail');
//     }
//   };
//   const {
//     data: comments,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     status
//   } = useInfiniteQuery({
//     queryKey: ['getProductComments'],
//     queryFn: getProductComments,
//     initialPageParam: 0,
//     getNextPageParam: (lastPage) => {
//       const lastPageLength = lastPage?.comments.length;
//       if (lastPageLength === 0 || lastPageLength < 3) return undefined;
//       return lastPageLength >= 3 && lastPage.comments[lastPageLength - 1].id;
//     }
//   });
//   useEffect(() => {
//     if (inView && hasNextPage && !isFetchingNextPage) {
//       fetchNextPage();
//     }
//   }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);
//   return (
//     <DetailModal>
//       <div className="h-full flex flex-col bg-white">
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
//             <div className="relative flex-1 flex flex-col overflow-hidden bg-white">
//               <div className="flex-1 overflow-y-auto flex flex-col p-4 pb-0">
//                 <UserInfo productId={productId} />

//                 <div className="flex-1 flex flex-col justify-center py-2 min-h-[150px]">
//                   <ModalImage productId={productId} />
//                 </div>

//                 <div className="shrink-0 space-y-3 pt-2 pb-4">
//                   <div className="shrink-0">
//                     <LikeComment productId={productId} />
//                   </div>

//                   {comments?.pages[0].comments[0] && (
//                     <CommentItem comment={comments?.pages[0].comments[0]} />
//                   )}

//                   <button
//                     onClick={() => setIsCommentSheetOpen(true)}
//                     className="w-full text-sm text-gray-400 font-medium"
//                   >
//                     댓글 {data?.product.commentsCount}개 모두 보기
//                   </button>
//                 </div>
//               </div>
//               <div
//                 className={`absolute inset-0 bg-black/20 transition-opacity duration-300 z-10 ${
//                   isCommentSheetOpen
//                     ? 'opacity-100 pointer-events-auto'
//                     : 'opacity-0 pointer-events-none'
//                 }`}
//                 onClick={() => setIsCommentSheetOpen(false)}
//               />

//               {/* 바텀 시트 */}
//               <div
//                 className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl transition-all duration-300 z-20 flex flex-col ${
//                   isCommentSheetOpen
//                     ? 'translate-y-0 shadow-[0_-8px_20px_-5px_rgba(0,0,0,0.15)]'
//                     : 'translate-y-[110%] shadow-none'
//                 }`}
//                 style={{ height: '75%' }}
//               >
//                 <div className="flex justify-between items-center p-4 border-b border-gray-100">
//                   <div className="w-8"></div>
//                   <h3 className="font-semibold text-center flex-1">댓글</h3>
//                   <button
//                     onClick={() => setIsCommentSheetOpen(false)}
//                     className="w-8 h-8 flex justify-center items-center rounded-full hover:bg-gray-100"
//                   >
//                     ✕
//                   </button>
//                 </div>
//                 <div className="flex-1 overflow-y-auto p-4 space-y-4">
//                   <div className="text-center text-sm text-gray-500 mt-10">
//                     {comments?.pages.map((page, index) => (
//                       <div key={index}>
//                         {page.comments.map((item) => (
//                           <div key={item.id}>
//                             <CommentItem comment={item} />
//                           </div>
//                         ))}
//                       </div>
//                     ))}
//                   </div>
//                   <div ref={inViewRef} className="h-10 w-full" />
//                   {isFetchingNextPage && (
//                     <p className="text-center py-4 text-gray-400 text-sm">
//                       Loading more...
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* 🌟 3. 댓글 입력창: 위쪽 스크롤 영역과 동일하게 좌우에 px-4를 줍니다 */}
//             <div className="shrink-0 bg-white border-t border-gray-100 px-4 py-3 z-30">
//               <CommentInput />
//             </div>
//           </>
//         )}
//       </div>
//     </DetailModal>
//   );
// }
'use client';
import CommentInput from '@app/@modal/(.)product/[id]/_component/commentInput';
import CommentItem, {
  CommentType
} from '@app/@modal/(.)product/[id]/_component/commentItem';
import LikeComment from '@app/@modal/(.)product/[id]/_component/likeComment';
import ModalImage from '@app/@modal/(.)product/[id]/_component/modalImage';
import UserInfo from '@app/@modal/(.)product/[id]/_component/userInfo';
import { getProduct } from '@app/product/[id]/_lib/getProduct';
import DeleteSkeleton from '@components/DeleteSkeleton';
import DetailModal from '@components/DetailModal';
import LoadingSkeleton from '@components/LoadingSkeleton';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { User } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

export default function IntercetProductPage() {
  const [isCommentSheetOpen, setIsCommentSheetOpen] = useState(false);
  const { id } = useParams();
  const productId = id.toString();
  const { ref: inViewRef, inView } = useInView({ threshold: 0.5 });

  const { data } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(productId)
  });

  const getProductComments = async ({
    pageParam = 0
  }: {
    pageParam: number;
  }) => {
    try {
      const res = await axios(
        `/api/chat/product/${Number(id)}?comment=${pageParam}`
      );
      return res.data;
    } catch (error) {
      console.error(error);
      throw new Error('comment test fail');
    }
  };

  const {
    data: comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useInfiniteQuery({
    queryKey: ['getProductComments', id],
    queryFn: getProductComments,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const lastPageLength = lastPage?.comments.length;
      if (lastPageLength === 0 || lastPageLength < 3) return undefined;
      return lastPageLength >= 3 && lastPage.comments[lastPageLength - 1].id;
    }
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 첫 번째 대표 댓글 추출
  const firstComment = comments?.pages[0]?.comments[0];

  return (
    <DetailModal>
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
              <div className="flex-1 flex flex-col p-4 pb-0 overflow-hidden">
                {/* 상단: 유저 정보 */}
                <div className="shrink-0 pb-2">
                  <UserInfo productId={productId} />
                </div>

                {/* 🌟 주인공인 이미지 영역 (최대 공간 확보) */}
                <div className="flex-1 min-h-0 py-1">
                  <ModalImage productId={productId} />
                </div>

                {/* 하단: 액션 버튼 및 댓글 요약 */}
                <div className="shrink-0 flex flex-col pt-2 pb-3 space-y-2">
                  {/* 좋아요, 댓글 아이콘 */}
                  <LikeComment productId={productId} />

                  {/* 🌟 1줄 컴팩트 댓글 미리보기 (공간 낭비 최소화: 높이 딱 20px로 고정) */}
                  {/* <div className="h-[20px] flex items-center text-sm w-full">
                    {status === 'pending' ? (
                      // 로딩 중: 흐릿한 스켈레톤 바 표시
                      <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
                    ) : firstComment ? (
                      // 댓글 있음: 아이디 + 내용 1줄로 표시 (truncate로 넘치면 ... 처리)
                      <div className="flex items-center space-x-2 w-full overflow-hidden">
                        <span className="font-semibold text-gray-900 shrink-0">
                          {firstComment.user.name}
                        </span>
                        <span className="truncate text-gray-600">
                          {firstComment.description}
                        </span>
                      </div>
                    ) : (
                      // 댓글 없음: 안내 문구
                      <span className="text-gray-400">
                        첫 댓글을 남겨보세요.
                      </span>
                    )}
                  </div> */}
                  {/* 🌟 1줄 컴팩트 댓글 미리보기 (유저 이미지 추가 + 말줄임표 완벽 적용) */}
                  <div className="flex items-center text-sm w-full min-h-[24px]">
                    {status === 'pending' ? (
                      // 로딩 중: 둥근 프로필 스켈레톤 + 텍스트 바 스켈레톤
                      <div className="flex items-center space-x-2 w-full">
                        <div className="w-6 h-6 bg-gray-100 rounded-full animate-pulse shrink-0" />
                        <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
                      </div>
                    ) : firstComment ? (
                      // 🌟 핵심: min-w-0을 줘야 자식 요소의 truncate(말줄임)가 정상 작동합니다.
                      <div className="flex items-center space-x-2 w-full min-w-0">
                        {/* 1. 유저 미니 이미지 (크기 딱 맞게 24px로 축소) */}
                        <div className="w-6 h-6 rounded-full bg-gray-200 shrink-0 overflow-hidden flex items-center justify-center">
                          {firstComment.user.image ? (
                            <img
                              src={firstComment.user.image}
                              alt={firstComment.user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User size={12} className="text-gray-400" />
                          )}
                        </div>

                        {/* 2. 유저 이름 + 댓글 내용 (한 줄로 배치) */}
                        <div className="flex items-center space-x-1.5 flex-1 min-w-0">
                          <span className="font-semibold text-gray-900 shrink-0">
                            {firstComment.user.name}
                          </span>

                          {/* 🌟 텍스트 말줄임표(...) 적용: truncate 속성 */}
                          <span className="truncate text-gray-600 flex-1">
                            {firstComment.description}
                          </span>
                        </div>
                      </div>
                    ) : (
                      // 댓글 없음
                      <div className="text-gray-400 w-full text-center">
                        첫 댓글을 남겨보세요.
                      </div>
                    )}
                  </div>

                  {/* 모두 보기 버튼 */}
                  {firstComment && (
                    <button
                      onClick={() => setIsCommentSheetOpen(true)}
                      className="w-full text-sm text-gray-400 font-medium"
                    >
                      댓글 {data?.product.commentsCount || 0}개 모두 보기
                    </button>
                  )}
                </div>
              </div>

              {/* 딤 배경 */}
              <div
                className={`absolute inset-0 bg-black/20 transition-opacity duration-300 z-10 ${
                  isCommentSheetOpen
                    ? 'opacity-100 pointer-events-auto'
                    : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsCommentSheetOpen(false)}
              />

              {/* 바텀 시트 (여기에 전체 CommentItem이 렌더링됨) */}
              <div
                className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl transition-all duration-300 z-20 flex flex-col ${
                  isCommentSheetOpen
                    ? 'translate-y-0 shadow-[0_-8px_20px_-5px_rgba(0,0,0,0.15)]'
                    : 'translate-y-[110%] shadow-none'
                }`}
                style={{ height: '75%' }}
              >
                <div className="flex justify-between items-center p-4 border-b border-gray-100 shrink-0">
                  <div className="w-8"></div>
                  <h3 className="font-semibold text-center flex-1">댓글</h3>
                  <button
                    onClick={() => setIsCommentSheetOpen(false)}
                    className="w-8 h-8 flex justify-center items-center rounded-full hover:bg-gray-100"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col">
                  {status === 'pending' ? (
                    <div className="flex-1 flex justify-center items-center">
                      <Spinner />
                    </div>
                  ) : (
                    <>
                      {comments?.pages.map((page, index) => (
                        <React.Fragment key={index}>
                          {page.comments.map((item: CommentType) => (
                            <CommentItem key={item.id} comment={item} />
                          ))}
                        </React.Fragment>
                      ))}

                      <div
                        ref={inViewRef}
                        className="h-14 w-full flex justify-center items-center shrink-0"
                      >
                        {isFetchingNextPage && <Spinner />}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 하단 입력창 */}
            <div className="shrink-0 bg-white border-t border-gray-100 px-4 py-3 z-30">
              <CommentInput />
            </div>
          </>
        )}
      </div>
    </DetailModal>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-6 w-6 text-gray-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}
