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
  const token = await cookies();
  const accesToken = token.get('accessToken')?.value;
  const refreshToken = token.get('refreshToken')?.value;

  console.log(accesToken, 'getUserServer accesToken');
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
      next: {
        tags: ['userInfo']
      },
      headers: {
        Authorization: `Bearer ${accesToken}`
        // Cookie: `refreshToken=${refreshToken}`
      },
      credentials: 'include'
      // cache: 'no-store'
    });

    if (!res.ok) {
      const restored = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/restore`,
        {
          credentials: 'include'
        }
      );
      const test: UserType = await restored.json();
      console.log(test, 'getUserServer - test');
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
      return restoredUser.json();
    }
    return res.json();
  } catch (error) {
    console.error(error);
    throw new Error('user server fail');
  }
};
