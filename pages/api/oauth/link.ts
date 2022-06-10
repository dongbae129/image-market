import { ResponseType } from '@libs/server/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  authLinkCheck,
  createRefreshToken,
  sendRefreshToken
} from '@libs/server/auth';

const Link = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
  // id: number
) => {
  const authState = authLinkCheck(req, res);
  const { linkask, type, user: userId } = req.query;
  console.log(authState, 'authState');
  if (typeof authState === 'object') {
    try {
      const refreshToken = createRefreshToken(authState?.id);
      const socialUser = await client?.socialUser.create({
        data: {
          type: type.toString(),
          userId: +userId,
          socialId: authState?.id.toString()
        }
      });
      sendRefreshToken(res, refreshToken);
      return res.json({
        ok: true,
        socialUser
      });
    } catch (e) {
      console.log(e);
      return res.status(400).json({
        ok: false,
        error: 'failed link social creation'
      });
    }
  }

  return res.json({
    ok: false,
    message: 'failed link social user'
  });
};
export default Link;
