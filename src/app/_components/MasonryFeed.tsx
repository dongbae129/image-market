'use client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect, useRef, useState, useMemo } from 'react';
import { getProducts } from '@app/_libs/getProducts';
import { normalizeRatio } from '@app/_libs/normalizeRatio';
import Link from 'next/link';
import style from './MasonryTest.module.scss';
// --- 최적화된 유동적 컬럼 너비 계산 로직 ---
const GAP = 16;
const MIN_CARD_WIDTH = 220; // 카드의 최소 너비 (px)

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
    // 컬럼 수가 0이 되지 않도록 보장 (매우 좁은 화면)
    if (columnCount < 1) columnCount = 1;
    columnWidth = (containerWidth - (columnCount - 1) * GAP) / columnCount;
    columnWidth = Math.max(MIN_CARD_WIDTH, columnWidth); // 최종 너비는 최소 너비 이상이어야 함
  }

  return { columnWidth: Math.floor(columnWidth), columnCount }; // 정수로 반환
}

export default function MasonryGrid({ ssrItemCount = 0 }) {
  const { ref: inViewRef, inView } = useInView({ threshold: 0.5 });
  const containerRef = useRef(null);
  const [enableTransitions, setEnableTransitions] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [layoutParams, setLayoutParams] = useState({
    columnWidth: 0,
    columnCount: 0
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ['getProducts'],
      queryFn: getProducts,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        const lastPageLength = lastPage.products.length;
        if (lastPageLength === 0 || lastPageLength < 6) return undefined;
        return lastPageLength >= 6 && lastPage.products[lastPageLength - 1].id;
      }
    });
  // 무한 스크롤
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Hydration 완료 및 초기/리사이즈 시 레이아웃 파라미터 설정
  useEffect(() => {
    setIsHydrated(true);
    let debounceTimer: ReturnType<typeof setTimeout> | undefined;

    const updateLayoutParams = () => {
      if (containerRef.current) {
        const params = calculateOptimalLayout(containerRef.current.offsetWidth); // 변경된 함수 사용
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
      debounceTimer = setTimeout(updateLayoutParams, 150); // Debounce 시간 조절 가능
    };

    updateLayoutParams(); // 초기 계산
    const transitionTimer = setTimeout(() => {
      setEnableTransitions(true);
    }, 150);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(debounceTimer);
      clearTimeout(transitionTimer);
    };
  }, []); // 마운트 시 한 번만 실행

  // 모든 아이템 병합
  const allItems = useMemo(
    () => data?.pages.flatMap((page) => page.products) ?? [],
    [data]
  );

  // --- 레이아웃 계산 로직 (useMemo) ---
  const { positions, containerHeight } = useMemo(() => {
    if (
      !isHydrated ||
      !containerRef.current ||
      allItems.length === 0 ||
      layoutParams.columnCount === 0
    ) {
      // 초기에는 SSR 결과를 유지하거나 빈 배열 반환 (early script가 처리)
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
      // SSR 아이템은 초기 위치 건너뛰기 (스타일은 JSX에서 처리)
      // if (index < ssrItemCount && !enableTransitions) return; // 초기 transition 비활성화시 SSR 아이템 계산 불필요 -> 로직 단순화 위해 제거

      let shortestColumnIndex = 0;
      for (let i = 1; i < columnCount; i++) {
        if (columnHeights[i] < columnHeights[shortestColumnIndex]) {
          shortestColumnIndex = i;
        }
      }

      const top = columnHeights[shortestColumnIndex];
      const left = shortestColumnIndex * (columnWidth + GAP);
      const itemHeight = columnWidth * normalizeRatio(item.ratio); // ratio 기반 높이 계산

      columnHeights[shortestColumnIndex] += itemHeight + GAP;
      newPositions.push({ top, left, width: columnWidth, height: itemHeight });
    });

    return {
      positions: newPositions,
      containerHeight: Math.max(0, ...columnHeights) - GAP // 음수 방지 및 마지막 갭 제거
    };
  }, [
    allItems,
    isHydrated,
    layoutParams /*, ssrItemCount, enableTransitions */
  ]); // ssrItemCount, enableTransitions 의존성 제거

  // JSX 렌더링 부분
  return (
    <>
      <div
        ref={containerRef}
        data-masonry-container="true"
        className="relative mx-auto"
        style={{
          // Hydration 이후에만 React가 계산한 높이 적용
          height:
            isHydrated && typeof containerHeight === 'number'
              ? `${containerHeight}px`
              : 'auto',
          transition: enableTransitions ? 'height 300ms ease' : 'none'
        }}
        suppressHydrationWarning={true} // SSR과 초기 스타일 불일치 경고 무시
      >
        {allItems.map((item, index) => {
          const pos = positions[index];
          // SSR 아이템은 early script가 처리, 클라이언트 추가 아이템은 React가 처리
          const isClientItem = index >= ssrItemCount;

          return (
            <div
              key={item.id}
              data-masonry-item="true"
              data-ratio={item.ratio}
              data-client-item={isClientItem ? 'true' : undefined} // 클라이언트 추가 아이템 식별
              className={`${style.card} rounded-lg overflow-hidden absolute`} // 기본적으로 absolute
              style={
                // Hydration 이후 & 위치 계산 완료 시 스타일 적용
                isHydrated && pos
                  ? {
                      width: `${pos.width}px`,
                      height: `${pos.height}px`,
                      transform: `translate(${pos.left}px, ${pos.top}px)`,
                      transition: enableTransitions
                        ? 'transform 300ms ease-in-out, width 150ms ease-in-out'
                        : 'none'
                      // SSR 아이템은 early script가 visible 처리, 클라이언트 아이템은 React가 visible 처리
                      // visibility: 'visible'
                    }
                  : {
                      // SSR 아이템 초기 상태 (early script 처리 전)
                      // Early script가 너비/위치/visibility 적용할 것임
                      width: `${MIN_CARD_WIDTH}px`, // 임시 너비
                      aspectRatio: normalizeRatio(+item.ratio),
                      visibility: 'hidden', // 초기 숨김
                      top: 0,
                      left: 0
                    }
              }
            >
              <Link href={`/product/${item.id}`} passHref>
                <img
                  src={`${process.env.NEXT_PUBLIC_R2_DEV_PUBLIC_URL}/${item.image}`}
                  // src="/localimages/emptyuser.png"
                  alt={`Pin ${item.id}`}
                  className="w-full h-full object-cover block"
                  // 초기 SSR 아이템은 Eager, 이후는 Lazy 로딩
                  loading={index < ssrItemCount ? 'eager' : 'lazy'}
                />
              </Link>
            </div>
          );
        })}
      </div>

      {/* 무한 스크롤 감지 및 로딩 상태 */}
      <div ref={inViewRef} className="h-10 w-full" />
      {isFetchingNextPage && (
        <p className="text-center py-4">Loading more...</p>
      )}
      {status === 'error' && (
        <p className="text-center text-red-500">Error: {error.message}</p>
      )}
      {!hasNextPage && status !== 'pending' && (
        <p className="text-center py-4 text-gray-500">No more items to load.</p>
      )}
    </>
  );
}
