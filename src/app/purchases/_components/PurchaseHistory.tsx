'use client';

import { privateApi } from '@libs/client/axiosIntercepotr';
import { useInfiniteQuery } from '@tanstack/react-query';
import Image from 'next/image';
import axios from 'axios';
import { useState } from 'react';

type Purchase = {
  id: number;
  productId: number;
  productVersionId: number;
  version: number;
  title: string;
  paymentType: 'COIN' | 'BONUS_COUPON';
  amountPaid: number;
  purchasedAt: string;
  preview: string;
  canDownload: boolean;
};

type PurchasePage = { purchases: Purchase[]; nextCursor: number | null };

export default function PurchaseHistory() {
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['product-purchases'],
    queryFn: async ({ pageParam }) => {
      const { data: response } = await privateApi.get<PurchasePage>(
        `/api/product/purchases${pageParam ? `?cursor=${pageParam}` : ''}`
      );
      return response;
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined
  });

  const download = async (purchase: Purchase) => {
    setDownloadingId(purchase.id);
    try {
      const { data: response } = await privateApi.get<{ url?: string }>(
        `/api/product/${purchase.productId}/download?productVersionId=${purchase.productVersionId}`
      );
      if (!response.url) throw new Error('Download URL is missing');
      window.location.assign(response.url);
    } catch (error) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      window.alert(message ?? '다운로드 링크를 만들지 못했습니다.');
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) return <p className="mt-8 text-slate-500">불러오는 중...</p>;
  if (isError) {
    return (
      <p className="mt-8 text-slate-600">
        로그인 후 구매 내역을 확인할 수 있습니다.
      </p>
    );
  }

  const purchases = data?.pages.flatMap((page) => page.purchases) ?? [];
  if (!purchases.length) {
    return <p className="mt-8 text-slate-500">구매한 Pro 이미지가 없습니다.</p>;
  }

  return (
    <div className="mt-8 space-y-3">
      {purchases.map((purchase) => (
        <article
          key={purchase.id}
          className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4"
        >
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
            {purchase.canDownload ? (
              <Image
                src={purchase.preview}
                alt={purchase.title}
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center px-2 text-center text-xs text-slate-400">
                이용 불가
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h2 className="truncate font-semibold text-slate-900">
              {purchase.title}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Pro 버전 {purchase.version} ·{' '}
              {purchase.paymentType === 'COIN'
                ? `코인 ${purchase.amountPaid}개`
                : `보너스 쿠폰 ${purchase.amountPaid}장`}
              {' · '}
              {new Date(purchase.purchasedAt).toLocaleDateString('ko-KR')}
            </p>
          </div>
          {purchase.canDownload ? (
            <button
              className="shrink-0 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              disabled={downloadingId === purchase.id}
              onClick={() => void download(purchase)}
            >
              {downloadingId === purchase.id ? '준비 중...' : '원본 다운로드'}
            </button>
          ) : (
            <span className="shrink-0 text-sm text-slate-400">
              다운로드 불가
            </span>
          )}
        </article>
      ))}
      {hasNextPage && (
        <button
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 disabled:opacity-50"
          disabled={isFetchingNextPage}
          onClick={() => void fetchNextPage()}
        >
          {isFetchingNextPage ? '불러오는 중...' : '더 보기'}
        </button>
      )}
    </div>
  );
}
