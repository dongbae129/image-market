'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const CATEGORIES = [
  '전체글',
  '🔥 인기글',
  '🎨 작품 피드백',
  '💡 노하우 & 팁',
  '💬 자유수다',
  '🤝 협업/구인',
  '📢 공지사항',
  '❓ 질문',
  '🖼️ 이미지 요청'
];

export default function BoardCategoryNav() {
  const [activeCategory, setActiveCategory] = useState('전체글');

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full font-bold text-xs shrink-0 transition ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
        <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50">
          최신 작성순 <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    </div>
  );
}
