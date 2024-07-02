import type { NextPage } from 'next';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { HashTag, Product, ProductHit } from '@prisma/client';

import ProductImage from './_component/ProductImage';

import ProductInfo from './_component/ProductInfo';
import ProductChat from './_component/ProductChat';
import ProductChatForm from './_component/ProductChatForm';
import { useGetProduct } from './_lib/useGetProduct';

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

/*
  const autoResizeTextarea = () => {
    const textarea =
      document.querySelector<HTMLTextAreaElement>('.autoTextarea');

    if (textarea) {
      textarea.style.height = 'auto';
      const height = textarea.scrollHeight; // 높이
      textarea.style.height = `${height + 8}px`;
    }
  };
*/
const ProductDetail: NextPage = () => {
  const router = useRouter();
  // const arrowRef = useRef<HTMLSpanElement>(null);

  const productId = router.query.id;

  const { data, isLoading } = useGetProduct(productId?.toString() as string);

  if (isLoading) return <div>Loading Data....</div>;
  if (!data?.ok) return <div>해당 상품은 존재하지 않습니다</div>;
  return (
    <div>
      <div className="productwrapout">
        <div className="productwrapin">
          <ProductImage product={data.product} />
          <div className="userInfo">
            <ProductInfo productId={productId?.toString()} />
            <ProductChat data={data} />
            <ProductChatForm data={data} />
          </div>
        </div>

        <style jsx>{`
          $card_mxh: 80vh;
          .productwrapout {
            position: relative;
            margin-top: 30px;
            margin-bottom: 30px;
            display: flex;
            width: 100%;
            justify-content: center;
          }
          .productwrapin {
            width: 100%;
            min-height: 80vh;
            max-width: 1050px;
            display: flex;
            justify-content: center;
            border-radius: 2rem;
            overflow: hidden;
            box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px,
              rgba(0, 0, 0, 0.23) 0px 3px 6px;
            > div:last-child {
              padding: 3rem;
            }
          }

          .userInfo {
            position: relative;
            width: 50%;
            max-height: $card_mxh;
          }
        `}</style>
      </div>
    </div>
  );
};

export default ProductDetail;
