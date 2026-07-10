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
