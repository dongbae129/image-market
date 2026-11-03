'use client';

import React, { useState, KeyboardEvent } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Globe, X, Rocket, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { UploadImageItem } from '@/app/upload/page';
import { privateApi } from '@libs/client/axiosIntercepotr';

const BOARD_CATEGORIES = [
  '작품 피드백',
  '노하우 & 팁',
  '자유수다',
  '협업/구인',
  '공지사항'
];
type UploadType = 'product' | 'board';

interface MetadataEditorProps {
  images: UploadImageItem[];
  uploadType: UploadType;
  setUploadType: (type: UploadType) => void;
}

export default function MetadataEditor({
  images,
  uploadType,
  setUploadType
}: MetadataEditorProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(BOARD_CATEGORIES[0]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleTabSwitch = (newType: UploadType) => {
    setUploadType(newType);
    router.replace(`${pathname}?type=${newType}`, { scroll: false });
  };

  const handleAddTag = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const trimmed = tagInput.trim().replace(/^#/, '');
      if (trimmed && !tags.includes(trimmed)) {
        setTags([...tags, trimmed]);
        setTagInput('');
      }
    }
  };
  const modifyCategory = (category: string) => {
    const data = category.replace(/[\s&/]/g, '');
    return data;
  };

  // ⭐ FormData 전송 방식으로 변경
  const uploadMutation = useMutation({
    mutationFn: async () => {
      const endpoint = `/api/${uploadType}`;

      // JSON 객체 대신 멀티파트 폼데이터 생성
      // const formData = new FormData();
      // formData.append('title', title);
      // formData.append('description', description);

      // if (uploadType === 'board') {
      //   formData.append('category', modifyCategory(category));
      // }

      // // 태그 배열은 서버 파싱 방식에 따라 다름 (여기선 다중 append 방식)
      const hashtags = tags.join(',');
      // formData.append('hashtag', hashtags);
      // // ⭐ 실제 파일 객체(File)를 순서대로 FormData에 담음
      // images.forEach((item) => {
      //   formData.append('images', item.file);
      // });
      // console.log(images, 'imageeess');
      const fileInfos = images.map((value) => {
        const fileName = value.file.name;
        return {
          name: fileName,
          ext: fileName.split('.').pop()?.toLowerCase() as string
        };
      });

      const { data }: { data: { ok: boolean; tickets: any[] } } =
        await privateApi.post(`api/product/init`, { fileInfos });

      type TicketType = {
        url: string;
        fields: string;
        tempUrl: string;
      };
      const urls = data.tickets.map((v: TicketType) => ({
        url: v.tempUrl
      }));
      const s3UploadPromise = data.tickets.map((v, i) => {
        const s3Form = new FormData();
        s3Form.append('Content-Type', `image/${fileInfos[i].ext}`);
        Object.entries(v.fields).forEach(([k, v]) => {
          s3Form.append(k, v);
        });
        s3Form.append('file', images[i].file);
        return axios.post(v.url, s3Form);
      });
      await Promise.all(s3UploadPromise);
      await privateApi.post(endpoint, {
        title,
        description,
        hashtags,
        category: uploadType === 'board' ? modifyCategory(category) : null,
        urls
      });
      return;
      const setFileFormData = (fileForm: FormData, index: number) => {
        // const fileType = fileData.name.split('.').pop()?.toLowerCase();
        const fileType = data.tickets[index].tempUrl
          .split('.')
          .pop()
          ?.toLowerCase();
        fileForm.append('Content-Type', `image/${fileType}`);
        const fields: Record<string, string> = data.tickets[index].fields;
        Object.entries(fields).forEach(([k, v]) => {
          fileForm.append(k, v);
        });
        fileForm.append('file', images[index].file);
      };
      const s3FormData = new FormData();
      console.log(s3FormData, 's3FormData');
      // const uploadS3Promise = data.tickets.map((v, i: number) => {
      //   const s3UploadData = setFileFormData(s3FormData, i);
      //   return axios.post(v.url, s3UploadData);
      // });
      // await Promise.all(uploadS3Promise);
      // console.log(images, 'upload data test');
      // formData.keys().forEach((v) => console.log(formData.get(v)));
      // axios는 FormData가 들어오면 자동으로 Content-Type을 'multipart/form-data'로 세팅해줍니다.
      // const response = await axios.post(endpoint, formData, {
      //   onUploadProgress: (progressEvent) => {
      //     if (progressEvent.total) {
      //       const percentCompleted = Math.round(
      //         (progressEvent.loaded * 100) / progressEvent.total
      //       );
      //       setUploadProgress(percentCompleted);
      //     }
      //   }
      // });

      // return response.data;
    },
    onSuccess: () => {
      setUploadProgress(100);
      // setTimeout(() => {
      //   alert(`${uploadType === 'product' ? '작품이' : '게시글이'} 성공적으로 게시되었습니다!`);
      //   router.push(uploadType === 'product' ? '/' : '/board');
      // }, 300);
    },
    onError: (error) => {
      setUploadProgress(0);
      console.error('Upload Error:', error);
      alert('업로드에 실패했습니다. 다시 시도해주세요.');
    }
  });

  const handleSubmit = () => {
    if (uploadType === 'product' && images.length === 0) {
      alert('최소 1장의 이미지가 필요합니다.');
      return;
    }
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    setUploadProgress(0);
    // FormData 구조체계로 변경되었으므로 인자 없이 mutate() 호출
    uploadMutation.mutate();
  };

  return (
    <div className="lg:col-span-7 bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col h-[580px]">
      {/* 상단 탭 스위치 */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <div className="bg-slate-100/80 p-1.5 rounded-xl inline-flex items-center">
          <button
            onClick={() => handleTabSwitch('product')}
            className={`px-4 py-1.5 rounded-lg text-xs transition-all ${uploadType === 'product' ? 'font-extrabold bg-white text-slate-900 shadow-sm' : 'font-bold text-slate-500 hover:text-slate-900'}`}
          >
            작품 갤러리
          </button>
          <button
            onClick={() => handleTabSwitch('board')}
            className={`px-4 py-1.5 rounded-lg text-xs transition-all ${uploadType === 'board' ? 'font-extrabold bg-white text-slate-900 shadow-sm' : 'font-bold text-slate-500 hover:text-slate-900'}`}
          >
            게시판
          </button>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
          <Globe className="w-3.5 h-3.5" /> 전체 공개
        </button>
      </div>

      <div className="flex-1 flex flex-col space-y-4 overflow-y-auto no-scrollbar pb-2">
        {uploadType === 'board' && (
          <div className="space-y-1.5 mb-2">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              게시판 카테고리
            </label>
            <div className="flex flex-wrap gap-1.5">
              {BOARD_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${category === cat ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={
              uploadType === 'product'
                ? '멋진 작품의 제목을 지어주세요'
                : '게시글 제목을 입력해주세요'
            }
            className="w-full text-2xl sm:text-3xl font-extrabold text-slate-900 placeholder:text-slate-300 bg-transparent border-none p-0 no-ring"
          />
        </div>

        <div className="flex-1 min-h-[100px]">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="이야기를 자세히 들려주세요..."
            className="w-full h-full text-sm font-medium text-slate-600 placeholder:text-slate-300 bg-slate-50/50 hover:bg-slate-50 focus:bg-slate-50 rounded-xl border border-transparent focus:border-slate-200 p-4 no-ring resize-none transition-colors"
          ></textarea>
        </div>

        <div>
          <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
            태그 (Keywords)
          </label>
          <div className="flex flex-wrap items-center gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-bold shadow-sm"
              >
                #{tag}{' '}
                <X
                  onClick={() => setTags(tags.filter((t) => t !== tag))}
                  className="w-3 h-3 cursor-pointer hover:text-rose-400"
                />
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="+ 새 태그 입력..."
              className="w-full bg-transparent border-none text-xs font-bold text-slate-700 placeholder:text-slate-400 p-1 no-ring w-28"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
        <button className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
          취소
        </button>
        <div className="flex gap-2">
          <button
            disabled={uploadMutation.isPending}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 rounded-lg shadow-sm transition-all"
          >
            임시저장
          </button>

          <button
            onClick={handleSubmit}
            disabled={uploadMutation.isPending}
            className="relative overflow-hidden px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white text-xs font-extrabold rounded-lg shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] transition-all flex items-center gap-1.5"
          >
            {uploadMutation.isPending && (
              <div
                className="absolute left-0 top-0 bottom-0 bg-indigo-800 transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {uploadMutation.isPending ? (
                <>
                  업로드 중... {uploadProgress}%{' '}
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                </>
              ) : (
                <>
                  작성하기
                  <Rocket className="w-3.5 h-3.5" />
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
