import { generateAndSaveTokens, sessionDB } from '@app/api/_lib/tokenService';
import { refreshToken } from './../../../../libs/server/auth';
import { createAccessToken } from '@libs/server/auth';
import { verify, JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';
//   import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
type StateType = {
  ok?: boolean;
  auth?: {
    checkError: boolean;
  };
  message?: string;
  accessToken?: string;
  refreshToken?: string;
};
type RefershTokenProps = {
  userId: string;
  familyId: string;
  jti: string;
};
export const GET = async () => {
  const refreshToken = cookies().get('refreshToken')?.value;

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
    console.log(payload, 'payloadtest');
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
export const POST = async (req: NextRequest) => {
  // const cookie = await cookies();
  const body = await req.json();
  const refreshToken = body.refreshToken;
  // const refreshToken = cookie.get('refreshToken')?.value;
  try {
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
    const decoded = verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    ) as RefershTokenProps;
    const { userId, familyId, jti } = decoded;

    const latestJti = sessionDB.get(familyId);
    console.log(sessionDB, 'sessionDB');
    if (!latestJti) {
      return NextResponse.json(
        {
          message: 'RTR ERROR'
        },
        {
          status: 401
        }
      );
    }
    if (latestJti !== jti) {
      sessionDB.delete(familyId);
      return NextResponse.json(
        {
          message: '탈취된 토큰인것 같아요'
        },
        {
          status: 401
        }
      );
    }
    const { accessToken: newAcT, refreshToken: newReT } =
      generateAndSaveTokens(userId);
    const newJti = uuidv4();
    sessionDB.set(familyId, newJti);
    return NextResponse.json({
      accessToken: newAcT,
      newRefreshToken: newReT
    });
  } catch (error) {
    console.error(error, 'restore catch error');
    return NextResponse.json(
      {
        message: 'restore server error'
      },
      {
        status: 500
      }
    );
  }

  /* 15초 탭 유예기간주는 gracePeriod는 express가서 구현하기*/

  // let state: StateType = {};
  // verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
  //   if (err) {
  //     state = {
  //       ok: false,
  //       auth: {
  //         checkError: true
  //       },
  //       message: 'need to login, invalid refreshToken'
  //     };
  //     return;
  //   }
  //   console.log(payload, 'restore payload');
  //   const { accessToken, refreshToken } = generateAndSaveTokens(
  //     (payload as JwtPayload).userId
  //   );
  //   // const accessToken = createAccessToken((payload as JwtPayload).id, 0);
  //   state = {
  //     accessToken,
  //     refreshToken
  //   };
  // });
  // if (state?.auth?.checkError)
  //   return NextResponse.json(
  //     {
  //       ...state
  //     },
  //     {
  //       status: 401
  //     }
  //   );

  // return NextResponse.json({
  //   ok: true,
  //   ...state
  // });
};
