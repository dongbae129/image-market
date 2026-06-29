// src/lib/auth-cookies.ts
import { cookies } from 'next/headers';

export async function setAuthCookies(
  accessToken: string,
  refreshToken: string
) {
  const cookieStore = await cookies();

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/'
  };

  cookieStore.set('accessToken', accessToken, {
    ...cookieOptions,
    maxAge: 60 * 15
  });
  cookieStore.set('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 14
  });
}

// 로그아웃, 탈취 시 쿠키 삭제 유틸
export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
}
