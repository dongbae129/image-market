'use client';
import React, { useState } from 'react';
import UserImage from './UserImage';
import ProductBtnModifty from './ProductBtnModifty';
import Input from '@app/_components/input';
import { useQuery } from '@tanstack/react-query';
import { HashTag, Product, ProductHit } from '@prisma/client';
import { useForm } from 'react-hook-form';
import ProductModal from './ProductModal';
import { getProduct } from '@app/product/[id]/_lib/getProduct';
import sanitizeHtml from 'sanitize-html';
import { privateApi } from '@libs/client/axiosIntercepotr';
export interface UserHashtagHit {
  user: { id: number; email: string; name: string; image?: string | null };
  hashtag: HashTag;
  productHit: ProductHit;
}
export type ProductDetailType = {
  ok: boolean;
  product: Product &
    UserHashtagHit & { versions: { id: number; version: number }[] };
};
type ProductInfoProps = {
  productId: string;
  data?: ProductDetailType;
};
function ProductInfo({ productId, data: initialData }: ProductInfoProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { register } = useForm();
  const { data: queryData } = useQuery<ProductDetailType>({
    queryKey: ['product', productId],
    queryFn: () =>
      getProduct(productId) as unknown as Promise<ProductDetailType>,
    enabled: !!productId && !initialData,
    initialData: initialData
  });
  const data = initialData?.product ? initialData : queryData;
  const product = data?.product;
  const { data: currentUserData } = useQuery<{
    ok: boolean;
    user?: { id: number };
  }>({
    queryKey: ['current-user'],
    queryFn: async () => {
      const response = await privateApi.get('/api/user');
      return response.data;
    },
    enabled: Boolean(product),
    retry: false,
    staleTime: 60_000
  });
  const canManage =
    Boolean(product) && currentUserData?.user?.id === product?.userId;
  const onClickDelete = () => setModalOpen((prev) => !prev);
  return (
    <>
      {canManage && (
        <ProductModal
          modalOpen={modalOpen}
          productId={productId}
          setModalOpen={setModalOpen}
        />
      )}
      {product && (
        <>
          <div className="productInfo">
            <UserImage user={product.user} />
            <ProductBtnModifty
              onClickDelete={onClickDelete}
              productId={productId}
              productAuth={product.auth}
              canManage={canManage}
              productVersionId={product.versions?.[0]?.id}
            />
            {canManage && (
              <div className="product-auth-control">
                <Input
                  label="checkAuth"
                  name="checkAuth"
                  type="checkbox"
                  register={register('checkAuth')}
                />
              </div>
            )}
          </div>
          <h1>{product.title}</h1>
          <div
            className="product-description"
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(product.description ?? '')
            }}
          />
          <div className="hashtagwrap" role="list" aria-label="작품 태그">
            {product.hashtag?.hashtag
              ?.split(',')
              .filter(Boolean)
              .map((hash, i) => (
                <span className="hashtag" key={`${hash}-${i}`}>
                  <span>#</span>
                  <span>{hash.trim()}</span>
                </span>
              ))}
          </div>
        </>
      )}
    </>
  );
}
export default ProductInfo;
