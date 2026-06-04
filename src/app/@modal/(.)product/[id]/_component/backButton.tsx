'use client';
import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();
  const onClose = () => router.back();
  return (
    <div className="relative w-[50%] max-w-[1000px] h-full max-h-[85vh] md:max-h-[800px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200">
      <button
        onClick={onClose}
        aria-label="closeButton"
        className="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 hover:bg-gray-100 shadow-sm transition-all md:right-6 md:top-6"
      >
        <svg
          className="h-6 w-6 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      모달 열리는지 테스트
    </div>
  );
}
