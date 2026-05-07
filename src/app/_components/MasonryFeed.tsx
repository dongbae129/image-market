'use client';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useWindowVirtualizer } from '@tanstack/react-virtual'; // 가상화 훅 추가
import { getProducts } from '@app/_libs/getProducts';
import { normalizeRatio } from '@app/_libs/normalizeRatio';
import styles from './MasonryFeed.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import PreloadLink from '@components/PreLoadLink';
import Link from 'next/link';
import { Product } from '@prisma/client';

type ProductProps = {
  ok: boolean;
  product: Product;
};
// --- 상수 및 유틸 ---
const GAP = 16;
const MIN_CARD_WIDTH = 220;

function calculateOptimalLayout(containerWidth: number) {
  if (!containerWidth || containerWidth <= 0) {
    return { columnWidth: MIN_CARD_WIDTH, columnCount: 1 };
  }

  const maxPossibleColumns = Math.max(
    1,
    Math.floor((containerWidth + GAP) / (MIN_CARD_WIDTH + GAP))
  );
  const idealWidth =
    (containerWidth - (maxPossibleColumns - 1) * GAP) / maxPossibleColumns;

  let columnCount = maxPossibleColumns;
  let columnWidth = idealWidth;

  if (idealWidth < MIN_CARD_WIDTH && maxPossibleColumns > 1) {
    columnCount = maxPossibleColumns - 1;
    if (columnCount < 1) columnCount = 1;
    columnWidth = (containerWidth - (columnCount - 1) * GAP) / columnCount;
    columnWidth = Math.max(MIN_CARD_WIDTH, columnWidth);
  }

  return { columnWidth: Math.floor(columnWidth), columnCount };
}

