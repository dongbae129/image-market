// 'use client';

// import React, { useRef, useState, ChangeEvent, DragEvent } from 'react';
// import { ImagePlus, RefreshCw, X, Plus, Star } from 'lucide-react';

// const MAX_IMAGES = 3;

// interface MediaCanvasProps {
//   images: string[];
//   setImages: React.Dispatch<React.SetStateAction<string[]>>;
// }

// export default function MediaCanvas({ images, setImages }: MediaCanvasProps) {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
//   const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

//   const fileAddRef = useRef<HTMLInputElement>(null);
//   const fileReplaceRef = useRef<HTMLInputElement>(null);

//   // 1. 이미지 추가 (⭐ 최대 갯수 제한 및 배열 Slice 로직 적용)
//   const handleAddFiles = async (e: ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
//     if (!files.length) return;

//     const availableSlots = MAX_IMAGES - images.length;
//     const allowedFiles = files.slice(0, availableSlots);

//     if (files.length > availableSlots) {
//       alert(
//         `최대 ${MAX_IMAGES}장까지만 업로드할 수 있습니다. 초과된 파일은 제외되었습니다.`
//       );
//     }

//     if (allowedFiles.length === 0) return;

//     // FileReader를 Promise 배열로 처리하여 비동기 꼬임 방지
//     const readFiles = allowedFiles.map((file) => {
//       return new Promise<string>((resolve) => {
//         const reader = new FileReader();
//         reader.onload = (event) => resolve(event.target?.result as string);
//         reader.readAsDataURL(file);
//       });
//     });

//     const newBase64Images = await Promise.all(readFiles);

//     setImages((prev) => {
//       const updatedImages = [...prev, ...newBase64Images];
//       setCurrentIndex(updatedImages.length - 1); // 가장 마지막에 추가된 이미지 보여주기
//       return updatedImages;
//     });

//     e.target.value = ''; // input 초기화
//   };

//   // 2. 이미지 교체 (현재 보고 있는 캔버스)
//   const handleReplaceFile = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (event) => {
//       setImages((prev) => {
//         const newImages = [...prev];
//         newImages[currentIndex] = event.target?.result as string;
//         return newImages;
//       });
//     };
//     reader.readAsDataURL(file);
//     e.target.value = '';
//   };

//   // 3. 이미지 삭제
//   const handleRemoveImage = (index: number, e: React.MouseEvent) => {
//     e.stopPropagation();
//     setImages((prev) => {
//       const newImages = [...prev];
//       newImages.splice(index, 1);

//       if (newImages.length === 0) setCurrentIndex(0);
//       else if (currentIndex >= newImages.length)
//         setCurrentIndex(newImages.length - 1);
//       else if (currentIndex > index) setCurrentIndex(currentIndex - 1);

//       return newImages;
//     });
//   };

//   // 4. Drag & Drop 로직
//   const handleDragStart = (idx: number, e: DragEvent<HTMLDivElement>) => {
//     setDraggedIndex(idx);
//     e.dataTransfer.effectAllowed = 'move';
//   };
//   const handleDragEnter = (idx: number, e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setDragOverIndex(idx);
//   };
//   const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setDragOverIndex(null);
//   };
//   const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//   };
//   const handleDrop = (targetIdx: number, e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setDragOverIndex(null);

//     if (draggedIndex !== null && draggedIndex !== targetIdx) {
//       setImages((prev) => {
//         const newImages = [...prev];
//         const [movedItem] = newImages.splice(draggedIndex, 1);
//         newImages.splice(targetIdx, 0, movedItem);
//         return newImages;
//       });
//       setCurrentIndex(targetIdx);
//     }
//     setDraggedIndex(null);
//   };

//   return (
//     // h-[600px] -> h-[540px] (화면 짤림 방지)
//     <div className="lg:col-span-5 bg-white rounded-[2rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col h-[540px]">
//       <input
//         ref={fileAddRef}
//         type="file"
//         multiple
//         accept="image/*"
//         className="hidden"
//         onChange={handleAddFiles}
//       />
//       <input
//         ref={fileReplaceRef}
//         type="file"
//         accept="image/*"
//         className="hidden"
//         onChange={handleReplaceFile}
//       />

