'use client';

import { useEffect, useState } from 'react';

const slides = [
  {
    badge: '🔥 TRENDING',
    badgeClassName: 'bg-rose-50 text-rose-600'
  },
  {
    badge: '👑 SPOTLIGHT',
    badgeClassName: 'bg-amber-50 text-amber-600'
  },
  {
    badge: '🎁 EVENT',
    badgeClassName: 'bg-indigo-50 text-indigo-600'
  },
  {
    badge: '💡 TIP',
    badgeClassName: 'bg-emerald-50 text-emerald-600'
  }
];

export default function TrendingCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const intervalId = window.setInterval(() => {
      setCurrentSlide((slide) => (slide + 1) % slides.length);
    }, 3500);

    return () => window.clearInterval(intervalId);
  }, [isPaused]);

  const slideClassName = (index: number) =>
    `absolute inset-0 flex transition-all duration-500 ease-in-out ${
      currentSlide === index
        ? 'pointer-events-auto translate-y-0 opacity-100'
        : 'pointer-events-none translate-y-2 opacity-0'
    }`;

  return (
    <section
      className="flex h-[148px] flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="z-10 mb-2 flex items-center justify-between">
        <span
          className={`rounded-md px-2 py-0.5 text-[10px] font-bold transition-all duration-300 ${slides[currentSlide].badgeClassName}`}
        >
          {slides[currentSlide].badge}
        </span>
        <div className="flex items-center gap-1.5" aria-label="트렌드 페이지">
          {slides.map((slide, index) => (
            <button
              key={slide.badge}
              type="button"
              aria-label={`${index + 1}번 트렌드 슬라이드`}
              onClick={() => setCurrentSlide(index)}
              className={
                currentSlide === index
                  ? 'h-2 w-2.5 rounded-full bg-slate-900 transition-all duration-300'
                  : 'h-1.5 w-1.5 rounded-full bg-slate-200 transition-all duration-300'
              }
            />
          ))}
        </div>
      </div>

      <div className="relative w-full flex-1 overflow-hidden">
        <div className={`${slideClassName(0)} flex-col justify-center p-1`}>
          <p className="mb-2 text-xs font-bold text-slate-900">
            실시간 인기 태그
          </p>
          <div className="flex flex-wrap gap-1.5">
            {['#여름풍경', '#3D아트', '#아이폰배경', '#캐릭터'].map((tag) => (
              <button
                key={tag}
                type="button"
                className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-600"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div
          className={`${slideClassName(1)} items-center justify-between p-1`}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-lg ring-2 ring-amber-400">
              <img
                className="w-full h-full object-cover rounded-full"
                src="localimages/janmang.jpg"
                alt=""
              />
            </span>
            <div>
              <p className="text-xs font-bold text-slate-900">Studio Alex</p>
              <p className="text-[11px] font-medium text-slate-400">
                팔로워 12.4k명
              </p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-600"
          >
            + 팔로우
          </button>
        </div>

        <div
          className={`${slideClassName(2)} items-center justify-between p-1`}
        >
          <div>
            <p className="text-xs font-bold text-slate-900">
              친구 초대하고{' '}
              <span className="font-extrabold text-indigo-600">500 코인</span>{' '}
              받기
            </p>
            <p className="text-[11px] font-medium text-slate-400">
              초대 링크로 가입 시 양쪽 적립!
            </p>
          </div>
          <button
            type="button"
            className="flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700"
          >
            ⧉ 복사
          </button>
        </div>

        <div
          className={`${slideClassName(3)} items-center justify-between p-1`}
        >
          <div>
            <p className="text-xs font-bold text-slate-900">빠른 검색 단축키</p>
            <p className="text-[11px] font-medium text-slate-500">
              <kbd className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-bold text-slate-700">
                ⌘K
              </kbd>{' '}
              로 언제든 검색창을 열어보세요.
            </p>
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-sm font-bold text-emerald-800">
            💡
          </span>
        </div>
      </div>
    </section>
  );
}
