// 'use client';
// import { useRouter } from 'next/navigation';
// import { useEffect, useRef } from 'react';

// export default function DetailModal({
//   children
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();
//   const dialogRef = useRef<HTMLDivElement>(null);

//   // useEffect(() => {
//   //   if (!dialogRef.current?.open) {
//   //     dialogRef.current?.showModal();
//   //   }
//   // }, []);

//   const onDismiss = () => {
//     router.back(); // 뒤로 가기를 실행하여 모달 닫기(URL 복귀)
//   };

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
//       onClick={onDismiss}
//     >
//       <div
//         role="dialog"
//         ref={dialogRef}
//         className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-0 shadow-2xl outline-none"
//         onClick={(e) => e.stopPropagation()} // 내부 클릭 시 닫힘 방지
//         onClose={onDismiss}
//       >
//         <button
//           onClick={onDismiss}
//           className="absolute right-4 top-4 z-10 rounded-full bg-gray-100 p-2 hover:bg-gray-200"
//         >
//           ✕
//         </button>
//         {children}
//       </div>
//     </div>
//   );
// }
'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

type Props = {
  children: React.ReactNode;
};

export default function DetailModal({ children }: Props) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prevOverflow = useRef<string>('');

  useEffect(() => {
    if (typeof document === 'undefined') return;

    // 1) 배경 스크롤 잠금 (복구를 위해 이전 값 저장)
    prevOverflow.current = document.body.style.overflow || '';
    document.body.style.overflow = 'hidden';

    // 2) 모달로 포커스 이동 (브라우저가 스크롤하지 않도록 preventScroll)
    const el = containerRef.current;
    el?.focus?.({ preventScroll: true });

    // 3) ESC 키로 닫기 (접근성)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') router.back();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      // 복구
      document.body.style.overflow = prevOverflow.current;
      window.removeEventListener('keydown', onKey);
    };
  }, [router]);

  const onDismiss = () => router.back();

  const modal = (
    <div
      className="fixed w-full h-full inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onDismiss}
    >
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full h-full max-w-3xl max-h-[90vh] overflow-auto rounded-2xl bg-white p-4"
      >
        <button
          onClick={onDismiss}
          aria-label="Close"
          className="absolute right-4 top-4"
        >
          <X />
        </button>

        {children}
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modal, document.body);
}
