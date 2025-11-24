import { HashTag, Product, ProductHit } from '@prisma/client';

// import { useGetProduct } from './_lib/useGetProduct';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query';
import { getProduct } from '@app/product/[id]/_lib/getProduct';
import ProductPage from '@app/product/[id]/_component/ProductPage';

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
type Props = {
  params: {
    id: string;
  };
};
export default async function ProductDetail({ params }: Props) {
  // console.log(params, 'params');
  const { id } = await params;
  const queryClient = new QueryClient();

  // 2. 데이터 미리 가져오기 (Prefetch) -> SSR HTML에 데이터 포함
  await queryClient.prefetchQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id)
  });

  // const productId = params.id;

  // const { data, isLoading } = useGetProduct(productId?.toString() as string);

  // if (isLoading) return <div>Loading Data....</div>;
  // if (!data?.ok) return <div>해당 상품은 존재하지 않습니다</div>;
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <div className="productwrapout">
          <ProductPage key={id} />
          {/* <div className="productwrapin">
          <ProductImage product={data.product} />
          <div className="userInfo">
            <ProductInfo productId={productId?.toString()} />
            <ProductChat data={data} />
            <ProductChatForm data={data} />
          </div>
        </div> */}

          {/* <style jsx>{`
          
          .productwrapout {
            position: relative;
            margin-top: 30px;
            margin-bottom: 30px;
            display: flex;
            width: 100%;
            justify-content: center;
          }
          

          .userInfo {
            position: relative;
            width: 50%;
            max-height: 80vh;
          }
        `}</style> */}
        </div>
      </div>
    </HydrationBoundary>
  );
}
