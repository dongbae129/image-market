import {
  authLinkCheck,
  createRefreshToken,
  sendRefreshToken
} from '@libs/server/auth';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  const authState = authLinkCheck();

  const { searchParams } = new URL(req.url);
  const paramsObject = Object.fromEntries(searchParams.entries());
  const { type, user: userId } = paramsObject;
  if (typeof authState === 'object' && authState.id) {
    try {
      const refreshToken = createRefreshToken(authState?.id, -1);
      const socialUser = await client?.socialUser.create({
        data: {
          type: type.toString(),
          userId: +userId,
          socialId: authState?.id.toString()
        }
      });
      sendRefreshToken(refreshToken);
      return NextResponse.json({
        ok: true,
        socialUser
      });
    } catch (e) {
      console.log(e);
      return NextResponse.json(
        {
          ok: false,
          error: 'failed link social creation'
        },
        {
          status: 500
        }
      );
    }
  }

  return NextResponse.json(
    {
      ok: false,
      message: 'failed link social user'
    },
    {
      status: 500
    }
  );
};
