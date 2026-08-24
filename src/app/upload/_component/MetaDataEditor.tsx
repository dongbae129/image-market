'use client';

import React, { useState, KeyboardEvent } from 'react';
import { Globe, X, Rocket } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

interface MetadataEditorProps {
  images: string[];
  type: string;
}
type UploadType = 'product' | 'board';
export default function MetadataEditor({ images, type }: MetadataEditorProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploadType, setUploadType] = useState(type);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const BOARD_CATEGORIES = [
    '🎨 작품 피드백',
    '💡 노하우 & 팁',
    '💬 자유수다',
    '🤝 협업/구인',
    '❓ 질문',
    '🖼️ 이미지 요청'
  ];
  const handleTabSwitch = (newType: UploadType) => {
    setUploadType(newType); // UI 즉시 변경

    // router.replace 를 사용하면 뒤로가기 히스토리를 지저분하게 쌓지 않고 URL만 딱 바꿔줍니다.
    router.replace(`${pathname}?type=${newType}`, { scroll: false });
  };
  const [category, setCategory] = useState(BOARD_CATEGORIES[0]);
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

  const handleSubmit = () => {
    if (images.length === 0) {
      alert('최소 1장의 이미지를 업로드해주세요.');
      return;
    }
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    alert('성공적으로 게시되었습니다!');
    console.log({ images, title, description, tags });
  };

  return (
    <div className="lg:col-span-7 bg-white rounded-[2rem] p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col h-[600px]">
      {/* 상단 탭 */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-6">
        <div className="bg-slate-100/80 p-1.5 rounded-2xl inline-flex items-center">
          <button
            onClick={() => handleTabSwitch('product')}
            className={`px-4 py-1.5 rounded-lg text-xs transition-all ${
              uploadType === 'product'
                ? 'font-extrabold bg-white text-slate-900 shadow-sm'
                : 'font-bold text-slate-500 hover:text-slate-900'
            }`}
          >
            작품 갤러리
          </button>
          <button
            onClick={() => handleTabSwitch('board')}
            className={`px-4 py-1.5 rounded-lg text-xs transition-all ${
              uploadType === 'board'
                ? 'font-extrabold bg-white text-slate-900 shadow-sm'
                : 'font-bold text-slate-500 hover:text-slate-900'
            }`}
          >
            커뮤니티 게시판
          </button>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
          <Globe className="w-4 h-4" /> 전체 공개
        </button>
      </div>

      <div className="flex-1 flex flex-col space-y-6 overflow-y-auto no-scrollbar pb-4">
        {/* 2. 게시판 모드일 때만 카테고리 선택 UI 표시 */}
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    category === cat
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
        {/* Title */}
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
            className="w-full text-3xl sm:text-4xl font-extrabold text-slate-900 placeholder:text-slate-300 bg-transparent border-none p-0 no-ring"
          />
        </div>

        {/* Description */}
        <div className="flex-1 min-h-[160px]">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={
              uploadType === 'product'
                ? '작품의 비하인드 스토리, 사용한 소프트웨어, 영감을 받은 곳 등 자세한 이야기를 들려주세요...'
                : '커뮤니티에 공유하고 싶은 이야기를 자유롭게 작성해보세요...'
            }
            className="w-full h-full text-sm font-medium text-slate-600 placeholder:text-slate-300 bg-slate-50/50 hover:bg-slate-50 focus:bg-slate-50 rounded-2xl border border-transparent focus:border-slate-200 p-5 no-ring resize-none transition-colors"
          ></textarea>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">
            태그 (Keywords)
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-sm"
              >
                #{tag}
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
              className="bg-transparent border-none text-xs font-bold text-slate-700 placeholder:text-slate-400 p-1 no-ring w-32"
            />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-auto">
        <button className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors">
          취소
        </button>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm transition-all">
            임시저장
          </button>
          <button
            onClick={handleSubmit}
            className="px-7 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            작성하기
            <Rocket className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
