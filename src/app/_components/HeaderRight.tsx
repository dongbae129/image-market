// import Link from 'next/link';

// export default function HeaderRight() {

//   return (
//     <div className="lg:col-span-4 flex flex-col justify-between gap-4">
//       <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs relative overflow-hidden">
//         <div className="absolute top-0 left-0 right-0 h-16"></div>

//         <div className="relative z-10">
//           <div className="flex items-center gap-3 mb-5 pt-1">
//             <img
//               src="/user_img.jpg"
//               alt="Avatar"
//               className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
//             />
//             <div>
//               <h3 className="font-bold text-slate-900 text-sm">배수민님</h3>
//               <p className="text-xs text-slate-400 font-medium">@bae0258</p>
//             </div>
//           </div>

//           <div className="grid grid-cols-4 gap-2 text-center pt-3 border-t border-slate-100">
//             <div>
//               <div className="text-[11px] font-semibold text-slate-400 mb-0.5">
//                 코인
//               </div>
//               <div className="text-sm font-bold text-slate-800">0</div>
//             </div>
//             <div>
//               <div className="text-[11px] font-semibold text-slate-400 mb-0.5">
//                 게시물
//               </div>
//               <div className="text-sm font-bold text-slate-800">0</div>
//             </div>
//             <div>
//               <div className="text-[11px] font-semibold text-slate-400 mb-0.5">
//                 팔로워
//               </div>
//               <div className="text-sm font-bold text-slate-800">0</div>
//             </div>
//             <div>
//               <div className="text-[11px] font-semibold text-slate-400 mb-0.5">
//                 팔로잉
//               </div>
//               <div className="text-sm font-bold text-slate-800">0</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div
//         id="sidebar-carousel"
//         className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs relative overflow-hidden h-[148px] flex flex-col justify-between group"
//       >
//         <div className="flex items-center justify-between mb-2 z-10">
//           <span
//             id="carousel-badge"
//             className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-600 transition-all duration-300"
//           >
//             🔥 TRENDING
//           </span>

//           <div className="flex items-center gap-1.5">
//             <button className="carousel-dot w-2.5 h-2 rounded-full bg-slate-900 transition-all duration-300"></button>
//             <button className="carousel-dot w-1.5 h-1.5 rounded-full bg-slate-200 transition-all duration-300"></button>
//             <button className="carousel-dot w-1.5 h-1.5 rounded-full bg-slate-200 transition-all duration-300"></button>
//             <button className="carousel-dot w-1.5 h-1.5 rounded-full bg-slate-200 transition-all duration-300"></button>
//           </div>
//         </div>

//         <div className="relative flex-1 w-full overflow-hidden">
//           <div className="carousel-slide p-1 absolute inset-0 flex flex-col justify-center transition-all duration-500 ease-in-out opacity-100 pointer-events-auto translate-y-0">
//             <div className="text-xs font-bold text-slate-900 mb-2">
//               실시간 인기 태그
//             </div>
//             <div className="flex flex-wrap gap-1.5">
//               <Link
//                 href="#"
//                 className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-lg text-xs font-semibold transition"
//               >
//                 #여름풍경
//               </Link>
//               <Link
//                 href="#"
//                 className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-lg text-xs font-semibold transition"
//               >
//                 #3D아트
//               </Link>
//               <Link
//                 href="#"
//                 className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-lg text-xs font-semibold transition"
//               >
//                 #아이폰배경
//               </Link>
//               <Link
//                 href="#"
//                 className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-lg text-xs font-semibold transition"
//               >
//                 #캐릭터
//               </Link>
//             </div>
//           </div>

//           <div className="carousel-slide p-1 absolute inset-0 flex items-center justify-between transition-all duration-500 ease-in-out opacity-0 pointer-events-none translate-y-2">
//             <div className="flex items-center gap-3">
//               <div className="relative">
//                 <img
//                   src="/user_img.jpg"
//                   alt="Creator"
//                   className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400"
//                 />
//                 <span className="absolute -top-1 -left-1 text-xs">👑</span>
//               </div>
//               <div>
//                 <div className="text-xs font-bold text-slate-900">
//                   Studio Alex
//                 </div>
//                 <div className="text-[11px] text-slate-400 font-medium">
//                   팔로워 12.4k명
//                 </div>
//               </div>
//             </div>
//             <button className="px-3 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition shadow-xs">
//               + 팔로우
//             </button>
//           </div>

//           <div className="carousel-slide p-1 absolute inset-0 flex items-center justify-between transition-all duration-500 ease-in-out opacity-0 pointer-events-none translate-y-2">
//             <div className="space-y-0.5">
//               <div className="text-xs font-bold text-slate-900">
//                 친구 초대하고
//                 <span className="text-indigo-600 font-extrabold">500 코인</span>
//                 받기
//               </div>
//               <p className="text-[11px] text-slate-400 font-medium">
//                 초대 링크로 가입 시 양쪽 적립!
//               </p>
//             </div>
//             <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1">
//               <i data-lucide="copy" className="w-3.5 h-3.5"></i> 복사
//             </button>
//           </div>

