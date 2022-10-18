import { ResponseType } from '@libs/server/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/server/client';
const Product = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      console.log(req.query, '@@');
      const products = await client.product.findMany({
        take: 6,
        cursor: {
          id: +req.query.id!
        }
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
