import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  acEx: number;
  reEx: number;
};
export async function POST(req: NextRequest) {
  const { userId, password } = await req.json();

  const res = await fetch(`${process.env.EXPRESS_BACKEND_URL}/api/authlogin`, {
    method: 'POST',
    headers: { 'Contest-Type': 'application/json' },
    body: JSON.stringify({ userId, password })
  });

  if (!res.ok)
    return NextResponse.json(
      {
        success: false,
        message:
          '아이디 또는 비밀번호가 올바르지 않습니다. 입력한 정보를 다시 확인해 주세요.'
      },
      {
        status: 401
      }
    );
  const data = (await res.json()) as LoginResponse;
  const cookieStore = await cookies();
  const { accessToken, refreshToken, acEx, reEx } = data;
  cookieStore.set('accessToken', accessToken, {
    httpOnly: true,
    path: '/',
    maxAge: acEx
  });
  cookieStore.set('refreshToken', refreshToken, {
    httpOnly: true,
    path: '/',
    maxAge: reEx
  });
  return NextResponse.json({
    success: true
  });
}
