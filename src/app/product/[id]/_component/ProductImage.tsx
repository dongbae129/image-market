import { Product } from '@prisma/client';
import Image from 'next/image';
import React from 'react';
import { UserHashtagHit } from '../page';

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
              src={`${process.env.NEXT_PUBLIC_R2_DEV_PUBLIC_URL}/${product.image}`}
              // src="/localimages/emptyuser.png"
              // src={
              //   product.auth
              //     ? `/watermark/watermark_${product.image}`
              //     : `/uploads/${product.image}`
              // }
              sizes="(max-width: 493px) 33vw"
              fill={true}
              alt={product.image}
              priority
            />
          )}
        </div>
      </div>
      <style jsx>{`
        {/* $card_mxh: 80vh; */}
        .productInfo {
          width: 50%;
          position: relative;

          padding: 1rem;
          max-height: 80vh;
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
