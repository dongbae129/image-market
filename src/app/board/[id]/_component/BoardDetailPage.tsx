'use client';

import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import sanitizeHtml from 'sanitize-html';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
  Share2,
  X
} from 'lucide-react';
import { getFetch, newAxios } from '@libs/client/fetcher';
import Image from 'next/image';
import { getCategoryData } from '@app/board/_lib/utils';
import axios from 'axios';
import { useInView } from 'react-intersection-observer';
import UserInfocard from '@app/board/[id]/_component/UserInfocard';
import BoardTags from '@app/board/[id]/_component/BoardTags';
import BoardCommentItem from '@app/board/[id]/_component/BoardCommentItem';
import { BoardChat } from '@prisma/client';
import BoardMainNav from '@app/board/[id]/_component/BoardMainNav';
import BoardCommentForm from '@app/board/[id]/_component/BoardCommentForm';

type BoardImage = { id: number; image: string; dominantColor: string | null };
type BoardDetailResponse = {
  ok: boolean;
  board?: {
    id: number;
    title: string;
    description: string;
    category: string;
    createdAt: string;
    viewCount: number;
    likeCount: number;
    userId: number;
    user: {
      id: number;
      name: string | null;
      email: string;
      image: string | null;
    };
    boardHit: { hit: number } | null;
    boardTag: { hashtag: string } | null;
    images: BoardImage[];
  };
};
type BoardCommentResponse = BoardChat & {
  user: {
    image: string;
    name: string;
  };
};

type CommentResponse = {
  ok: boolean;
  comments: Array<{
    id: number;
    description: string;
    createdAt: string;
    user: { name: string | null; image: string | null };
  }>;
};
type UserResponse = { ok: boolean; user?: { id: number } };
type Props = { boardId: string };

const avatarClass =
  'flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-300 font-bold text-slate-600';

const getImageSrc = (image: string) =>
  image.startsWith('http') || image.startsWith('/') ? image : `/474x/${image}`;

export const formatDate = (value: Date | string) =>
  new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date(value));

