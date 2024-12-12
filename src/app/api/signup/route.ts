import client from '@libs/server/client';
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { name, userId, password, email } = body;
  if (userId === '' || password === '') {
    NextResponse.json({
      ok: false,
      message: 'input the signup-information'
    });
  }
  const userExist = await client.localUser.findFirst({
    where: {
      memId: userId,
      email
    }
  });
  if (userExist) {
    return NextResponse.json(
      {
        ok: false,
        error: 'existe duplicated userId or email'
      },
      {
        status: 409
      }
    );
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await client.user.create({
      data: {
        name: name ? name : 'Annoymous',
        email,
        emailActive: false
      }
    });
    await client.localUser.create({
      data: {
        memId: userId,
        password: hashedPassword,
        userId: user.id,
        email
      }
    });

    return NextResponse.json({
      ok: true,
      message: 'signup success',
      user
    });
  }
};
