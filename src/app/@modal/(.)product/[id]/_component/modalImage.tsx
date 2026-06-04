'use client';
import { useFeedDetail } from '@app/@modal/(.)product/[id]/_lib/useFeedQuery';
import Image from 'next/image';
export default function ModalImage({ productId }: { productId: string }) {
  const { data } = useFeedDetail(productId);
  const item = data.product.image;
  const convertedUrl = item.endsWith('.jpeg')
    ? item.replace(/\.jpeg$/i, '.jpg')
    : item;
  return (
    <div
      className="relative aspect-[1.5] w-full bg-gray-100 flex items-center justify-center"
      style={{ backgroundColor: data.product.dominantColor || '#e0e0e0' }}
    >
      {/* 실제 이미지 사용 시 아래 주석 해제 후 img 태그 사용 */}
      {/* <img src="/your-image.jpg" alt="Feed" className="h-full w-full object-cover" /> */}
      {/* <img
        src={`https://d18ktmttqdka9f.cloudfront.net/${data?.product?.image}`}
        alt="modal-img"
      /> */}
      <Image
        src={`736x/${convertedUrl}`}
        // src={'/localimages/emptyuser.png'}
        // sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px"
        alt="modal-image"
        blurDataURL={data.product.lqip}
        fill
        // sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px"
      />
      {/* placeholder */}
      {/* <span className="text-4xl font-thin text-gray-400 italic">Img</span> */}
    </div>
  );
}