//       {/* [1] 메인 대형 프리뷰 캔버스 */}
//       {images.length === 0 ? (
//         <div
//           onClick={() => fileAddRef.current?.click()}
//           className="relative flex-1 group cursor-pointer overflow-hidden rounded-[1.5rem] border-2 border-dashed border-slate-300 bg-slate-50/50 hover:bg-indigo-50/30 hover:border-indigo-400 transition-all duration-300 flex flex-col items-center justify-center text-center"
//         >
//           <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:text-indigo-600 transition-all">
//             <ImagePlus className="w-7 h-7 text-slate-400 group-hover:text-indigo-500 transition-colors" />
//           </div>
//           <h3 className="text-base font-extrabold text-slate-900 mb-1">
//             여기를 클릭하여 이미지 업로드
//           </h3>
//           <p className="text-xs font-medium text-slate-500 max-w-[200px]">
//             한 번에 여러 장 선택 가능 (최대 {MAX_IMAGES}장)
//           </p>
//         </div>
//       ) : (
//         <div
//           onClick={() => fileReplaceRef.current?.click()}
//           className="relative flex-1 group cursor-pointer overflow-hidden rounded-[1.5rem] border border-slate-100 bg-slate-950 transition-all duration-300 flex flex-col items-center justify-center text-center shadow-inner"
//         >
//           {currentIndex === 0 && (
//             <span className="absolute top-4 left-4 bg-indigo-500 text-white text-xs font-extrabold px-3 py-1.5 rounded-lg shadow-md tracking-wider z-10 flex items-center gap-1">
//               <Star className="w-3 h-3 fill-current" /> 대표 이미지
//             </span>
//           )}
//           <img
//             src={images[currentIndex]}
//             alt="Main Preview"
//             className="absolute inset-0 w-full h-full object-contain opacity-90 transition-transform duration-500"
//           />
//           <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center backdrop-blur-sm z-20">
//             <div className="px-5 py-2.5 bg-white text-slate-900 rounded-full text-xs font-extrabold shadow-lg flex items-center gap-2 hover:scale-105 transition-transform">
//               <RefreshCw className="w-4 h-4 text-indigo-500" /> 클릭하여 이미지
//               교체
//             </div>
//           </div>
//         </div>
//       )}

//       {/* [2] 하단 썸네일 스트립 */}
//       <div className="mt-4 flex items-center gap-3 px-1 overflow-x-auto no-scrollbar pb-1 min-h-[5rem]">
//         {images.map((src, idx) => {
//           const isCover = idx === 0;
//           const isActive = idx === currentIndex;
//           const isDragOver = idx === dragOverIndex;
//           const isDragged = idx === draggedIndex;

//           return (
//             <div
//               key={`${src}-${idx}`}
//               draggable
//               onDragStart={(e) => handleDragStart(idx, e)}
//               onDragOver={handleDragOver}
//               onDragEnter={(e) => handleDragEnter(idx, e)}
//               onDragLeave={handleDragLeave}
//               onDrop={(e) => handleDrop(idx, e)}
//               onDragEnd={() => setDraggedIndex(null)}
//               onClick={() => setCurrentIndex(idx)}
//               className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 overflow-hidden shrink-0 group cursor-grab active:cursor-grabbing transition-all duration-200
//                 ${isActive ? 'border-indigo-500 shadow-md' : 'border-slate-200 opacity-60 hover:opacity-100 hover:border-indigo-300'}
//                 ${isDragOver ? 'scale-105 border-indigo-500 shadow-[0_4px_14px_0_rgba(99,102,241,0.39)]' : ''}
//                 ${isDragged ? 'opacity-30' : ''}
//               `}
//             >
//               {isCover && (
//                 <span className="absolute top-0 left-0 bg-indigo-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-br-lg shadow-sm tracking-wider z-10 pointer-events-none">
//                   COVER
//                 </span>
//               )}
//               <img
//                 src={src}
//                 alt={`Thumb ${idx}`}
//                 className="w-full h-full object-cover pointer-events-none"
//               />
//               <button
//                 onClick={(e) => handleRemoveImage(idx, e)}
//                 className="absolute top-1.5 right-1.5 w-5 h-5 bg-black/60 hover:bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md z-20"
//               >
//                 <X className="w-3 h-3 pointer-events-none" />
//               </button>
//             </div>
//           );
//         })}

