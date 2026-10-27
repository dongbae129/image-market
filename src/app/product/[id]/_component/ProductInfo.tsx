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
export interface UserHashtagHit {
  user: { email: string; name: string; image?: string | null };
  hashtag: HashTag;
  productHit: ProductHit;
}
export type ProductDetailType = {
  ok: boolean;
  product: Product & UserHashtagHit;
};
type ProductInfoProps = {
  productId: string;
  data?: ProductDetailType;
};
function ProductInfo({ productId, data: initialData }: ProductInfoProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [paidDown, setPaidDown] = useState(false);
  const { register, watch } = useForm();
  const watchAuth = watch('checkAuth');
  const { data: queryData } = useQuery<ProductDetailType>({
    queryKey: ['product', productId],
    queryFn: async () =>
      (await getProduct(productId)) as unknown as ProductDetailType,
    enabled: !!productId && !initialData,
    initialData: initialData
  });
  const data = initialData?.product ? initialData : queryData;
  const product = data?.product;
  const onClickDelete = () => setModalOpen((prev) => !prev);
  const onClickDown = () => setPaidDown((prev) => !prev);
  return (
    <>
      <ProductModal
        modalOpen={modalOpen}
        paidOpen={paidDown}
        productId={productId}
        setModalOpen={setModalOpen}
        setPaidDown={setPaidDown}
      />
      {product && (
        <>
          <div className="productInfo">
            <UserImage user={product.user} />
            <ProductBtnModifty
              product={product}
              onClickDelete={onClickDelete}
              productId={productId}
              onClickDown={onClickDown}
              watchAuth={watchAuth}
            />
            <div className="product-auth-control">
              <Input
                label="checkAuth"
                name="checkAuth"
                type="checkbox"
                register={register('checkAuth')}
              />
            </div>
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
