import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const typeQuery = searchParams.get('type');
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (refreshToken) {
    try {
      await fetch(
        `${process.env.EXPRESS_BACKEND_URL}/api/authlogout?type=${typeQuery || ''}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        }
      );
    } catch (error) {
      console.error(error, 'bff logout error');
    }
  }

  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
  return NextResponse.json({
    success: true
  });
}
