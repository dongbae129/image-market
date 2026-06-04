import { Product } from '@prisma/client';
import Image from 'next/image';

import { UserHashtagHit } from '../page';
import LoaderTest from '../_lib/llTest';
type ProductImageProps = {
  product: (Product & UserHashtagHit) | undefined;
};
function ProductImage({ product }: ProductImageProps) {
  const convertedUrl = product?.image.endsWith('.jpeg')
    ? product?.image.replace(/\.jpeg$/i, '.jpg')
    : product?.image;
  return (
    <>
      <div className="productInfo">
        <div className="imagewrap">
          {product && (
            <Image
              // loader={LoaderTest}
              src={`736x/${convertedUrl}`}
              // src={`736x/${product.image}`}
              // src={'/localimages/emptyuser.png'}
              // src={`${process.env.NEXT_PUBLIC_R2_DEV_PUBLIC_URL}/${product.image}`}
              // src="https://images.unsplash.com/photo-1501854140801-50d01698950b" // 테스트용 외부 이미지

              alt="Test"
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px"
              priority
              // width={500}
              // height={300}
            />
            // <img
            //   src={`${process.env.NEXT_PUBLIC_R2_DEV_PUBLIC_URL}/${product.image}`}
            //   // src="/localimages/emptyuser.png"
            //   // src={
            //   //   product.auth
            //   //     ? `/watermark/watermark_${product.image}`
            //   //     : `/uploads/${product.image}`
            //   // }

            //   // sizes="(max-width: 493px) 33vw"
            //   // fill={true}
            //   alt={product.image}
            //   // priority
            // />
            // <Image
            //   src={`${process.env.NEXT_PUBLIC_R2_DEV_PUBLIC_URL}/${product.image}`}
            //   // src="/localimages/emptyuser.png"
            //   // src={
            //   //   product.auth
            //   //     ? `/watermark/watermark_${product.image}`
            //   //     : `/uploads/${product.image}`
            //   // }

            //   sizes="(max-width: 493px) 33vw"
            //   fill={true}
            //   alt={product.image}
            //   priority
            // />
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
