import { NextApiRequest, NextApiResponse } from 'next';
import { ResponseType } from '@libs/server/utils';
import client from '@libs/server/client';
const userProducts = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  if (req.method === 'GET') {
    try {
      const { userId } = req.query;
      let lastId = 0;
      if (req.query.id) lastId = +req.query.id.toString();

      if (!userId)
        return res.status(401).json({
          ok: false,
          message: 'not userId'
        });
      const products = await client.product.findMany({
        where: {
          userId: +userId
        },
        take: 6,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } })
      });
      return res.json({
        ok: true,
        products
      });
    } catch (e) {
      console.error(e, 'faile method GET');
      return res.status(501).json({
        ok: false,
        message: 'error server'
      });
    }
  } else if (req.method === 'POST') {
    return res.status(400).json({
      ok: false,
      meesage: '나중에'
    });
  }
};
export default userProducts;
