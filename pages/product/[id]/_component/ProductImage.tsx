import { Product } from '@prisma/client';
import Image from 'next/image';
import React from 'react';
import { UserHashtagHit } from './../index';

type ProductImageProps = {
  product: Product & UserHashtagHit;
};
function ProductImage({ product }: ProductImageProps) {
  return (
    <>
      <div className="productInfo">
        <div className="imagewrap">
          {product && (
            <Image
              src={
                product.auth
                  ? `/watermark/watermark_${product.image}`
                  : `/uploads/${product.image}`
              }
              // priority={true}
              // width={400}
              // height={600}
              // layout="responsive"
              // sizes="30vw"
              // layout="responsive"
              layout="fill"
              alt={product.image}
            />
          )}
        </div>
      </div>
      <style jsx>{`
        $card_mxh: 80vh;
        .productInfo {
          position: relative;
          width: 50%;
          padding: 1rem;
          max-height: $card_mxh;
          .imagewrap {
            position: relative;
            border-top-left-radius: 20px;
            border-bottom-left-radius: 20px;
            overflow: hidden;
            width: 100%;
            height: 100%;
          }
        }
      `}</style>
    </>
  );
}

export default ProductImage;
