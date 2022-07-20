import { nc, upload, TokenPayload } from '@libs/server/utils';

import client from '@libs/server/client';
import { checkAuth } from '@libs/server/auth';
import { decode } from 'jsonwebtoken';

// export const config = {
//   api: {
//     bodyParser: false
//   }
// };
const userDetail = nc;

userDetail.post(upload.single('file'), async (req, res) => {
  const { email, name } = req.body;
  const { userId } = req.query;
  try {
    const auth = checkAuth(req, res, 0);
    if (!auth?.re)
      return res.json({
        ok: false,
        message: 'need to login'
      });
    if (auth.accessToken) {
      const decoded = decode(auth.accessToken) as TokenPayload;

      let id;
      if (decoded.type === 1) {
        const localUser = await client.localUser.findUnique({
          where: {
            id: decoded.id
          }
        });
        if (!localUser || localUser.userId !== +userId.toString())
          return res.json({
            ok: false,
            message: 'invalid user or not exist'
          });
        id = localUser.userId;
      } else if (decoded.type === -1) {
        const socialUser = await client.socialUser.findUnique({
          where: {
            socialId: decoded.id.toString()
          }
        });
        if (!socialUser || socialUser.userId !== +userId)
          return res.json({
            ok: false,
            message: 'invalid user or not exist'
          });
        id = socialUser.userId;
      }
      const user = await client.user.update({
        where: {
          id
        },
        data: {
          email,
          name
        }
      });
      return res.json({
        ok: true,
        user
      });
    }
  } catch (error) {
    console.error(error, 'failed update user');
  }
});

export default userDetail;
