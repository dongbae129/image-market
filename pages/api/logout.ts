import { checkAuth } from '@libs/server/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

const Logout = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { type } = req.query;

      if (type === 'local') {
        res.setHeader('Set-Cookie', [
          cookie.serialize('refreshToken', '', {
            maxAge: -1,
            path: '/'
          })
        ]);
        return res.json({
          ok: true
        });
      } else if (type === 'kakao') {
      }
    } catch (e) {}
  }
};
export default Logout;
