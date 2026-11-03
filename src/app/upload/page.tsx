// 'use client';
// import type { NextPage } from 'next';
// import { useState, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import { useForm } from 'react-hook-form';
// import { useMutation } from '@tanstack/react-query';
// import { Product } from '@prisma/client';
// import axios from 'axios';

// import UploadImage from '@app/_components/uploadImage';

// interface UploadProductForm {
//   image: FileList;
//   title: string;
//   description?: string;
//   productAuth: boolean;
//   ratio: number;
// }

// interface UploadProductResponse {
//   ok: boolean;
//   product: Product;
//   error?: string;
//   message?: string;
// }
// const Upload: NextPage = () => {
//   const [imagePreview, setImagePreview] = useState('');
//   const [hashtag, setHashtag] = useState<string[]>([]);
//   const ratioRef = useRef('');
//   const imgInputRef = useRef<JSX.Element>(null);
//   const imgref = useRef<HTMLImageElement>(null);

//   const router = useRouter();

//   return (
//     <div className="uploadwrap">
//       <UploadImage
//         url="product/upload"
//         component={['title', 'description', 'productAuth']}
//         elementType={['input', 'textarea', 'input']}
//         buttontext={['등록']}
//         buttonColor={[]}
//         labelTrue={true}
//         hashtrue={true}
//         image="true"
//       />
//       <style jsx>{`
//         .uploadwrap {
//           display: flex;
//           justify-content: center;
//           flex-direction: column;
//           align-items: center;
//           max-width: 40rem;
//           box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
//           margin: auto;
//           margin-top: 2rem;
//           padding: 2.5rem;
//           padding-bottom: 10px;
//           padding-top: 2rem;
//         }
//         .upload_image-wrap {
//           display: flex;
//         }
//         .upload_image {
//           position: relative;
//           display: flex;
//           border: 2px dashed gray;
//           border-radius: 0.375rem;
//           width: 400px;
//           height: 400px;

//           svg {
//             width: 50%;
//             height: 50%;
//           }

//           img {
//             width: 50%;
//             height: 50%;
//           }

//           label {
//             width: 100%;
//             height: 100%;
//             cursor: pointer;
//             display: flex;
//             justify-content: center;
//             align-items: center;
//           }
//           :hover {
//             color: orange;
//             border-color: orange;
//           }
//         }
//         .upload_input {
//           margin-top: 3rem;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Upload;
'use client';

import ProductEditor from '@app/upload/_component/ProductEditor';

export type UploadImageItem = {
  file: File; // 백엔드/S3 전송용 실제 바이너리 파일
  preview: string; // 화면에 그리기 위한 로컬 미리보기 URL
};
export default function UploadPage() {
  return <ProductEditor mode="create" />;
}
