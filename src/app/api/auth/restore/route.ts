// src/app/api/auth/restore/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: '토큰이 없습니다.' }, { status: 401 });
  }

  // Express 백엔드에 재발급 요청 (서버 to 서버 통신)
  const backendRes = await fetch(
    `${process.env.EXPRESS_BACKEND_URL}/api/user/restore`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    }
  );

  if (!backendRes.ok) {
    // 백엔드에서 재발급 실패 시 기존 쿠키 삭제
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
    return NextResponse.json({ error: '재발급 실패' }, { status: 401 });
  }

  const { accessToken, newRefreshToken } = await backendRes.json();

  // 브라우저에 새 토큰을 httpOnly 쿠키로 굽기
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/'
  };
  cookieStore.set('accessToken', accessToken, {
    ...cookieOptions,
    maxAge: 60 * 15
  }); // 15분
  cookieStore.set('refreshToken', newRefreshToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 14
  }); // 14일

  return NextResponse.json({ success: true });
}
