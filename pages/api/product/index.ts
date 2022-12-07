import { ResponseType } from '@libs/server/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/server/client';
const Product = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      // console.log(req.query, '@@');
      if (!req.query.id)
        return res.json({
          ok: false,
          message: 'not have lastId'
        });
      const lastId = +req.query.id.toString();
      console.log(lastId, 'lastId');
      const products = await client.product.findMany({
        take: 6,
        // skip: 1
        // cursor: {
        //   id: lastId
        // }
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } })
        // skip: lastId ? 1 : 0,
        // ...(lastId && { cursor: { id: lastId } })
        // cursor: {
        //   id: +req.query.id!
        // }
      });
      return res.json({
        products
      });
    } catch (e) {
      console.error(e);
    }
  }
};

export default Product;
