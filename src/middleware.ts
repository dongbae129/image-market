// app/middleware.ts
import { NextResponse } from 'next/server';

export function middleware() {
  const response = NextResponse.next();
  response.headers.set(
    'Accept-CH',
    'sec-ch-ua-mobile, sec-ch-ua-model,sec-ch-viewport-width'
  );
  response.headers.set(
    'Permissions-Policy',
    'ch-ua-mobile=*, ch-ua-model=*, ch-viewport-width=*'
  );

  return response;
  //   const res = NextResponse.next();

  //   // 브라우저에게 Client Hints 보내달라고 지시
  //   res.headers.set(
  //     'Accept-CH',
  //     'Viewport-Width, DPR, Sec-CH-UA, Sec-CH-UA-Mobile'
  //   );
  //   res.headers.set('Critical-CH', 'Viewport-Width'); // 중요한 값은 반드시 보내달라
  //   res.headers.set('Permissions-Policy', 'ch-viewport-width=*, ch-dpr=*');
  //   return res;
}

export const config = { matcher: ['/'] };
