// 'use client';
// import { useFeedDetail } from '@app/@modal/(.)product/[id]/_lib/useFeedQuery';
// import Image from 'next/image';

// export default function ModalImage({ productId }: { productId: string }) {
//   const { data } = useFeedDetail(productId);
//   const item = data?.product.image;
//   const convertedUrl = item?.endsWith('.jpeg')
//     ? item.replace(/\.jpeg$/i, '.jpg')
//     : item;

//   return (
//     <div
//       className="w-full flex justify-center overflow-hidden rounded-md bg-gray-100"
//       style={{
//         backgroundColor: data?.product.dominantColor || '#e0e0e0'
//       }}
//     >
//       <Image
//         src={`736x/${convertedUrl}`}
//         alt="modal-image"
//         blurDataURL={data?.product?.lqip!}
//         width={0}
//         height={0}
//         sizes="100vw"
//         style={{ width: '100%', height: 'auto' }}
//         className="object-cover"
//       />
//     </div>
//   );
// }
'use client';
import { useFeedDetail } from '@app/@modal/(.)product/[id]/_lib/useFeedQuery';
import Image from 'next/image';

export default function ModalImage({ productId }: { productId: string }) {
  const { data } = useFeedDetail(productId);
  const item = data?.product.image;
  const convertedUrl = item?.endsWith('.jpeg')
    ? item.replace(/\.jpeg$/i, '.jpg')
    : item;
  const blurInitial =
    'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mO88B8AAqUB0Y/H4mkAAAAASUVORK5CYII=';
  return (
    // 🌟 핵심: relative와 h-full을 주어 부모가 주는 공간을 꽉 채우게 합니다.
    <div
      className="relative w-full h-full flex justify-center overflow-hidden rounded-md bg-gray-100"
      style={{
        backgroundColor: data?.product.dominantColor || '#e0e0e0'
      }}
    >
      <Image
        src={`736x/${convertedUrl}`}
        alt="modal-image"
        blurDataURL={blurInitial || data?.product?.lqip}
        fill
        sizes="100vw"
        className="object-cover"
      />
    </div>
  );
}
