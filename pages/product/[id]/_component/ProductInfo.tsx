import React, { useState } from 'react';
import UserImage from './UserImage';
import ProductBtnModifty from './ProductBtnModifty';
import Input from '@components/input';
import DOMPurify from 'dompurify';
import axios from 'axios';
import { useQuery } from 'react-query';
import { HashTag, Product, ProductHit } from '@prisma/client';
import { useForm } from 'react-hook-form';
import ProductModal from './ProductModal';
export interface UserHashtagHit {
  user: {
    email: string;
    name: string;
  };
  hashtag: HashTag;
  productHit: ProductHit;
}
export type ProductDetailType = {
  ok: boolean;
  product: Product & UserHashtagHit;
};
type ProductInfoProps = {
  productId: string | undefined;
};
function ProductInfo({ productId }: ProductInfoProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [paidDown, setPaidDown] = useState(false);
  const {
    register,

    watch
  } = useForm();
  const watchAuth = watch('checkAuth');

  const getProduct = () =>
    axios.get(`/api/product/${productId}`).then((res) => res.data);
  const { data, isLoading, isSuccess } = useQuery<ProductDetailType>(
    ['getProduct'],
    getProduct,
    {
      enabled: !!productId
    }
  );
  const onClickDelete = () => {
    setModalOpen((prev) => !prev);
  };
  const onClickDown = () => {
    setPaidDown((prev) => !prev);
  };
  if (isLoading) return null;

  return (
    <>
      <ProductModal
        modalOpen={modalOpen}
        paidOpen={paidDown}
        productId={productId}
        setModalOpen={setModalOpen}
        setPaidDown={setPaidDown}
      />

      {isSuccess && (
        <>
          <div className="productInfo">
            <UserImage user={data?.product?.user} />

            <ProductBtnModifty
              product={data?.product}
              onClickDelete={onClickDelete}
              productId={productId}
              onClickDown={onClickDown}
              watchAuth={watchAuth}
            />

            <Input
              label="checkAuth"
              name="checkAuth"
              type="checkbox"
              register={register('checkAuth')}
            />
          </div>

          <div>
            <h1>{data.product.title}</h1>
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(data?.product.description as string)
            }}
          />
          <div className="hashtagwrap" role="hashtag">
            {data?.product.hashtag?.hashtag?.length > 0 &&
              data?.product.hashtag?.hashtag.split(',').map((hash, i) => (
                <span className="hashtag" key={i}>
                  <span>#</span>
                  <span>{hash}</span>
                </span>
                // <span key={i}>#{hash}</span>
              ))}
          </div>
        </>
      )}
      <style jsx>{`
        .productInfo {
          width: 100%;
          display: flex;
          justify-content: space-between;
          position: relative;
        }
        .hashtagwrap {
          padding-top: 10px;
        }
        .hashtag {
          background-color: #f8f9fa;
          display: inline-block;
          border-radius: 1rem;
          height: 2rem;
          line-height: 2rem;
          padding-left: 1rem;
          padding-right: 1rem;
          margin-right: 0.75rem;
          margin-bottom: 1rem;
          &:hover {
            cursor: pointer;
            background-color: darkgray;
          }
          span {
            font-weight: bold;
          }

          span:nth-child(1) {
            color: #12b886;
            font-weight: bold;
            padding-right: 0.2rem;
          }
        }
      `}</style>
    </>
  );
}

export default ProductInfo;
