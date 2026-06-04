'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteSkeleton() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      {/* 1. 블랙홀 SVG 애니메이션 */}
      <div className="relative w-48 h-48 mb-6">
        <svg
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <style>
              {`
                @keyframes swirl {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
                @keyframes suckIn {
                  /* 살짝 위로 튕겼다가 블랙홀로 회전하며 빨려 들어감 */
                  0% { transform: scale(1) rotate(0deg) translateY(0px); opacity: 1; }
                  15% { transform: scale(1.05) rotate(-10deg) translateY(-5px); opacity: 1; }
                  100% { transform: scale(0) rotate(720deg) translateY(80px); opacity: 0; }
                }
                @keyframes pulseHole {
                  0%, 100% { transform: scale(1); }
                  50% { transform: scale(1.05); }
                }
              `}
            </style>
          </defs>

          {/* 블랙홀 배경 보라색 오라 (은은하게 깜빡임) */}
          <circle
            cx="100"
            cy="130"
            r="50"
            fill="#4C1D95"
            opacity="0.2"
            className="animate-pulse"
          />

          {/* 블랙홀 본체 (맥박 뛰듯 꿀렁거림) */}
          <g
            style={{
              transformOrigin: '100px 130px',
              animation: 'pulseHole 4s infinite ease-in-out'
            }}
          >
            <circle cx="100" cy="130" r="35" fill="#312E81" />
            <circle cx="100" cy="130" r="20" fill="#1E1B4B" />
            <circle cx="100" cy="130" r="10" fill="#000000" />

            {/* 빙글빙글 도는 사건의 지평선(빛의 띠) */}
            <g
              style={{
                transformOrigin: '100px 130px',
                animation: 'swirl 3s infinite linear'
              }}
            >
              <circle
                cx="100"
                cy="130"
                r="45"
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="1.5"
                strokeDasharray="15 30"
                opacity="0.7"
              />
              <circle
                cx="100"
                cy="130"
                r="30"
                fill="none"
                stroke="#C4B5FD"
                strokeWidth="2"
                strokeDasharray="20 20"
                opacity="0.9"
              />
            </g>
            <g
              style={{
                transformOrigin: '100px 130px',
                animation: 'swirl 5s infinite linear reverse'
              }}
            >
              <circle
                cx="100"
                cy="130"
                r="38"
                fill="none"
                stroke="#6D28D9"
                strokeWidth="2"
                strokeDasharray="10 40"
                opacity="0.6"
              />
            </g>
          </g>

          {/* 빨려 들어가는 불량 파일 (X_X 표정) */}
          <g
            style={{
              transformOrigin: '100px 60px',
              animation: 'suckIn 3s infinite ease-in'
            }}
          >
            <rect
              x="75"
              y="30"
              width="50"
              height="60"
              rx="6"
              fill="#FCA5A5"
              stroke="#DC2626"
              strokeWidth="2"
            />
            {/* 문서 접힌 모서리 디테일 */}
            <polygon points="125,30 105,30 125,50" fill="#F87171" />

            {/* 왼쪽 눈 (X) */}
            <line
              x1="88"
              y1="50"
              x2="96"
              y2="58"
              stroke="#7F1D1D"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <line
              x1="96"
              y1="50"
              x2="88"
              y2="58"
              stroke="#7F1D1D"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* 오른쪽 눈 (X) */}
            <line
              x1="104"
              y1="50"
              x2="112"
              y2="58"
              stroke="#7F1D1D"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <line
              x1="112"
              y1="50"
              x2="104"
              y2="58"
              stroke="#7F1D1D"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* 우울한 입 모양 */}
            <path
              d="M 92 72 Q 100 65 108 72"
              fill="none"
              stroke="#7F1D1D"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>

      {/* 2. 메인 안내 문구 */}
      <h3 className="text-xl font-bold text-gray-800 mb-3">
        앗! 게시물이 블랙홀로 빨려 들어갔어요 🕳️
      </h3>

      {/* 3. 서브 설명 문구 */}
      <p className="text-sm text-gray-500 mb-8 leading-relaxed">
        UFO가 처리하려고 했지만, 파일이 규격에 맞지 않거나 너무 무거워서
        놓쳐버렸습니다.
        <br />
        <span className="font-semibold text-rose-500">
          이 게시물은 곧 우주의 먼지로 영구 삭제됩니다. 펑! 💥
        </span>
      </p>

      {/* 4. 뒤로가기 액션 버튼 (막다른 길이므로 필수!) */}
      <button
        onClick={() => router.back()} // 상황에 따라 router.push('/') 로 변경하셔도 됩니다.
        className="px-6 py-2.5 bg-slate-800 text-white text-sm font-medium rounded-full hover:bg-slate-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
      >
        안전한 피드로 대피하기 🚀
      </button>
    </div>
  );
}
