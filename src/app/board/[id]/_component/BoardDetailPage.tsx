'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

const formatDate = (value: string) =>
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
  const { data: boardData, isLoading } = useQuery<BoardDetailResponse>({
    queryKey: ['board-detail', boardId],
    queryFn: () => getFetch(`/api/board/${boardId}`),
    enabled: Boolean(boardId)
  });
  const { data: commentsData } = useQuery<CommentResponse>({
    queryKey: ['board-comments', boardId],
    queryFn: () => getFetch(`/api/chat/board/${boardId}`),
    enabled: Boolean(boardId)
  });
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

  const board = boardData?.board;
  const comments = commentsData?.comments ?? [];
  const images = board?.images ?? [];
  const tags = board?.boardTag?.hashtag
    ? board.boardTag.hashtag
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];
  const { color, name } = getCategoryData(board?.category!);

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
                className={`mb-3 inline-flex rounded-md px-2.5 py-1 text-[10px] font-bold ${color}`}
              >
                {name}
              </span>
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
                  <MessageCircle size={12} /> {comments.length}
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
                  <div className="mb-3 flex items-center justify-between text-xs">
                    <strong className="text-slate-700">사진</strong>
                    <span className="text-[10px] text-slate-400">
                      {images.length}장
                    </span>
                  </div>
                  <div className="relative">
                    <button
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
                    </button>
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
                    <button
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
                    </button>
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
              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-indigo-100 px-3.5 text-[11px] text-indigo-600 transition hover:bg-indigo-50"
                >
                  <Heart size={14} /> 좋아요 {board.likeCount}
                </button>
                <button
                  type="button"
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-200 px-3.5 text-[11px] text-slate-600 transition hover:bg-slate-50"
                >
                  <Share2 size={14} /> 공유하기
                </button>
                <button
                  type="button"
                  aria-label="더보기"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </article>

            <section className="mt-[42px] rounded-[18px] border border-slate-200 bg-white px-5 py-7 sm:px-[30px] sm:py-[27px]">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-[17px] font-extrabold text-slate-800">
                  댓글 {comments.length}
                </h2>
                <button type="button" className="text-[10px] text-slate-400">
                  최신순⌄
                </button>
              </div>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  if (comment.trim()) createComment.mutate(comment.trim());
                }}
                className="mb-6 flex gap-3"
              >
                <span className={`${avatarClass} h-9 w-9 text-xs`}>나</span>
                <div className="relative flex-1">
                  <textarea
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    placeholder="댓글을 입력하세요."
                    className="h-[69px] w-full resize-none rounded-[11px] border border-slate-200 p-3 pr-24 text-xs outline-none transition focus:border-indigo-300"
                  />
                  <button
                    type="submit"
                    disabled={!comment.trim() || createComment.isPending}
                    className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-indigo-600 px-3 py-1.5 text-[10px] font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    <Send size={11} /> 댓글 작성
                  </button>
                </div>
              </form>
              {comments.map((item) => (
                <article
                  key={item.id}
                  className="flex gap-3 border-t border-slate-100 py-[18px]"
                >
                  <span className={`${avatarClass} h-9 w-9 text-xs`}>
                    {item.user.name?.slice(0, 1) ?? 'U'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-extrabold text-slate-700">
                      {item.user.name || '익명'}{' '}
                      <span className="ml-2 text-[9px] font-normal text-slate-400">
                        {formatDate(item.createdAt)}
                      </span>
                    </p>
                    <div
                      className="mt-1.5 text-[11px] leading-relaxed text-slate-500"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(item.description)
                      }}
                    />
                  </div>
                </article>
              ))}
            </section>
          </div>

          <aside className="space-y-4">
            <section className="rounded-[18px] border border-slate-200 bg-white p-5">
              <h2 className="mb-4 text-sm font-extrabold text-slate-800">
                작성자 정보
              </h2>
              <div className="flex items-center gap-3">
                <span className={`${avatarClass} h-[51px] w-[51px] text-lg`}>
                  {authorName.slice(0, 1)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-extrabold text-slate-700">
                    {authorName}
                  </p>
                  <p className="mt-1 text-[9px] text-slate-400">크리에이터</p>
                  <p className="mt-1 text-[9px] text-slate-400">
                    게시글을 공유하는 멤버
                  </p>
                </div>
                {currentUser?.user?.id === board.userId ? (
                  <Link
                    href={`/board/${board.id}/setting`}
                    className="shrink-0 rounded-full border border-indigo-300 px-2.5 py-1.5 text-[9px] font-bold text-indigo-600"
                  >
                    수정
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="shrink-0 rounded-full border border-indigo-300 px-2.5 py-1.5 text-[9px] font-bold text-indigo-600"
                  >
                    + 팔로우
                  </button>
                )}
              </div>
            </section>
            {tags.length > 0 && (
              <section className="rounded-[18px] border border-slate-200 bg-white p-5">
                <h2 className="mb-4 text-sm font-extrabold text-slate-800">
                  이런 게시글은 어때요?
                </h2>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-2.5 py-1.5 text-[10px] text-slate-500"
                    >
                      #{tag.replace(/^#/, '')}
                    </span>
                  ))}
                </div>
              </section>
            )}
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