export default function MasonryGrid({ ssrItemCount = 0 }) {
  const router = useRouter();
  const { ref: inViewRef, inView } = useInView({ threshold: 0.5 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [enableTransitions, setEnableTransitions] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [layoutParams, setLayoutParams] = useState({
    columnWidth: 0,
    columnCount: 0
  });
  const queryClient = useQueryClient();
  // --- 1. Window Virtualizer 설정 ---
  // 별도의 element ref 없이 브라우저 window 스크롤을 감지합니다.
  const virtualizer = useWindowVirtualizer({
    count: 0, // Masonry는 row 기반이 아니므로 count를 0으로 두고 scrollOffset만 활용합니다.
    estimateSize: () => 0,
    overscan: 0
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ['getProducts'],
      queryFn: getProducts,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        const lastPageLength = lastPage?.products?.length;
        if (lastPageLength === 0 || lastPageLength < 6) return undefined;
        return lastPageLength >= 6 && lastPage.products[lastPageLength - 1].id;
      }
    });

  // 무한 스크롤 트리거
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Hydration 및 리사이즈 이벤트
  useEffect(() => {
    setIsHydrated(true);
    let debounceTimer: ReturnType<typeof setTimeout> | undefined;

    const updateLayoutParams = () => {
      if (containerRef.current) {
        const params = calculateOptimalLayout(containerRef.current.offsetWidth);
        setLayoutParams((prevParams) => {
          if (
            params.columnWidth !== prevParams.columnWidth ||
            params.columnCount !== prevParams.columnCount
          ) {
            return params;
          }
          return prevParams;
        });
      }
    };

    const handleResize = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(updateLayoutParams, 150);
    };

    updateLayoutParams();
    const transitionTimer = setTimeout(() => {
      setEnableTransitions(true);
    }, 150);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(debounceTimer);
      clearTimeout(transitionTimer);
    };
  }, []);

  // 전체 데이터 플랫화
  const allItems = useMemo(
    () => data?.pages.flatMap((page) => page.products) ?? [],
    [data]
  );

  // --- 2. 전체 아이템 위치 계산 (기존 로직 유지) ---
  // 가상화를 하더라도 전체 높이를 알아야 스크롤바가 유지되므로 위치 계산은 전체 다 수행합니다.
  const { positions, containerHeight } = useMemo(() => {
    if (
      !isHydrated ||
      !containerRef.current ||
      allItems.length === 0 ||
      layoutParams.columnCount === 0
    ) {
      return { positions: [], containerHeight: 'auto' };
    }

    type Position = {
      top: number;
      left: number;
      width: number;
      height: number;
    };
    const { columnWidth, columnCount } = layoutParams;
    const columnHeights: number[] = new Array(columnCount).fill(0);
    const newPositions: Position[] = [];

    allItems.forEach((item) => {
      let shortestColumnIndex = 0;
      for (let i = 1; i < columnCount; i++) {
        if (columnHeights[i] < columnHeights[shortestColumnIndex]) {
          shortestColumnIndex = i;
        }
      }

      const top = columnHeights[shortestColumnIndex];
      const left = shortestColumnIndex * (columnWidth + GAP);
      const itemHeight = columnWidth * normalizeRatio(item?.ratio);

      columnHeights[shortestColumnIndex] += itemHeight + GAP;
      newPositions.push({ top, left, width: columnWidth, height: itemHeight });
    });

    return {
      positions: newPositions,
      containerHeight: Math.max(0, ...columnHeights) - GAP
    };
  }, [allItems, isHydrated, layoutParams]);

  // --- 3. 뷰포트 기반 렌더링 아이템 필터링 (가상화 핵심) ---
  const visibleItems = useMemo(() => {
    // Hydration 전이거나 위치 계산이 안 됐으면, 초기 SSR 아이템만 리턴하거나 빈 배열
    if (!isHydrated || positions.length === 0) {
      return allItems.slice(0, ssrItemCount).map((item, index) => ({
        item,
        index,
        pos: null // 초기엔 위치 정보 없음 (early script가 처리)
      }));
    }

    const scrollY = virtualizer.scrollOffset || 0;
    // 윈도우 높이 (SSR일 땐 기본값)
    const windowHeight =
      typeof window !== 'undefined' ? window.innerHeight : 1000;

    // 버퍼: 위아래로 800px 정도 미리 렌더링해서 스크롤 시 깜빡임 방지
    const buffer = 800;
    const rangeStart = scrollY - buffer;
    const rangeEnd = scrollY + windowHeight + buffer;

    // 전체 아이템 중 현재 보고 있는 범위에 겹치는 것만 필터링
    const visibleResults = [];
    for (let i = 0; i < allItems.length; i++) {
      const pos = positions[i];
      if (!pos) continue;

      const itemBottom = pos.top + pos.height;
      // 아이템의 바닥이 범위 시작보다 아래 && 아이템 머리가 범위 끝보다 위
      if (itemBottom > rangeStart && pos.top < rangeEnd) {
        visibleResults.push({
          item: allItems[i],
          index: i,
          pos: pos
        });
      }
    }
    return visibleResults;
  }, [allItems, positions, virtualizer.scrollOffset, isHydrated, ssrItemCount]);

  const clickTest = (data: Product) => {
    queryClient.setQueryData(['product', data.id], (prev) => {
      // console.log(data, 'clickData', prev, 'prev');
      // if (prev?.product?.user) return prev;
      return {
        ok: true,
        product: data
      };
    });
    // queryClient.invalidateQueries({ queryKey: ['product', data.id] });
  };
  return (
    <>
      <div
        ref={containerRef}
        data-masonry-container="true"
        className="relative mx-auto"
        style={{
          // 전체 컨테이너 높이를 명시해야 스크롤바가 정상적으로 생성됨
          height:
            isHydrated && typeof containerHeight === 'number'
              ? `${containerHeight}px`
              : 'auto',
          transition: enableTransitions ? 'height 300ms ease' : 'none'
        }}
        suppressHydrationWarning
      >
        {visibleItems.map(({ item, index, pos }) => {
          const isClientItem = index >= ssrItemCount;

          return (
            <div
              suppressHydrationWarning
              key={item.id}
              data-masonry-item="true"
              data-ratio={item.ratio}
              data-client-item={isClientItem ? 'true' : undefined}
              className={`${styles.card} rounded-lg overflow-hidden absolute`}
              style={
                isHydrated && pos
                  ? {
                      width: `${pos.width}px`,
                      height: `${pos.height}px`,
                      transform: `translate(${pos.left}px, ${pos.top}px)`,
                      // willChange 최적화 추가: 브라우저에게 변화 힌트 제공
                      willChange: 'transform',
                      transition: enableTransitions
                        ? 'transform 300ms ease-in-out, width 150ms ease-in-out'
                        : 'none'
                    }
                  : {
                      // SSR 초기 상태 (early script가 처리할 영역)
                      width: `${MIN_CARD_WIDTH}px`,
                      aspectRatio: `${normalizeRatio(+item.ratio)}`,
                      visibility: 'hidden',
                      top: 0,
                      left: 0
                    }
              }
            >
              <Link
                onClick={() => clickTest(item)}
                href={`/product/${item.id}`}
                scroll={false}
                className="w-full h-full block relative" // Image fill을 위해 relative
                // imageSrc={`${process.env.NEXT_PUBLIC_R2_DEV_PUBLIC_URL}/${item.image}`}
              >
                {/* --- 4. next/image 최적화 적용 --- */}
                {/* <img
                  src={`https://d18ktmttqdka9f.cloudfront.net/${item.image}`}
                  alt="modal-img"
                /> */}

                <Image
                  // src={`474x/${item.image}`}
                  src={'/localimages/emptyuser.png'}
                  // src={`${process.env.NEXT_PUBLIC_R2_DEV_PUBLIC_URL}/${item.image}`}
                  alt={`Pin ${item.id}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px"
                  className="object-cover"
                  // 초기 아이템만 우선 로딩
                  priority={index < 6}
                  loading={index < 6 ? 'eager' : 'lazy'}
                  // 블러 처리 (필요시 base64 추가)
                  // placeholder="blur"
                  // blurDataURL="data:..."
                />
              </Link>
            </div>
          );
        })}
      </div>

      <div ref={inViewRef} className="h-10 w-full" />
      {isFetchingNextPage && (
        <p className="text-center py-4 text-gray-400 text-sm">
          Loading more...
        </p>
      )}

      {!hasNextPage && status !== 'pending' && (
        <p className="text-center py-10 text-gray-400 text-sm">
          No more items to load.
        </p>
      )}
    </>
  );
}
