import { User } from '@prisma/client';
import { cookies } from 'next/headers';

interface UserType {
  ok: boolean;
  auth?: {
    checkError: boolean;
  };
  status?: number;
  user?: User;
  message?: string;
}
interface StateType {
  ok?: boolean;
  auth?: {
    checkError: boolean;
  };
  message?: string;
  accessToken?: string;
}
export const getUserServer = async (): Promise<UserType> => {
  const token = cookies();
  const accesToken = token.get('accessToken')?.value;
  const refreshToken = token.get('refreshToken')?.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
      next: {
        tags: ['userInfo']
      },
      headers: {
        Authorization: `Bearer ${accesToken}`,
        Cookie: `refreshToken=${refreshToken}`
      },
      credentials: 'include'
      // cache: 'no-store'
    });
    if (!res.ok) {
      const restored = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/restore`,
        {
          headers: {
            Cookie: `refreshToken=${refreshToken}`
          },
          credentials: 'include'
        }
      );
      const test: UserType = await restored.json();
      if (!test.ok) {
        return {
          ok: false,
          message: 'no refresh'
        };
      }
      const restoredUser = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user`,
        {
          next: {
            tags: ['userInfo']
          },
          headers: {
            Authorization: `Bearer ${test.accessToken}`,
            Cookie: `refreshToken=${refreshToken}`
          },
          credentials: 'include'
          // cache: 'no-store'
        }
      );
      const final = await restoredUser.json();
      return final;
    }
  } catch (error) {
    console.error(error);
    throw new Error('user server fail');
  }
};
