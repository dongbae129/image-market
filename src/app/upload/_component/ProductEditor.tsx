'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import MediaCanvas from '@app/upload/_component/MediaCanvas';
import MetadataEditor from '@app/upload/_component/MetaDataEditor';
import type { ProductDetailType } from '@app/product/[id]/page';
import type { UploadImageItem } from '@app/upload/page';

type UploadType = 'product' | 'board';
export type BoardEditorData = {
  id: number;
  title: string;
  description: string;
  category: string;
  boardTag: { hashtag: string } | null;
  images: { id: number; image: string }[];
};

type ProductEditorProps = {
  mode: 'create' | 'edit';
  productId?: string;
  initialProduct?: ProductDetailType['product'];
  boardId?: string;
  initialBoard?: BoardEditorData;
  editType?: UploadType;
  defaultUploadType?: UploadType;
};

export default function ProductEditor({
  mode,
  productId,
  initialProduct,
  boardId,
  initialBoard,
  editType,
  defaultUploadType
}: ProductEditorProps) {
  const searchParams = useSearchParams();
  const [images, setImages] = useState<UploadImageItem[]>([]);
  const [removedBoardImageIds, setRemovedBoardImageIds] = useState<number[]>(
    []
  );
  const [uploadType, setUploadType] = useState<UploadType>(() => {
    if (mode === 'edit') return editType ?? 'product';
    return (
      defaultUploadType ??
      (searchParams.get('type') === 'board' ? 'board' : 'product')
    );
  });

  const imageName = initialProduct?.image.endsWith('.jpeg')
    ? initialProduct.image.replace(/\.jpeg$/i, '.jpg')
    : initialProduct?.image;
  const initialImageUrl = imageName
    ? `https://d18ktmttqdka9f.cloudfront.net/736x/${imageName}`
    : undefined;
  const initialBoardImages = initialBoard?.images.map((image) => ({
    id: image.id,
    src: image.image.startsWith('http')
      ? image.image
      : `https://d18ktmttqdka9f.cloudfront.net/474x/${image.image}`
  }));

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[#f4f5f7] flex items-center justify-center py-4 px-4 sm:px-6">
      <main className="w-full max-w-[1200px]">
        <div className="flex items-end justify-between mb-4 px-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {mode === 'edit'
                ? uploadType === 'board'
                  ? '게시글 수정'
                  : '작업물 수정'
                : '새 작업물 게시'}
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
              {mode === 'edit'
                ? uploadType === 'board'
                  ? '게시글 정보와 이미지를 수정할 수 있습니다. 이미지는 최대 3장까지 가능합니다.'
                  : '작업물 정보를 수정하고 이미지를 교체할 수 있습니다.'
                : uploadType === 'product'
                  ? '대표 이미지 한 장과 상품 정보를 등록하세요.'
                  : '최대 3장의 이미지를 업로드하고 순서를 변경해보세요.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
          <MediaCanvas
            images={images}
            setImages={setImages}
            initialImageUrl={initialImageUrl}
            initialImages={initialBoardImages?.filter(
              (image) => !removedBoardImageIds.includes(image.id)
            )}
            onRemoveInitialImage={(imageId) =>
              setRemovedBoardImageIds((current) =>
                current.includes(imageId) ? current : [...current, imageId]
              )
            }
            maxImages={uploadType === 'product' ? 1 : 3}
          />
          <MetadataEditor
            images={images}
            uploadType={uploadType}
            setUploadType={setUploadType}
            mode={mode}
            productId={productId}
            initialProduct={initialProduct}
            boardId={boardId}
            initialBoard={initialBoard}
            removedBoardImageIds={removedBoardImageIds}
          />
        </div>
      </main>
    </div>
  );
}
