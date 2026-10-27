'use client';
import { Chat } from '@prisma/client';
import axios from 'axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { RiArrowDownSLine } from 'react-icons/ri';
import { ProductDetailType } from './ProductInfo';
import { timeForToday } from '@libs/client/timeForToday';
import { Spinner } from '@app/@modal/(.)product/[id]/page';

type ProductChatProps = {
  data: ProductDetailType | undefined;
  totalCount?: number;
};
export interface CommentWithUser extends Chat {
  user: { name: string; image?: string | null };
}
interface ChatResponse {
  ok: boolean;
  comments: CommentWithUser[];
}

function ProductChat({ data, totalCount }: ProductChatProps) {
  const [expanded, setExpanded] = useState(false);
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.5,
    skip: !expanded
  });
  const {
    data: chats,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useInfiniteQuery<ChatResponse>({
    queryKey: ['getChats', data?.product?.id],
    queryFn: ({ pageParam = 0 }) =>
      axios(`/api/chat/product/${data?.product?.id}?comment=${pageParam}`).then(
        (res) => res.data
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const lastComment = lastPage.comments.at(-1);
      return lastPage.comments.length === 3 ? lastComment?.id : undefined;
    },
    enabled: !!data?.product?.id
  });
  const comments = chats?.pages.flatMap((page) => page.comments) ?? [];
  const canExpand = (totalCount ?? comments.length) > 2;

  useEffect(() => {
    if (inView && expanded && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, expanded, fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <section className="product-chat">
      <div className="product-comments-heading">
        <h2>
          작품 이야기{' '}
          <span>{(totalCount ?? comments.length).toLocaleString('ko-KR')}</span>
        </h2>
        {canExpand && (
          <button
            className="comments-toggle"
            type="button"
            aria-label={expanded ? '댓글 접기' : '댓글 더 보기'}
            aria-expanded={expanded}
            aria-controls="product-comments-list"
            onClick={() => setExpanded((current) => !current)}
          >
            <span className="comments-toggle-label">
              {expanded ? '접기' : '더보기'}
            </span>
            <RiArrowDownSLine aria-hidden="true" />
          </button>
        )}
      </div>

      <div
        className="product-comments-list"
        id="product-comments-list"
        aria-live="polite"
      >
        {status === 'pending' ? (
          <div
            className="product-comments-initial-loading"
            role="status"
            aria-label="댓글을 불러오는 중"
          >
            <Spinner />
          </div>
        ) : (
          <>
            {comments.map((comment, index) => (
              <article
                className="product-comment"
                data-testid="chat"
                key={comment.id}
                hidden={!expanded && index > 1}
              >
                <span className="product-comment-avatar" aria-hidden="true">
                  {comment.user?.image ? (
                    <img src={comment.user.image} alt="" />
                  ) : (
                    comment.user?.name?.slice(0, 1) || '🙂'
                  )}
                </span>
                <div className="product-comment-copy">
                  <div className="product-comment-author">
                    {comment.user?.name}
                  </div>
                  <p>{comment.description}</p>
                  <small>{timeForToday(new Date(comment.createdAt))}</small>
                </div>
              </article>
            ))}
            {comments.length === 0 && (
              <p className="product-comments-empty">첫 댓글을 남겨보세요.</p>
            )}
          </>
        )}

        <div
          ref={inViewRef}
          className={`product-comments-sentinel${isFetchingNextPage ? ' is-loading' : ''}`}
          role={isFetchingNextPage ? 'status' : undefined}
          aria-label={isFetchingNextPage ? '댓글을 불러오는 중' : undefined}
        >
          {isFetchingNextPage && <Spinner />}
        </div>
      </div>
    </section>
  );
}

export default ProductChat;