//           <div className="carousel-slide p-1 absolute inset-0 flex items-center justify-between transition-all duration-500 ease-in-out opacity-0 pointer-events-none translate-y-2">
//             <div className="space-y-1 pr-2">
//               <div className="text-xs font-bold text-slate-900">
//                 빠른 검색 단축키
//               </div>
//               <p className="text-[11px] text-slate-500 font-medium">
//                 <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200 font-bold text-slate-700">
//                   ⌘K
//                 </kbd>
//                 로 언제든 검색창을 열어보세요.
//               </p>
//             </div>
//             <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
//               💡
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="bg-amber-50/60 border border-amber-200/60 rounded-3xl p-5 shadow-xs flex items-center justify-between">
//         <div className="space-y-1">
//           <div className="flex items-center gap-1 text-amber-700 font-bold text-xs">
//             <i data-lucide="lightbulb" className="w-3.5 h-3.5"></i> Pinz 유용한
//             팁
//           </div>
//           <p className="text-xs text-slate-700 font-semibold leading-relaxed">
//             단축키
//             <kbd className="px-1.5 py-0.5 bg-white rounded border border-amber-200 text-[10px] font-bold shadow-2xs">
//               ⌘K
//             </kbd>
//             로 언제든 빠르게 영감을 검색하세요!
//           </p>
//         </div>

//         <div className="w-9 h-9 rounded-2xl bg-amber-200/50 text-amber-800 flex items-center justify-center font-bold shrink-0 ml-2">
//           🔍
//         </div>
//       </div>
//       <div className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 rounded-3xl p-5 shadow-sm text-white flex items-center justify-between relative overflow-hidden">
//         <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>

//         <div className="space-y-1 z-10">
//           <span className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-md text-[10px] font-bold text-indigo-100">
//             ALWAYS EVENT
//           </span>
//           <h4 className="text-xs font-extrabold text-white leading-tight">
//             친구 초대하고 <span className="text-amber-300">500 코인</span> 받기
//           </h4>
//           <p className="text-[11px] text-indigo-100 font-medium">
//             초대 링크로 가입 시 양쪽 모두 적립!
//           </p>
//         </div>

//         <button className="z-10 px-3 py-2 bg-white text-indigo-700 hover:bg-indigo-50 rounded-xl text-xs font-bold transition shadow-md shrink-0 active:scale-95 flex items-center gap-1">
//           <i data-lucide="copy" className="w-3.5 h-3.5"></i> 복사
//         </button>
//       </div>
//       <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="relative">
//             <img
//               src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
//               alt="Creator"
//               className="w-11 h-11 rounded-full object-cover ring-2 ring-amber-400"
//             />
//             <span className="absolute -top-1 -left-1 text-xs">👑</span>
//           </div>

//           <div>
//             <div className="flex items-center gap-1">
//               <span className="text-xs font-extrabold text-slate-900">
//                 이주의 아티스트
//               </span>
//             </div>
//             <div className="text-xs font-semibold text-slate-700">
//               Studio Alex
//             </div>
//             <div className="text-[11px] text-slate-400">팔로워 12.4k명</div>
//           </div>
//         </div>

//         <button className="px-3 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition shadow-xs active:scale-95">
//           + 팔로우
//         </button>
//       </div>
//       <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex items-center justify-between relative overflow-hidden">
//         <div className="space-y-2">
//           <span className="text-[11px] font-bold text-slate-400 tracking-tight">
//             오늘의 미션
//           </span>
//           <h4 className="text-xs font-bold text-slate-800 leading-relaxed">
//             첫 게시물을 업로드하고
//             <br />
//             <strong className="text-slate-900">10 코인</strong>을 받아가세요!
//           </h4>
//           <div className="pt-1">
//             <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-400 text-amber-950 font-extrabold text-[11px] rounded-full shadow-2xs">
//               P 10
//             </span>
//           </div>
//         </div>

//         <div className="w-16 h-16 bg-gradient-to-tr from-amber-100 to-rose-100 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
//           🎁
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';

const badges = [
  {
    text: '🔥 TRENDING',
    className: 'bg-rose-50 text-rose-600'
  },
  {
    text: '👑 SPOTLIGHT',
    className: 'bg-amber-50 text-amber-600'
  },
  {
    text: '🎁 EVENT',
    className: 'bg-indigo-50 text-indigo-600'
  },
  {
    text: '💡 TIP',
    className: 'bg-emerald-50 text-emerald-600'
  }
];

