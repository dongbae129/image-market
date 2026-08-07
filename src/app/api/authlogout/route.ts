import { verify } from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { sessionDB } from '@app/api/_lib/tokenService';
type RefershTokenProps = {
  userId: string;
  familyId: string;
  jti: string;
};
export const POST = async (req: NextRequest) => {
  const pa = req.nextUrl.searchParams;
  const typeQuery = pa.get('type');
  try {
    if (typeQuery === 'local') {
      const body = await req.json();
      const refreshToken = body.refreshToken;

      if (refreshToken) {
        const decoded = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, {
          ignoreExpiration: true
        }) as RefershTokenProps;
        console.log(sessionDB, 'before sessionDB');
        if (decoded && decoded.familyId) {
          sessionDB.delete(decoded.familyId);
          console.log(sessionDB, 'after sessionDB');
        }
      }
    } else if (typeQuery === 'kakao') {
      return NextResponse.json({
        success: true,
        message: 'not yet kakao logout'
      });
    }
    return NextResponse.json({
      success: true
    });
  } catch (e) {
    console.error(e, ' logout error');
    return NextResponse.json({
      success: true,
      message: 'logout error'
    });
  }
};
