import client from '@libs/server/client';
import bcrypt from 'bcrypt';

import { NextRequest, NextResponse } from 'next/server';
import { generateAndSaveTokens } from '@app/api/_lib/tokenService';

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { userId, password } = body;
  if (userId === '' || password === '') {
    return NextResponse.json(
      {
        error: 'id and password is required!'
      },
      {
        status: 400
      }
    );
  }
  try {
    const localUser = await client.localUser.findFirst({
      where: {
        memId: userId
      }
    });
    if (!localUser) {
      return NextResponse.json(
        {
          message: 'invalid id or wrong password'
        },
        {
          status: 401
        }
      );
    }
    const mainUser = await client.user.findUnique({
      where: {
        id: localUser.userId
      }
    });

    if (!mainUser) {
      return NextResponse.json(
        {
          message: 'invalid id or wrong password'
        },
        {
          status: 401
        }
      );
    } else if (mainUser?.delete) {
      return NextResponse.json(
        {
          message: 'already deleted user'
        },
        {
          status: 401
        }
      );
    }
    const comparepassw = await bcrypt.compare(password, localUser.password);
    if (comparepassw) {
      const { accessToken, refreshToken } = generateAndSaveTokens(
        mainUser.id.toString()
      );

      return NextResponse.json({
        message: 'login success',
        refreshToken,
        accessToken,
        acEx: 60 * 15,
        reEx: 60 * 60 * 24 * 14
      });
    } else {
      return NextResponse.json(
        {
          ok: false,
          message: 'password is incorrected'
        },
        {
          status: 401
        }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: 'login server error'
      },
      {
        status: 500
      }
    );
  }
};
