import { createAccessToken } from '@libs/server/auth';
import { verify, JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';
//   import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';

interface StateType {
  ok?: boolean;
  auth?: {
    checkError: boolean;
  };
  message?: string;
  accessToken?: string;
}
export const GET = async (req: NextRequest, res: NextResponse) => {
  const refreshToken = cookies().get('refreshToken')?.value;
  console.log(refreshToken, 'refreshToken TEST');
  if (!refreshToken) {
    return NextResponse.json(
      {
        ok: false,
        auth: {
          checkError: false
        },
        message: 'need to login again'
      },
      {
        status: 403
      }
    );
  }
  let state: StateType = {};
  verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
    if (err) {
      state = {
        ok: false,
        auth: {
          checkError: true
        },
        message: 'need to login, invalid refreshToken'
      };
      return;
    }
    const accessToken = createAccessToken((payload as JwtPayload).id, 0);
    state = {
      accessToken
    };
  });
  if (state?.auth?.checkError)
    return NextResponse.json(
      {
        ok: false,
        ...state
      },
      {
        status: 403
      }
    );

  return NextResponse.json({
    ok: true,
    ...state
  });
};
