'use client';
import ProductChat from '@app/product/[id]/_component/ProductChat';
import ProductChatForm from '@app/product/[id]/_component/ProductChatForm';
import ProductImage from '@app/product/[id]/_component/ProductImage';
import ProductInfo from '@app/product/[id]/_component/ProductInfo';
import { getProduct } from '@app/product/[id]/_lib/getProduct';
import { UserHashtagHit } from '@app/product/[id]/page';
import DeleteSkeleton from '@components/DeleteSkeleton';
import LoadingAnimation from '@components/LoadingSkeleton';
import { Product } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
export type ProductDetailType = {
  ok: boolean;
  product: Product & UserHashtagHit;
};
type ParamsType = {
  //   data: ProductDetailType | undefined;

  id: string;
};
export default function ProductPage() {
  const { id } = useParams<ParamsType>();
  console.log(id, 'id22', typeof id);
  const { data } = useQuery<any, any, ProductDetailType>({
    queryKey: ['product', id],
    queryFn: () => getProduct(id)
  });
  if (data?.product.status === 'PROCESSING') {
    return <DeleteSkeleton />;

    // return <LoadingAnimation />;
  }
  console.log(222);
  return (
    <div className="productwrapin">
      <ProductImage product={data?.product} />
      <div className="userInfo">
        {/* <ProductInfo key={id} productId={id?.toString()} />
          <ProductChat key={id} data={data} />
          <ProductChatForm key={id} data={data} /> */}
        <ProductInfo productId={id?.toString()} />
        <ProductChat data={data} />
        <ProductChatForm data={data} />
      </div>
      <style jsx>{`
        .productwrapin {
          width: 100%;
          min-height: 80vh;
          max-width: 1050px;
          display: flex;
          justify-content: center;
          border-radius: 2rem;
          overflow: hidden;
          box-shadow:
            rgba(0, 0, 0, 0.16) 0px 3px 6px,
            rgba(0, 0, 0, 0.23) 0px 3px 6px;
          > div:last-child {
            padding: 3rem;
          }
        }
      `}</style>
    </div>
  );
}
