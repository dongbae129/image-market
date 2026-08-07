import { User } from '@prisma/client';
import { cookies } from 'next/headers';

interface UserResponse {
  ok: boolean;
  auth?: {
    checkError: boolean;
  };
  status?: number;
  user?: User | null;
  message?: string;
}
export interface RestoreResponse {
  ok: boolean;
  accessToken?: string; // Restore 응답에만 accessToken이 존재함
  message?: string;
  auth?: {
    checkError: boolean;
  };
}
export const getUserServer = async (): Promise<UserResponse | null> => {
  const token = await cookies();
  const accesToken = token.get('accessToken')?.value;
  const refreshToken = token.get('refreshToken')?.value;
  if (!accesToken && !refreshToken) {
    return null;
  }
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
      next: {
        tags: ['userInfo']
      },
      headers: {
        Authorization: `Bearer ${accesToken}`
      },
      credentials: 'include'
    });
    if (res.ok) {
      return await res.json();
    }

    // 3. 여기서 401이 나면 진짜로 권한이 박탈당한 것 (강제 로그아웃 대상)
    return { ok: false, message: 'Unauthorized or token expired' };
  } catch (error) {
    console.error(error);
    return { ok: false, message: 'Server error' };
  }
};
