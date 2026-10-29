import { Product } from '@prisma/client';
import Image from 'next/image';
import { RefObject } from 'react';
import { UserHashtagHit } from '../page';

type ProductImageProps = {
  product: (Product & UserHashtagHit) | undefined;
  artworkRef?: RefObject<HTMLElement>;
};
function ProductImage({ product, artworkRef }: ProductImageProps) {
  if (!product) return null;
  const image = product.image.endsWith('.jpeg')
    ? product.image.replace(/\.jpeg$/i, '.jpg')
    : product.image;
  const date = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date(product.createdAt));
  return (
    <article className="product-panel product-visual" ref={artworkRef}>
      <div className="product-art">
        <Image
          src={`736x/${image}`}
          alt={product.title}
          fill
          sizes="(max-width: 680px) 100vw, 65vw"
          priority
        />
        {product.auth && <span className="product-art-badge">PRO</span>}
      </div>
    </article>
  );
}
export default ProductImage;
