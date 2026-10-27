import { HashTag, Product, ProductHit } from '@prisma/client';
import { getProduct } from '@app/product/[id]/_lib/getProduct';
import ProductPage from '@app/product/[id]/_component/ProductPage';
import { notFound } from 'next/navigation';
import './product-detail.css';

export interface UserHashtagHit {
  user: {
    email: string;
    name: string;
    image?: string | null;
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
  const { id } = await params;
  const data = await getProduct(id);
  if (!data?.ok || !data.product) notFound();

  return (
    <div>
      <div className="productwrapout">
        <ProductPage
          key={id}
          id={id}
          initialData={data as unknown as ProductDetailType}
        />
      </div>
    </div>
  );
}
