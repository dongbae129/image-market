'use client';
import type { NextPage } from 'next';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Product } from '@prisma/client';
import axios from 'axios';

import UploadImage from '@app/_components/uploadImage';

interface UploadProductForm {
  image: FileList;
  title: string;
  description?: string;
  productAuth: boolean;
  ratio: number;
}

interface UploadProductResponse {
  ok: boolean;
  product: Product;
  error?: string;
  message?: string;
}
const Upload: NextPage = () => {
  const [imagePreview, setImagePreview] = useState('');
  const [hashtag, setHashtag] = useState<string[]>([]);
  const ratioRef = useRef('');
  const imgInputRef = useRef<JSX.Element>(null);
  const imgref = useRef<HTMLImageElement>(null);

  const router = useRouter();

  // const { data } = useQuery<userResponse>(['userInfo']);

  // if ((data && !data?.ok) || (data && !data.user.id)) router.push('/');

  //   const { register, handleSubmit, watch } = useForm<UploadProductForm>();
  //   const uploadPost = (data: FormData) =>
  //     axios.post('/api/product/upload', data).then((res) => res.data);
  //   const { mutate, isLoading } = useMutation<
  //     UploadProductResponse,
  //     any,
  //     FormData
  //   >(uploadPost, {
  //     onSuccess: ({ product }) => {
  //       console.log(product, 'product data');
  //       router.push(`/product/${product.id}`);
  //     }
  //   });
  // const imageWatch = watch('image');

  // useEffect(() => {
  //   if (imageWatch && imageWatch.length > 0) {
  //     console.log(imageWatch, 'watchbefore');
  //     const file = imageWatch[0];
  //     if (file) {
  //       const ratioImage = new Image();
  //       ratioImage.src = URL.createObjectURL(file);

  //       ratioImage.onload = () => {
  //         ratioRef.current = (ratioImage.width / ratioImage.height).toFixed(2);
  //         console.log(ratioImage.width, ratioImage.height, '?!');
  //       };

  //       // testimage.onload(() => {
  //       //   console.log(testimage.width, testimage.height, 'onload');
  //       // });
  //       // console.log(testimage, '11');
  //       // console.log(testimage.width, testimage.height, '22');
  //     }
  //     console.log(file, 'imagewatch');
  //     console.log(imgref.current?.width, 'imgref22');
  //     setImagePreview(URL.createObjectURL(file));
  //   }
  // }, [imageWatch]);

  return (
    <div className="uploadwrap">
      <UploadImage
        url="product/upload"
        component={['title', 'description', 'productAuth']}
        elementType={['input', 'textarea', 'input']}
        buttontext={['등록']}
        buttonColor={[]}
        labelTrue={true}
        hashtrue={true}
        image="true"
      />
      <style jsx>{`
        .uploadwrap {
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          max-width: 40rem;
          box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
          margin: auto;
          margin-top: 2rem;
          padding: 2.5rem;
          padding-bottom: 10px;
          padding-top: 2rem;
        }
        .upload_image-wrap {
          display: flex;
        }
        .upload_image {
          position: relative;
          display: flex;
          border: 2px dashed gray;
          border-radius: 0.375rem;
          width: 400px;
          height: 400px;

          svg {
            width: 50%;
            height: 50%;
          }

          img {
            width: 50%;
            height: 50%;
          }

          label {
            width: 100%;
            height: 100%;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          :hover {
            color: orange;
            border-color: orange;
          }
        }
        .upload_input {
          margin-top: 3rem;
        }
      `}</style>
    </div>
  );
};

export default Upload;
// 'use client';

// import { useState } from 'react';
// import MediaCanvas from '@app/upload/_component/MediaCanvas';
// import MetadataEditor from '@app/upload/_component/MetaDataEditor';
// import { useSearchParams } from 'next/navigation';
// export type UploadImageItem = {
//   file: File; // 백엔드/S3 전송용 실제 바이너리 파일
//   preview: string; // 화면에 그리기 위한 로컬 미리보기 URL
// };
// export default function UploadPage() {
//   const [images, setImages] = useState<UploadImageItem[]>([]);
//   const searchParams = useSearchParams();
//   const initialType =
//     (searchParams.get('type') as 'product' | 'board') || 'product';
//   const [uploadType, setUploadTpye] = useState(initialType);
//   return (
//     // py-6 -> py-4 로 상하 여백 축소
//     // 화면 높이에 맞게 flex 컨테이너 최적화
//     <div className="min-h-[calc(100vh-76px)] bg-[#f4f5f7] flex items-center justify-center py-4 px-4 sm:px-6">
//       <main className="w-full max-w-[1200px]">
//         {/* mb-5 -> mb-4 로 간격 축소 */}
//         <div className="flex items-end justify-between mb-4 px-2">
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
//               새 작업물 게시
//             </h1>
//             <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
//               최대 3장의 이미지를 업로드하고 순서를 변경해 갤러리를
//               구성해보세요.
//             </p>
//           </div>
//         </div>

//         {/* 좌우 패널 갭 유지 */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
//           <MediaCanvas images={images} setImages={setImages} />
//           <MetadataEditor
//             images={images}
//             uploadType={uploadType}
//             setUploadType={setUploadTpye}
//           />
//         </div>
//       </main>
//     </div>
//   );
// }
