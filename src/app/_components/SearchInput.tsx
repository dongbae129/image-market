'use client';

import { useState } from 'react';
import {
  ChevronDown,
  Search,
  Image as ImageIcon,
  FileText
} from 'lucide-react';

type SearchType = 'feen' | 'board';

export default function SearchBox() {
  const [searchType, setSearchType] = useState<SearchType>('feen');
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel = searchType === 'feen' ? 'Feen' : '게시판';

  return (
    <div className="relative w-full max-w-2xl">
      {/* Search Bar */}
      <div
        className="
          flex h-12 items-center
          rounded-full
          border border-gray-200
          bg-white
          px-2
          shadow-sm
          transition
          focus-within:border-gray-300
          focus-within:shadow-md
        "
      >
        {/* Search Type Selector */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="
            flex h-9 w-[108px] shrink-0
            items-center
            rounded-full
            bg-gray-100
            px-3
            transition
            hover:bg-gray-200
          "
        >
          {searchType === 'feen' ? (
            <ImageIcon size={16} strokeWidth={2} />
          ) : (
            <FileText size={16} strokeWidth={2} />
          )}

          <span className="flex-1 text-center text-sm font-medium text-gray-800">
            {selectedLabel}
          </span>

          <ChevronDown
            size={15}
            strokeWidth={2}
            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Search Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="검색어를 입력하세요."
          className="
            min-w-0
            flex-1
            bg-transparent
            px-4
            text-sm
            text-gray-900
            outline-none
            placeholder:text-gray-400
          "
        />

        {/* Search Button */}
        <button
          type="button"
          className="
            flex h-9 w-9 shrink-0
            items-center justify-center
            rounded-full
            text-gray-600
            transition
            hover:bg-gray-100
          "
        >
          <Search size={20} strokeWidth={2} />
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="
            absolute left-2 top-14 z-50
            w-[108px]
            overflow-hidden
            rounded-xl
            border border-gray-200
            bg-white
            p-1
            shadow-lg
          "
        >
          <button
            type="button"
            onClick={() => {
              setSearchType('feen');
              setIsOpen(false);
            }}
            className={`
              flex w-full items-center
              gap-2
              rounded-lg
              px-3 py-2.5
              text-sm
              transition
              ${
                searchType === 'feen'
                  ? 'bg-gray-100 font-medium text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            <ImageIcon size={16} />

            <span className="flex-1 text-left">Feen</span>

            {searchType === 'feen' && <span className="text-xs">✓</span>}
          </button>

          <button
            type="button"
            onClick={() => {
              setSearchType('board');
              setIsOpen(false);
            }}
            className={`
              flex w-full items-center
              gap-2
              rounded-lg
              px-3 py-2.5
              text-sm
              transition
              ${
                searchType === 'board'
                  ? 'bg-gray-100 font-medium text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            <FileText size={16} />

            <span className="flex-1 text-left">게시판</span>

            {searchType === 'board' && <span className="text-xs">✓</span>}
          </button>
        </div>
      )}
    </div>
  );
}
