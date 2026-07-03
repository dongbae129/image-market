// 'use client';

// import React, { useEffect, useRef } from 'react';
// import { createPortal } from 'react-dom';
// import { useRouter } from 'next/navigation';
// import { X } from 'lucide-react';

// type Props = {
//   children: React.ReactNode;
// };

// export default function DetailModal({ children }: Props) {
//   const router = useRouter();
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const prevOverflow = useRef<string>('');

//   useEffect(() => {
//     if (typeof document === 'undefined') return;

//     // 1) 배경 스크롤 잠금 (복구를 위해 이전 값 저장)
//     prevOverflow.current = document.body.style.overflow || '';
//     document.body.style.overflow = 'hidden';

//     // 2) 모달로 포커스 이동 (브라우저가 스크롤하지 않도록 preventScroll)
//     const el = containerRef.current;
//     el?.focus?.({ preventScroll: true });

//     // 3) ESC 키로 닫기 (접근성)
//     const onKey = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') router.back();
//     };
//     window.addEventListener('keydown', onKey);

//     return () => {
//       // 복구
//       document.body.style.overflow = prevOverflow.current;
//       window.removeEventListener('keydown', onKey);
//     };
//   }, [router]);

//   const onDismiss = () => router.back();

//   const modal = (
//     <div
//       className="fixed w-full h-full inset-0 z-50 flex items-center justify-center bg-black/40"
//       onClick={onDismiss}
//     >
//       <div
//         ref={containerRef}
//         role="dialog"
//         aria-modal="true"
//         tabIndex={-1}
//         onClick={(e) => e.stopPropagation()}
//         className="relative w-full h-full max-w-3xl max-h-[90vh] overflow-auto rounded-2xl bg-white p-4"
//       >
//         <button
//           onClick={onDismiss}
//           aria-label="Close"
//           className="absolute right-4 top-4"
//         >
//           <X />
//         </button>

//         {children}
//       </div>
//     </div>
//   );

//   if (typeof document === 'undefined') return null;
//   return createPortal(modal, document.body);
// }
// 'use client';

// import React, { useEffect, useRef } from 'react';
// import { createPortal } from 'react-dom';
// import { useRouter } from 'next/navigation';
// import { X } from 'lucide-react';

// type Props = { children: React.ReactNode };

// export default function DetailModal({ children }: Props) {
//   const router = useRouter();
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const prevOverflow = useRef<string>('');

//   useEffect(() => {
//     if (typeof document === 'undefined') return;
//     prevOverflow.current = document.body.style.overflow || '';
//     document.body.style.overflow = 'hidden';
//     const el = containerRef.current;
//     el?.focus?.({ preventScroll: true });

//     const onKey = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') router.back();
//     };
//     window.addEventListener('keydown', onKey);

//     return () => {
//       document.body.style.overflow = prevOverflow.current;
//       window.removeEventListener('keydown', onKey);
//     };
//   }, [router]);

//   const onDismiss = () => router.back();

//   const modal = (
//     <div
//       className="fixed inset-0 z-50 flex w-full h-full items-center justify-center bg-black/60 p-4 sm:p-0"
//       onClick={onDismiss}
//     >
//       <div
//         ref={containerRef}
//         role="dialog"
//         aria-modal="true"
//         tabIndex={-1}
//         onClick={(e) => e.stopPropagation()}
//         className="relative flex flex-col w-full max-w-3xl max-h-[90vh] h-[90vh] sm:h-auto sm:min-h-[50vh] overflow-hidden rounded-2xl bg-white"
//       >
//         <button
//           onClick={onDismiss}
//           aria-label="Close"
//           className="absolute right-4 top-4 z-50 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
//         >
//           <X size={18} />
//         </button>

//         {children}
//       </div>
//     </div>
//   );

//   if (typeof document === 'undefined') return null;
//   return createPortal(modal, document.body);
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
    prevOverflow.current = document.body.style.overflow || '';
    document.body.style.overflow = 'hidden';
    const el = containerRef.current;
    el?.focus?.({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') router.back();
    };
    window.addEventListener('keydown', onKey);

    return () => {
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
        className="relative flex flex-col w-full h-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-white"
      >
        <button
          onClick={onDismiss}
          aria-label="Close"
          className="absolute right-4 top-4 z-50" // z-50으로 어두운 배경 위로 올라오게 유지
        >
          <X />
        </button>

        {children}
      </div>
    </div>
  );
  // const modal = (
  //   <div
  //     className="fixed w-full h-full inset-0 z-50 flex items-center justify-center bg-black/40"
  //     onClick={onDismiss}
  //   >
  //     <div
  //       ref={containerRef}
  //       role="dialog"
  //       aria-modal="true"
  //       tabIndex={-1}
  //       onClick={(e) => e.stopPropagation()}
  //       className="relative flex flex-col w-full h-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-white p-4"
  //     >
  //       <button
  //         onClick={onDismiss}
  //         aria-label="Close"
  //         className="absolute right-4 top-4 z-50"
  //       >
  //         <X />
  //       </button>

  //       {children}
  //     </div>
  //   </div>
  // );

  if (typeof document === 'undefined') return null;
  return createPortal(modal, document.body);
}
