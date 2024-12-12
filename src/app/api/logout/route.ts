import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const POST = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const typeQuery = searchParams.get('type');
  if (!typeQuery) {
    return NextResponse.json(
      {
        ok: false,
        message: 'logout fail'
      },
      {
        status: 401
      }
    );
  }
  try {
    if (typeQuery === 'local') {
      cookies().set('refreshToken', '', {
        maxAge: -1,
        path: '/'
      });
      return NextResponse.json({
        ok: true
      });
    } else if (typeQuery === 'kakao') {
      return NextResponse.json({
        ok: true,
        message: 'not yet kakao logout'
      });
    }
  } catch (e) {
    console.error(e, ' logout error');
    return NextResponse.json(
      {
        ok: false,
        message: 'failt logout'
      },
      {
        status: 500
      }
    );
  }
};
// const Logout = async (req: NextApiRequest, res: NextApiResponse) => {
//   if (req.method === 'POST') {
//     try {
//       const { type } = req.query;

//       if (type === 'local') {
//         res.setHeader('Set-Cookie', [
//           cookie.serialize('refreshToken', '', {
//             maxAge: -1,
//             path: '/'
//           })
//         ]);
//         return res.json({
//           ok: true
//         });
//       } else if (type === 'kakao') {
//       }
//     } catch (e) {
//       console.error(e, ' logout error');
//     }
//   }
// };
// export default Logout;