//         {/* 추가 버튼 (갯수 제한 연동) */}
//         {images.length < MAX_IMAGES && (
//           <button
//             onClick={() => fileAddRef.current?.click()}
//             className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:text-indigo-500 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all shrink-0"
//           >
//             <Plus className="w-5 h-5 mb-0.5" />
//             <span className="text-[10px] font-bold">
//               {images.length}/{MAX_IMAGES}
//             </span>
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }
'use client';

import React, { useRef, useState, ChangeEvent, DragEvent } from 'react';
import { ImagePlus, RefreshCw, X, Plus, Star } from 'lucide-react';
import { UploadImageItem } from '@/app/upload/page';

const MAX_IMAGES = 3;

interface MediaCanvasProps {
  images: UploadImageItem[];
  setImages: React.Dispatch<React.SetStateAction<UploadImageItem[]>>;
}

export default function MediaCanvas({ images, setImages }: MediaCanvasProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const fileAddRef = useRef<HTMLInputElement>(null);
  const fileReplaceRef = useRef<HTMLInputElement>(null);

  // 1. 이미지 추가 (URL.createObjectURL 사용)
  const handleAddFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const availableSlots = MAX_IMAGES - images.length;
    const allowedFiles = files.slice(0, availableSlots);

    if (files.length > availableSlots) {
      alert(`최대 ${MAX_IMAGES}장까지만 업로드할 수 있습니다.`);
    }

    // ⭐ 실제 파일 객체 보존 + 가벼운 미리보기 URL 생성
    const newItems: UploadImageItem[] = allowedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    const updatedImages = [...images, ...newItems];
    setImages(updatedImages);
    setCurrentIndex(updatedImages.length - 1);

    e.target.value = '';
  };

  // 2. 이미지 교체
  const handleReplaceFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이전 메모리 누수 방지
    URL.revokeObjectURL(images[currentIndex].preview);
    const newImages = [...images];
    newImages[currentIndex] = {
      file,
      preview: URL.createObjectURL(file)
    };
    setImages(newImages);
    e.target.value = '';
  };

  // 3. 이미지 삭제 (메모리 해제 포함)
  const handleRemoveImage = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();

    // 메모리 릭(Leak) 방지: 브라우저 캐시에서 URL 해제
    URL.revokeObjectURL(images[index].preview);
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    if (newImages.length === 0) setCurrentIndex(0);
    else if (currentIndex >= newImages.length)
      setCurrentIndex(newImages.length - 1);
    else if (currentIndex > index) setCurrentIndex(currentIndex - 1);
  };

  // Drag & Drop 로직 (동일)
  const handleDragStart = (idx: number, e: DragEvent<HTMLDivElement>) => {
    setDraggedIndex(idx);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragEnter = (idx: number, e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverIndex(idx);
  };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverIndex(null);
  };
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (targetIdx: number, e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverIndex(null);
    if (draggedIndex !== null && draggedIndex !== targetIdx) {
      setImages((prev) => {
        const newImages = [...prev];
        const [movedItem] = newImages.splice(draggedIndex, 1);
        newImages.splice(targetIdx, 0, movedItem);
        return newImages;
      });
      setCurrentIndex(targetIdx);
    }
    setDraggedIndex(null);
  };

  return (
    <div className="lg:col-span-5 bg-white rounded-[2rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col h-[580px]">
      <input
        ref={fileAddRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleAddFiles}
      />
      <input
        ref={fileReplaceRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleReplaceFile}
      />

      {images.length === 0 ? (
        <div
          onClick={() => fileAddRef.current?.click()}
          className="relative flex-1 group cursor-pointer overflow-hidden rounded-[1.5rem] border-2 border-dashed border-slate-300 bg-slate-50/50 hover:bg-indigo-50/30 hover:border-indigo-400 transition-all duration-300 flex flex-col items-center justify-center text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:text-indigo-600 transition-all">
            <ImagePlus className="w-6 h-6 text-slate-400 group-hover:text-indigo-500 transition-colors" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900 mb-1">
            여기를 클릭하여 이미지 업로드
          </h3>
          <p className="text-[11px] font-medium text-slate-500">
            최대 {MAX_IMAGES}장
          </p>
        </div>
      ) : (
        <div
          onClick={() => fileReplaceRef.current?.click()}
          className="relative flex-1 group cursor-pointer overflow-hidden rounded-[1.5rem] border border-slate-100 bg-slate-950 transition-all duration-300 flex flex-col items-center justify-center text-center shadow-inner"
        >
          {currentIndex === 0 && (
            <span className="absolute top-4 left-4 bg-indigo-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-md tracking-wider z-10 flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" /> 대표 이미지
            </span>
          )}
          {/* ⭐ preview 속성으로 이미지 렌더링 */}
          <img
            src={images[currentIndex].preview}
            alt="Main Preview"
            className="absolute inset-0 w-full h-full object-contain opacity-90 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center backdrop-blur-sm z-20">
            <div className="px-4 py-2 bg-white text-slate-900 rounded-full text-xs font-extrabold shadow-lg flex items-center gap-2 hover:scale-105 transition-transform">
              <RefreshCw className="w-3.5 h-3.5 text-indigo-500" /> 이미지 교체
            </div>
          </div>
        </div>
      )}

      {/* 썸네일 스트립 */}
      <div className="mt-3 flex items-center gap-2 px-1 overflow-x-auto no-scrollbar pb-1 min-h-[4.5rem]">
        {images.map((item, idx) => {
          const isCover = idx === 0;
          const isActive = idx === currentIndex;
          const isDragOver = idx === dragOverIndex;
          const isDragged = idx === draggedIndex;

          return (
            <div
              key={`${item.preview}-${idx}`}
              draggable
              onDragStart={(e) => handleDragStart(idx, e)}
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(idx, e)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(idx, e)}
              onDragEnd={() => setDraggedIndex(null)}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-16 h-16 rounded-xl border-2 overflow-hidden shrink-0 group cursor-grab active:cursor-grabbing transition-all duration-200 
                ${isActive ? 'border-indigo-500 shadow-md' : 'border-slate-200 opacity-60 hover:opacity-100 hover:border-indigo-300'}
                ${isDragOver ? 'scale-105 border-indigo-500 shadow-[0_4px_14px_0_rgba(99,102,241,0.39)]' : ''}
                ${isDragged ? 'opacity-30' : ''}
              `}
            >
              {isCover && (
                <span className="absolute top-0 left-0 bg-indigo-500 text-white text-[8px] font-extrabold px-1 rounded-br-md shadow-sm tracking-wider z-10 pointer-events-none">
                  COVER
                </span>
              )}
              <img
                src={item.preview}
                alt={`Thumb ${idx}`}
                className="w-full h-full object-cover pointer-events-none"
              />
              <button
                onClick={(e) => handleRemoveImage(idx, e)}
                className="absolute top-1 right-1 w-4 h-4 bg-black/60 hover:bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md z-20"
              >
                <X className="w-2.5 h-2.5 pointer-events-none" />
              </button>
            </div>
          );
        })}

        {images.length < MAX_IMAGES && (
          <button
            onClick={() => fileAddRef.current?.click()}
            className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:text-indigo-500 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all shrink-0"
          >
            <Plus className="w-4 h-4 mb-0.5" />
            <span className="text-[9px] font-bold">
              {images.length}/{MAX_IMAGES}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
