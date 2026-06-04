import { User } from '@prisma/client';
import { cookies } from 'next/headers';

type Props = {
  ok: boolean;
  user: User;
};
export const getUserInfo = async (userId: string): Promise<Props> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/${userId}`,
      {
        next: {
          tags: ['userInfo', userId]
        }
      }
    );

    return res.json();
  } catch (error) {
    console.error(error);
    throw new Error('userinfo fail');
  }
};
