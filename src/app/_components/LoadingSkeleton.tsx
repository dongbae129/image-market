'use client';

import React from 'react';

export default function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      {/* 1. 부드럽게 움직이는 UFO SVG 애니메이션 */}
      <div className="relative w-48 h-48 mb-8">
        <svg
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            {/* 눈이 편안하도록 아주 느리고 부드러운 커스텀 애니메이션을 정의합니다 */}
            <style>
              {`
                @keyframes slowFloat {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-8px); }
                }
                @keyframes beamPulse {
                  0%, 100% { opacity: 0.2; }
                  50% { opacity: 0.5; }
                }
                @keyframes abductFile {
                  0% { transform: translateY(15px); opacity: 0; }
                  20% { opacity: 1; }
                  80% { opacity: 1; }
                  100% { transform: translateY(-45px); opacity: 0; }
                }
              `}
            </style>
          </defs>

          {/* 납치하는 빛 (부드럽게 밝아졌다 어두워짐) */}
          <polygon
            points="100,70 30,190 170,190"
            fill="#FEF08A"
            style={{ animation: 'beamPulse 3s infinite ease-in-out' }}
          />

          {/* 빨려 올라가는 이미지 파일 */}
          <g style={{ animation: 'abductFile 3s infinite linear' }}>
            {/* 파일 배경 */}
            <rect
              x="80"
              y="130"
              width="40"
              height="40"
              rx="4"
              fill="#FFFFFF"
              stroke="#94A3B8"
              strokeWidth="2"
            />
            {/* 그림 아이콘 (산과 해) */}
            <circle cx="100" cy="145" r="5" fill="#94A3B8" />
            <path
              d="M 80 170 L 95 155 L 105 165 L 115 150 L 120 170 Z"
              fill="#CBD5E1"
            />
          </g>

          {/* 둥둥 떠있는 UFO 본체 */}
          <g style={{ animation: 'slowFloat 4s infinite ease-in-out' }}>
            {/* UFO 유리 돔 */}
            <path
              d="M 60 75 C 60 35, 140 35, 140 75"
              fill="#BAE6FD"
              opacity="0.9"
            />

            {/* 운전하는 외계인 */}
            <path d="M 85 75 Q 100 40 115 75 Z" fill="#4ADE80" />
            <circle cx="95" cy="62" r="2.5" fill="#1E293B" />
            <circle cx="105" cy="62" r="2.5" fill="#1E293B" />

            {/* UFO 금속 몸통 */}
            <ellipse cx="100" cy="75" rx="60" ry="18" fill="#64748B" />
            <ellipse cx="100" cy="72" rx="60" ry="18" fill="#94A3B8" />

            {/* 깜빡이지 않는 은은한 불빛들 */}
            <circle cx="55" cy="75" r="3" fill="#FEF08A" />
            <circle cx="100" cy="83" r="3" fill="#FEF08A" />
            <circle cx="145" cy="75" r="3" fill="#FEF08A" />
          </g>
        </svg>
      </div>

      {/* 2. 그림에 맞는 위트 있는 한 줄 설명글 */}
      <p className="text-lg font-medium text-gray-600 tracking-tight text-center">
        UFO가 이미지를 우주(클라우드)로 조심스럽게 납치하고 있어요 🛸✨
      </p>
      <p className="text-sm text-gray-400 mt-4 text-center animate-pulse">
        저희 서버가 최선을 다해 달리고 있습니다!🏃‍♂️💨
      </p>
    </div>
  );
}
