'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  // Hydration 에러 방지: 클라이언트에서 마운트된 후에만 렌더링되도록 처리
  useEffect(() => {
    setMounted(true);
  }, []);

  // 마운트 전(서버 렌더링 시점)에는 UI가 깨지지 않게 빈 박스(스켈레톤)를 보여줌
  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle Dark Mode"
      className="relative flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-300 overflow-hidden"
    >
      {/* ☀️ 해 아이콘 (라이트 모드일 때 보임) */}
      <Sun
        className={`absolute w-5 h-5 text-amber-500 transition-all duration-500 ease-in-out ${
          isDark
            ? 'opacity-0 rotate-90 scale-50'
            : 'opacity-100 rotate-0 scale-100'
        }`}
      />

      {/* 🌙 달 아이콘 (다크 모드일 때 보임) */}
      <Moon
        className={`absolute w-5 h-5 text-slate-300 transition-all duration-500 ease-in-out ${
          isDark
            ? 'opacity-100 rotate-0 scale-100'
            : 'opacity-0 -rotate-90 scale-50'
        }`}
      />
    </button>
  );
}
