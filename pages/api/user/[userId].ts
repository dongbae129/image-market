import { ResponseType } from '@libs/server/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/server/client';
const userDetail = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  try {
    const user = await client.user.findUnique({
      where: {
        id: +req.query.userId.toString()
      }
    });
    return res.json({
      ok: true,
      user
    });
  } catch (error) {
    console.error(error, 'userDetail');
  }
};
export default userDetail;
