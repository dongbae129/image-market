// // app/middleware.ts
// import { NextResponse } from 'next/server';

// export function middleware() {
//   const response = NextResponse.next();
//   response.headers.set(
//     'Accept-CH',
//     'sec-ch-ua-mobile, sec-ch-ua-model,sec-ch-viewport-width'
//   );
//   response.headers.set(
//     'Permissions-Policy',
//     'ch-ua-mobile=*, ch-ua-model=*, ch-viewport-width=*'
//   );

//   return response;
//   //   const res = NextResponse.next();

//   //   // 브라우저에게 Client Hints 보내달라고 지시
//   //   res.headers.set(
//   //     'Accept-CH',
//   //     'Viewport-Width, DPR, Sec-CH-UA, Sec-CH-UA-Mobile'
//   //   );
//   //   res.headers.set('Critical-CH', 'Viewport-Width'); // 중요한 값은 반드시 보내달라
//   //   res.headers.set('Permissions-Policy', 'ch-viewport-width=*, ch-dpr=*');
//   //   return res;
// }

// export const config = { matcher: ['/'] };

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const hasToekn = accessToken || refreshToken;
  const { pathname } = request.nextUrl;
  // 보호할 페이지 경로 설정
  // const isProtectedPath = request.nextUrl.pathname.startsWith('/profile');
  if (
    hasToekn &&
    (pathname.startsWith('/signin') || pathname.startsWith('signup'))
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 1. 토큰이 아예 없으면 로그인 페이지로 리다이렉트
  // if (isProtectedPath && !accessToken && !refreshToken) {
  //   return NextResponse.redirect(new URL('/signin', request.url));
  // }

  // 2. AccessToken 만료 & RefreshToken은 존재할 때 (선제적 재발급)
  // if (isProtectedPath && !accessToken && refreshToken) {
  if (!accessToken && refreshToken) {
    // 미들웨어에서는 Express 백엔드 서버로 직접 다녀오는 것이 구조상 빠릅니다.
    const res = await fetch(
      `${process.env.EXPRESS_BACKEND_URL}/api/user/restore`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      }
    );
    console.log(request.nextUrl.pathname, 'mm22');

    if (res.ok) {
      const { accessToken: newAccess, newRefreshToken } = await res.json();

      // 화면 렌더링을 진행시킬 응답 객체 생성
      const response = NextResponse.next();

      // 새로 받은 토큰을 브라우저에 쿠키로 덮어쓰기
      response.cookies.set('accessToken', newAccess, {
        httpOnly: true,
        path: '/'
      });
      if (newRefreshToken)
        response.cookies.set('refreshToken', newRefreshToken, {
          httpOnly: true,
          path: '/'
        });

      return response;
    } else {
      // 재발급 실패(DB 만료 등) 시 강제 로그아웃 처리
      const response = NextResponse.redirect(new URL('/signin', request.url));
      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');
      return response;
    }
  }

  return NextResponse.next();
}

// 미들웨어를 거칠 경로만 매칭하여 성능 최적화
// matcher: ['/', '/profile/:path*']
export const config = {
  matcher: ['/', '/profile/:path*', '/signin', '/signup']
};
