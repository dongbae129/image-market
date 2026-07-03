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
//       className="w-full flex justify-center overflow-hidden bg-gray-100"
//       style={{
//         backgroundColor: data?.product.dominantColor || '#e0e0e0'
//       }}
//     >
//       {/* 실제 이미지 사용 시 아래 주석 해제 후 img 태그 사용 */}
//       {/* <img src="/your-image.jpg" alt="Feed" className="h-full w-full object-cover" /> */}
//       {/* <img
//         src={`https://d18ktmttqdka9f.cloudfront.net/${data?.product?.image}`}
//         alt="modal-img"
//       /> */}
//       <Image
//         className="w-full h-auto max-h-[60vh] object-cover"
//         src={`736x/${convertedUrl}`}
//         // src={'/localimages/emptyuser.png'}
//         // sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px"
//         alt="modal-image"
//         blurDataURL={data.product.lqip!}
//         width={0}
//         height={0}
//         sizes="100vw"
//         // sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px"
//       />
//       {/* placeholder */}
//       {/* <span className="text-4xl font-thin text-gray-400 italic">Img</span> */}
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

  return (
    <div
      className="w-full flex justify-center overflow-hidden rounded-md bg-gray-100"
      style={{
        backgroundColor: data?.product.dominantColor || '#e0e0e0'
      }}
    >
      <Image
        src={`736x/${convertedUrl}`}
        alt="modal-image"
        blurDataURL={data?.product?.lqip!}
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
        className="max-h-[45vh] object-cover sm:max-h-[55vh]"
      />
    </div>
  );
}
