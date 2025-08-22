// import { NextApiRequest, NextApiResponse } from 'next';
import { checkAuth } from '@libs/server/auth';
import { ResponseType, TokenPayload } from '@libs/server/utils';
import { decode, JwtPayload } from 'jsonwebtoken';
import client from '@libs/server/client';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest, res: NextResponse) => {
  // return NextResponse.json({
  //   ok: true,
  //   message: 'AAABB'
  // });
  const auth = checkAuth(req, res, 0);
  console.log(auth, 'user auth test');
  if (auth?.checkError)
    return NextResponse.json(
      {
        ok: false,
        auth
      },
      {
        status: 401
      }
    );
  try {
    if (auth?.payload) {
      const { id } = auth?.payload as TokenPayload;
      const user = await client.user.findUnique({
        where: {
          id
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          emailActive: true,
          coin: true,
          bonusCoupon: true,
          delete: true
        }
      });

      return NextResponse.json({
        ok: true,
        user
      });
    }
  } catch (e) {
    console.error(e, 'faile method GET');
    return NextResponse.json(
      {
        message: 'error'
      },
      {
        status: 500
      }
    );
  }
};
