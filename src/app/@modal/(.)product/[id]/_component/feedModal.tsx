'use client';

import React, { useState } from 'react';
import { Heart, MessageCircle, ChevronDown, Send, X, User } from 'lucide-react';

interface FeedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedModal({ isOpen, onClose }: FeedModalProps) {
  // 모달이 닫혀있으면 렌더링하지 않음
  //   if (!isOpen) return null;

  // 댓글 펼치기 상태 관리 (예시 기능)
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);

  return (
    // [1] 모달 오버레이 (배경 어둡게)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      {/* [2] 메인 컨테이너 (직사각형 틀) */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
        {/* 닫기 버튼 (UX 편의상 추가) */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 text-gray-500 hover:text-gray-800"
        >
          <X size={24} />
        </button>

        {/* ---------------------------------------------------------
            Header: 좋아요 개수, 댓글 개수
            와이어프레임 상단: 하트 + 숫자 / 말풍선 + 숫자
        --------------------------------------------------------- */}

        {/* ---------------------------------------------------------
            Main: Image 영역
            와이어프레임 중앙: "Img"
        --------------------------------------------------------- */}

        {/* ---------------------------------------------------------
            Nav: 유저정보, 댓글 정보, 입력창
            와이어프레임 하단 영역
        --------------------------------------------------------- */}
        <div className="flex flex-col space-y-3 p-5">
          {/* 1. 유저 정보 (userId) */}

          {/* 2. 댓글 개수 + 댓글 펼칠 수 있는 버튼 */}

          {/* 3. 가장 최근 댓글 하나만 요약 표시 */}
          {/* 확장되지 않았을 때만 보여주거나, 항상 보여주되 리스트 상단에 배치 */}
          <div className="flex items-start space-x-2 text-sm">
            <span className="font-semibold text-gray-900">user_id2</span>
            <span className="line-clamp-1 text-gray-600">
              와이어프레임이랑 똑같이 구현됐네요! 너무 멋집니다 ✨
            </span>
          </div>

          {/* 4. 댓글 추가 Input */}
        </div>
      </div>
    </div>
  );
}
