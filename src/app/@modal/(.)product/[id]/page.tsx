'use client';
import CommentInput from '@app/@modal/(.)product/[id]/_component/commentInput';
import CommentItem, {
  CommentType
} from '@app/@modal/(.)product/[id]/_component/commentItem';
import FirstComment from '@app/@modal/(.)product/[id]/_component/firstComment';
import FirstCommentSkeleton from '@app/@modal/(.)product/[id]/_component/firstCommentSkeleton';
import LikeComment from '@app/@modal/(.)product/[id]/_component/likeComment';
import ModalImage from '@app/@modal/(.)product/[id]/_component/modalImage';
import MoreCommentButton from '@app/@modal/(.)product/[id]/_component/moreCommentButton';
import UserInfo from '@app/@modal/(.)product/[id]/_component/userInfo';
import { getProduct } from '@app/product/[id]/_lib/getProduct';
import DeleteSkeleton from '@components/DeleteSkeleton';
import DetailModal from '@components/DetailModal';
import LoadingSkeleton from '@components/LoadingSkeleton';
import { privateApi } from '@libs/client/axiosIntercepotr';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

export default function IntercetProductPage() {
  const [isCommentSheetOpen, setIsCommentSheetOpen] = useState(false);
  const { id } = useParams();
  const productId = id.toString();
  const { ref: inViewRef, inView } = useInView({ threshold: 0.5 });

  const { data } = useQuery({
    queryKey: ['product', +id],
    queryFn: () => getProduct(productId)
  });
  const { data: userInfo } = useQuery({
    queryKey: ['userInfo'],
    queryFn: async () => {
      const res = await privateApi.get('/api/user');
      return res.data;
    },
    staleTime: Infinity,
    retry: false
  });
  console.log(userInfo, 'modal userinfo cache');
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
  const morComment = data?.product && data.product.commentsCount > 1;

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

                <div className="flex-1 min-h-0 py-1">
                  <ModalImage productId={productId} />
                </div>

                <LikeComment productId={productId} />
                <div className="shrink-0 flex flex-col pt-2 pb-2 min-h-[71px]">
                  <div className="w-full h-full flex items-center text-sm overflow-hidden">
                    {!morComment ? (
                      <div className="w-full h-full flex justify-center items-center text-gray-400">
                        첫 댓글을 남겨보세요.
                      </div>
                    ) : status === 'pending' ? (
                      // [상태 1] 로딩 중
                      <FirstCommentSkeleton />
                    ) : (
                      // [상태 2] 댓글 있음
                      <div className="w-full">
                        <FirstComment firstComment={firstComment} />
                        <MoreCommentButton
                          setIsCommentSheetOpen={setIsCommentSheetOpen}
                          commentCount={data?.product.commentsCount || 0}
                        />
                      </div>
                    )}
                  </div>
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
            <div
              className="shrink-0 bg-white border-t border-gray-100 px-4 py-3 z-30"
              onFocus={() => setIsCommentSheetOpen(true)}
            >
              <CommentInput productId={productId} userInfo={userInfo} />
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