export default function HeaderRight() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const setSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // 3.5초마다 자동 전환
  useEffect(() => {
    if (isPaused) return;

    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % badges.length);
    }, 3500);

    return () => {
      clearInterval(slideInterval);
    };
  }, [isPaused]);

  return (
    <div className="lg:col-span-4 flex flex-col justify-between gap-4">
      {/* User Profile Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs relative overflow-hidden">
        {/* Subtle Top Gradient Header */}
        <div className="absolute top-0 left-0 right-0 h-16"></div>

        <div className="relative z-10">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-5 pt-1">
            <img
              src="/localimages/janmang.jpg"
              alt="Avatar"
              className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
            />

            <div>
              <h3 className="font-bold text-slate-900 text-sm">배수민님</h3>

              <p className="text-xs text-slate-400 font-medium">@bae0258</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-2 text-center pt-3 border-t border-slate-100">
            <div>
              <div className="text-[11px] font-semibold text-slate-400 mb-0.5">
                코인
              </div>
              <div className="text-sm font-bold text-slate-800">0</div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-slate-400 mb-0.5">
                게시물
              </div>
              <div className="text-sm font-bold text-slate-800">0</div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-slate-400 mb-0.5">
                팔로워
              </div>
              <div className="text-sm font-bold text-slate-800">0</div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-slate-400 mb-0.5">
                팔로잉
              </div>
              <div className="text-sm font-bold text-slate-800">0</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Carousel */}
      <div
        id="sidebar-carousel"
        className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs relative overflow-hidden h-[148px] flex flex-col justify-between group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Carousel Header */}
        <div className="flex items-center justify-between mb-2 z-10">
          {/* Badge */}
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all duration-300 ${badges[currentSlide].className}`}
          >
            {badges[currentSlide].text}
          </span>

          {/* Dots */}
          <div className="flex items-center gap-1.5">
            {badges.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSlide(index)}
                aria-label={`${index + 1}번 슬라이드`}
                className={
                  currentSlide === index
                    ? 'carousel-dot w-2.5 h-2 rounded-full bg-slate-900 transition-all duration-300'
                    : 'carousel-dot w-1.5 h-1.5 rounded-full bg-slate-200 transition-all duration-300'
                }
              />
            ))}
          </div>
        </div>

        {/* Slide Content */}
        <div className="relative flex-1 w-full overflow-hidden">
          {/* Slide 0 */}
          <div
            className={`p-1 absolute inset-0 flex flex-col justify-center transition-all duration-500 ease-in-out ${
              currentSlide === 0
                ? 'opacity-100 pointer-events-auto translate-y-0'
                : 'opacity-0 pointer-events-none translate-y-2'
            }`}
          >
            <div className="text-xs font-bold text-slate-900 mb-2">
              실시간 인기 태그
            </div>

            <div className="flex flex-wrap gap-1.5">
              <a
                href="#"
                className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-lg text-xs font-semibold transition"
              >
                #여름풍경
              </a>

              <a
                href="#"
                className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-lg text-xs font-semibold transition"
              >
                #3D아트
              </a>

              <a
                href="#"
                className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-lg text-xs font-semibold transition"
              >
                #아이폰배경
              </a>

              <a
                href="#"
                className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-lg text-xs font-semibold transition"
              >
                #캐릭터
              </a>
            </div>
          </div>

          {/* Slide 1 */}
          <div
            className={`p-1 absolute inset-0 flex items-center justify-between transition-all duration-500 ease-in-out ${
              currentSlide === 1
                ? 'opacity-100 pointer-events-auto translate-y-0'
                : 'opacity-0 pointer-events-none translate-y-2'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="/localimages/janmang.jpg"
                  alt="Creator"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400"
                />

                <span className="absolute -top-1 -left-1 text-xs">👑</span>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-900">
                  Studio Alex
                </div>

                <div className="text-[11px] text-slate-400 font-medium">
                  팔로워 12.4k명
                </div>
              </div>
            </div>

            <button
              type="button"
              className="px-3 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              + 팔로우
            </button>
          </div>

          {/* Slide 2 */}
          <div
            className={`p-1 absolute inset-0 flex items-center justify-between transition-all duration-500 ease-in-out ${
              currentSlide === 2
                ? 'opacity-100 pointer-events-auto translate-y-0'
                : 'opacity-0 pointer-events-none translate-y-2'
            }`}
          >
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-slate-900">
                친구 초대하고{' '}
                <span className="text-indigo-600 font-extrabold">500 코인</span>{' '}
                받기
              </div>

              <p className="text-[11px] text-slate-400 font-medium">
                초대 링크로 가입 시 양쪽 적립!
              </p>
            </div>

            <button
              type="button"
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1"
            >
              <span className="text-sm">⧉</span>
              복사
            </button>
          </div>

          {/* Slide 3 */}
          <div
            className={`p-1 absolute inset-0 flex items-center justify-between transition-all duration-500 ease-in-out ${
              currentSlide === 3
                ? 'opacity-100 pointer-events-auto translate-y-0'
                : 'opacity-0 pointer-events-none translate-y-2'
            }`}
          >
            <div className="space-y-1 pr-2">
              <div className="text-xs font-bold text-slate-900">
                빠른 검색 단축키
              </div>

              <p className="text-[11px] text-slate-500 font-medium">
                <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200 font-bold text-slate-700">
                  ⌘K
                </kbd>{' '}
                로 언제든 검색창을 열어보세요.
              </p>
            </div>

            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
              💡
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
