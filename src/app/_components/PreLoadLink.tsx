// components/PreloadLink.jsx
'use client'; // app-router 쓸 때 필요
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useRef, useCallback } from 'react';

export default function PreloadLink({ href, imageSrc, children, className }) {
  const router = useRouter();
  const imgRef = useRef(null);
  const preloaded = useRef({ image: false, route: false });

  const preloadImage = useCallback(() => {
    if (!imageSrc || preloaded.current.image) return;
    // 기존에 생성한 이미지가 있으면 재사용
    if (!imgRef.current) imgRef.current = new Image();
    imgRef.current.src = imageSrc;
    preloaded.current.image = true;
  }, [imageSrc]);

  const preloadRoute = useCallback(() => {
    if (preloaded.current.route) return;
    // next/router의 prefetch 사용: 빌드 시점이나 환경에 따라 동작이 달라질 수 있음
    // if (router && typeof router.prefetch === 'function') {
    //   router.prefetch(href).catch(() => {
    //     /* 무시 */
    //   });
    // }
    preloaded.current.route = true;
  }, [router, href]);

  const handlePointerEnter = () => {
    preloadImage();
    preloadRoute();
  };

  const handleTouchStart = () => {
    // 모바일에서 터치 시 바로 prefetch + 이미지 로드
    preloadImage();
    preloadRoute();
  };

  const handleClick = () => {
    // (선택) 클릭 직전에 보장용으로 한 번 더 호출
    preloadImage();
    preloadRoute();
  };

  return (
    <Link
      href={href}
      onMouseEnter={handlePointerEnter}
      onFocus={handlePointerEnter} // 키보드 접근성
      onTouchStart={handleTouchStart}
      onClick={handleClick}
      className={className}
    >
      {children}
    </Link>
  );
}