export default function BoardDetailPage({ boardId }: Props) {
  const queryClient = useQueryClient();
  const thumbnailRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const { ref: inViewRef, inView } = useInView({ threshold: 0.5 });
  const { data: boardData, isLoading } = useQuery<BoardDetailResponse>({
    queryKey: ['board-detail', boardId],
    queryFn: async () => (await axios(`/api/board/${boardId}`)).data,
    enabled: !!boardId,
    staleTime: 1000 * 60
  });
  // const { data: commentsData } = useQuery<CommentResponse>({
  //   queryKey: ['board-comments', boardId],
  //   queryFn: () => getFetch(`/api/chat/board/${boardId}?comment=0`),
  //   enabled: !!boardId
  // });
  const getBoardComments = async ({ pageParam = 0 }: { pageParam: number }) => {
    try {
      const res = await axios(
        `/api/chat/board/${boardId}?comment=${pageParam}`
      );
      return res.data;
    } catch (error) {
      console.error(error);
      throw new Error('comment test fail');
    }
  };
  const {
    data: commentsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useInfiniteQuery({
    queryKey: ['board-comments', boardId],
    queryFn: getBoardComments,
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
  const { data: currentUser } = useQuery<UserResponse>({
    queryKey: ['userInfo'],
    queryFn: () => getFetch('/api/user')
  });
  const createComment = useMutation({
    mutationFn: (chat: string) =>
      newAxios
        .post(`/api/chat/board/${boardId}`, { chat })
        .then((res) => res.data),
    onSuccess: () => {
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['board-comments', boardId] });
    }
  });
  console.log(boardData, 'boardData');

  const board = boardData?.board;

  const images = board?.images ?? [];
  const tags = board?.boardTag?.hashtag
    ? board.boardTag.hashtag
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];
  // const { color, name } = getCategoryData(board?.category as string);

  useEffect(() => {
    if (selectedImage === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedImage(null);
      if (event.key === 'ArrowLeft')
        setSelectedImage((index) =>
          index === null ? null : (index - 1 + images.length) % images.length
        );
      if (event.key === 'ArrowRight')
        setSelectedImage((index) =>
          index === null ? null : (index + 1) % images.length
        );
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedImage, images.length]);

  if (isLoading) return <main className="min-h-screen bg-[#f7f8fa]" />;
  if (!board)
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8fa] text-sm text-slate-500">
        게시글을 찾을 수 없습니다.
      </main>
    );

  const moveImage = (direction: number) =>
    setSelectedImage((index) =>
      index === null
        ? null
        : (index + direction + images.length) % images.length
    );
  const authorName = board.user.name || board.user.email;
  const boardUserTrue = currentUser?.user?.id === board.userId;
  return (
    <main className="min-h-screen bg-[#f7f8fa] pb-20 text-slate-800">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 lg:px-0">
        <nav className="mb-4 text-[11px] font-medium text-slate-400">
          <Link href="/board" className="transition hover:text-slate-700">
            BOARD
          </Link>
          <span className="mx-2 text-slate-300">›</span> 게시글 상세
        </nav>
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,820px)_300px]">
          <div>
            <header className="rounded-[18px] border border-slate-200 bg-white px-5 py-6 sm:px-[30px] sm:py-[27px]">
              <span
                className={`mb-3 inline-flex rounded-md px-2.5 py-1 text-[10px] font-bold `}
              ></span>
              <h1 className="text-2xl font-extrabold leading-snug tracking-[-0.7px] text-slate-900 sm:text-[27px]">
                {board.title}
              </h1>
              <div className="mt-5 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                <span className={`${avatarClass} h-7 w-7 text-[10px]`}>
                  {authorName.slice(0, 1)}
                </span>
                <span className="font-bold text-slate-700">{authorName}</span>
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[8px] font-bold text-slate-500">
                  PRO
                </span>
                <span className="text-slate-300">·</span>
                <span>{formatDate(board.createdAt)}</span>
                <span className="text-slate-300">·</span>
                <span className="inline-flex items-center gap-1">
                  <Eye size={12} /> {board.boardHit?.hit ?? board.viewCount}
                </span>
                <span className="text-slate-300">·</span>
                <span className="inline-flex items-center gap-1">
                  {/* <MessageCircle size={12} /> {commentsData.length} */}
                </span>
              </div>
            </header>

            <article className="mt-[18px] rounded-[18px] border border-slate-200 bg-white px-5 py-7 sm:px-[30px] sm:py-8">
              <div
                className="board-content text-sm leading-8 text-slate-600"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(board.description)
                }}
              />
              {images.length > 0 && (
                <section className="mt-7 border-t border-slate-100 pt-6">
                  {/* <div className="mb-3 flex items-center justify-between text-xs">
                    <strong className="text-slate-700">사진</strong>
                    <span className="text-[10px] text-slate-400">
                      {images.length}장
                    </span>
                  </div> */}
                  <div className="relative">
                    {/* <button
                      type="button"
                      aria-label="이전 사진"
                      onClick={() =>
                        thumbnailRef.current?.scrollBy({
                          left: -370,
                          behavior: 'smooth'
                        })
                      }
                      className="absolute left-[-8px] top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-600 shadow-sm"
                    >
                      <ChevronLeft size={17} />
                    </button> */}
                    <div
                      ref={thumbnailRef}
                      className="no-scrollbar flex gap-2.5 overflow-x-auto px-0.5 pb-1"
                    >
                      {images.map((image, index) => (
                        <button
                          key={image.id}
                          type="button"
                          onClick={() => setSelectedImage(index)}
                          className="relative h-28 w-28 shrink-0 overflow-hidden rounded-[10px] bg-slate-100"
                        >
                          <Image
                            src={`474x/${image.image}`}
                            alt={`게시글 사진 ${index + 1}`}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px"
                            // className="h-full w-full object-cover transition duration-200 hover:scale-105"
                          />
                        </button>
                      ))}
                    </div>
                    {/* <button
                      type="button"
                      aria-label="다음 사진"
                      onClick={() =>
                        thumbnailRef.current?.scrollBy({
                          left: 370,
                          behavior: 'smooth'
                        })
                      }
                      className="absolute right-[-8px] top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-600 shadow-sm"
                    >
                      <ChevronRight size={17} />
                    </button> */}
                  </div>
                </section>
              )}
              {tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-2.5 py-1.5 text-[10px] text-slate-500"
                    >
                      #{tag.replace(/^#/, '')}
                    </span>
                  ))}
                </div>
              )}
              <BoardMainNav likeCount={board.likeCount} />
            </article>

            <section className="mt-[42px] rounded-[18px] border border-slate-200 bg-white px-5 py-7 sm:px-[30px] sm:py-[27px]">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-[17px] font-extrabold text-slate-800">
                  댓글 몇개
                </h2>
                <button type="button" className="text-[10px] text-slate-400">
                  최신순⌄
                </button>
              </div>
              <BoardCommentForm
                avatarClass={avatarClass}
                boardId={boardId}
                comment={comment}
                setComment={setComment}
              />
              <div>
                {commentsData?.pages.map((page, index) => (
                  <React.Fragment key={index}>
                    {page.comments.map((item: BoardCommentResponse) => (
                      <BoardCommentItem
                        item={item}
                        avatarClass={avatarClass}
                        key={item.id}
                      />
                    ))}
                  </React.Fragment>
                ))}
                <div
                  ref={inViewRef}
                  className="h-14 w-full flex justify-center items-center shrink-0"
                >
                  {isFetchingNextPage && <Spinner />}
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <UserInfocard
              authorName={authorName}
              boardId={board.id}
              avatarClass={avatarClass}
              boardUserTrue={boardUserTrue}
            />
            <BoardTags tags={tags} />
          </aside>
        </div>
      </div>
      {selectedImage !== null && images[selectedImage] && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            aria-label="닫기"
            onClick={() => setSelectedImage(null)}
            className="absolute right-6 top-6 rounded-full bg-white/15 p-3 text-white hover:bg-white/25"
          >
            <X size={22} />
          </button>
          <button
            type="button"
            aria-label="이전 이미지"
            onClick={(event) => {
              event.stopPropagation();
              moveImage(-1);
            }}
            className="absolute left-4 rounded-full bg-white/15 p-3 text-white hover:bg-white/25 sm:left-7"
          >
            <ChevronLeft size={28} />
          </button>
          <img
            src={`https://d18ktmttqdka9f.cloudfront.net/736x/${images[selectedImage].image}`}
            alt={`게시글 사진 ${selectedImage + 1}`}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[84vh] max-w-[84vw] rounded-md object-contain"
          />
          <button
            type="button"
            aria-label="다음 이미지"
            onClick={(event) => {
              event.stopPropagation();
              moveImage(1);
            }}
            className="absolute right-4 rounded-full bg-white/15 p-3 text-white hover:bg-white/25 sm:right-7"
          >
            <ChevronRight size={28} />
          </button>
          <span className="absolute bottom-7 rounded-full bg-black/30 px-3 py-1 text-xs text-white">
            {selectedImage + 1} / {images.length}
          </span>
        </div>
      )}
    </main>
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
