'use client';
import ProductChat from '@app/product/[id]/_component/ProductChat';
import ProductChatForm from '@app/product/[id]/_component/ProductChatForm';
import ProductImage from '@app/product/[id]/_component/ProductImage';
import ProductInfo from '@app/product/[id]/_component/ProductInfo';
import { getProduct } from '@app/product/[id]/_lib/getProduct';
import { UserHashtagHit } from '@app/product/[id]/page';
import DeleteSkeleton from '@components/DeleteSkeleton';
import { Product } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

type ProductDetailType = {
  ok: boolean;
  product: Product & UserHashtagHit;
};
type ProductPageProps = {
  id: string;
  initialData: ProductDetailType;
};

const formatCount = (value?: number) =>
  new Intl.NumberFormat('ko-KR').format(value ?? 0);

export default function ProductPage({ id, initialData }: ProductPageProps) {
  const artworkRef = useRef<HTMLElement>(null);
  const detailsPanelRef = useRef<HTMLElement>(null);
  const trackedHitProductRef = useRef<string | undefined>(undefined);
  const [detailsHeight, setDetailsHeight] = useState<number>();
  const { data: queryData } = useQuery<ProductDetailType>({
    queryKey: ['product', id],
    queryFn: () => getProduct(id) as unknown as ProductDetailType,
    initialData,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  });
  const data = queryData?.product ? queryData : initialData;
  const product = data.product;

  useEffect(() => {
    if (trackedHitProductRef.current === id) return;
    trackedHitProductRef.current = id;
    void fetch(`/api/product/${id}`, { method: 'POST', keepalive: true }).catch(
      () => undefined
    );
  }, [id]);

  useLayoutEffect(() => {
    const artwork = artworkRef.current;
    const detailsPanel = detailsPanelRef.current;
    if (!artwork || !detailsPanel) return;

    const syncPanelHeight = () => {
      if (window.innerWidth >= 681) {
        setDetailsHeight(artwork.getBoundingClientRect().height);
        detailsPanel.style.overflowY = 'auto';
      } else {
        setDetailsHeight(undefined);
        detailsPanel.style.overflowY = 'visible';
      }
    };

    syncPanelHeight();
    const observer =
      typeof ResizeObserver === 'undefined'
        ? undefined
        : new ResizeObserver(syncPanelHeight);
    observer?.observe(artwork);
    window.addEventListener('resize', syncPanelHeight);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', syncPanelHeight);
    };
  }, [product?.id]);

  if (product?.status === 'PROCESSING') return <DeleteSkeleton />;
  if (!product)
    return (
      <main className="product-detail">
        <p className="product-empty">상품 정보를 불러오지 못했습니다.</p>
      </main>
    );

  return (
    <main className="product-detail">
      <section className="product-detail-grid" aria-label="작품 상세">
        <div className="product-main-column">
          <ProductImage product={product} artworkRef={artworkRef} />
        </div>
        <aside
          className="product-sidebar"
          ref={detailsPanelRef}
          style={detailsHeight ? { height: `${detailsHeight}px` } : undefined}
        >
          <ProductInfo productId={id} data={data} />
          <div className="product-stats" aria-label="작품 반응 및 조회수">
            <span>
              <b aria-hidden="true">♡</b>
              {formatCount(product.likesCount)} 좋아요
            </span>
            <span>
              <b aria-hidden="true">◉</b>
              {formatCount(product.productHit?.hit)} 조회
            </span>
            <span>
              <b aria-hidden="true">▤</b>
              {formatCount(product.commentsCount)} 댓글
            </span>
          </div>
          <ProductChat data={data} totalCount={product.commentsCount} />
          <ProductChatForm data={data} />
        </aside>
      </section>
    </main>
  );
}
