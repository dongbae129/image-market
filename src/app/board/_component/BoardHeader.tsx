'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Gem, Upload, Bell } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();

  // 현재 페이지 경로에 따라 HOME / BOARD 활성화 여부 판별
  const isHomeActive = pathname === '/';
  const isBoardActive = pathname.startsWith('/board');

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-6 py-3.5 flex items-center justify-between gap-6">
        {/* 1. Logo & Left Navigation (HOME, BOARD) */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 via-rose-400 to-indigo-500 flex items-center justify-center shadow-xs">
              <div className="w-3.5 h-3.5 bg-white rounded-full" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900">
              Pinz
            </span>
          </Link>

          {/* HOME & BOARD: 호버 효과 + 클릭/활성화 시 하단 라인 효과 적용 */}
          <nav className="flex items-center gap-6 font-bold text-sm">
            {/* HOME */}
            <Link
              href="/"
              className={`relative py-1.5 transition-colors ${
                isHomeActive
                  ? 'text-slate-900'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              HOME
              {isHomeActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-slate-900 rounded-full" />
              )}
            </Link>

            {/* BOARD */}
            <Link
              href="/board"
              className={`relative py-1.5 transition-colors ${
                isBoardActive
                  ? 'text-slate-900'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              BOARD
              {isBoardActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-slate-900 rounded-full" />
              )}
            </Link>
          </nav>
        </div>

        {/* 2. Center Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="검색어를 입력하세요..."
              className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-sm pl-11 pr-12 py-2.5 rounded-full border border-transparent focus:border-slate-300 transition outline-none font-medium text-slate-700 placeholder:text-slate-400"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-slate-400 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
              ⌘K
            </span>
          </div>
        </div>

        {/* 3. Right Action Utilities (PAY, UPLOAD) */}
        {/* PAY, UPLOAD: 클릭해도 하단 라인 효과가 생성되지 않음 */}
        <div className="flex items-center gap-4 font-bold text-sm">
          {/* PAY */}
          <Link
            href="/payment"
            className="px-3 py-2 text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-full flex items-center gap-1.5 transition-colors"
          >
            <Gem className="w-4 h-4 text-indigo-500" /> PAY
          </Link>

          {/* UPLOAD */}
          <Link
            href="/upload?type=product"
            className="px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white rounded-full flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
          >
            <Upload className="w-4 h-4" /> UPLOAD
          </Link>

          {/* 알림 & 프로필 */}
          <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
            <button className="relative text-slate-600 hover:text-slate-900 transition p-1.5 rounded-full hover:bg-slate-100">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
            </button>
            <Link
              href="/profile"
              className="w-9 h-9 rounded-full bg-pink-100 p-0.5 border border-slate-200 overflow-hidden hover:opacity-90 transition"
            >
              <img
                src="localimages/emptyuser2.png"
                alt="Avatar"
                className="w-full h-full object-cover rounded-full"
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
