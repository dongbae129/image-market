import { ResponseType } from '@libs/server/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/server/client';
const Product = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  if (req.method === 'GET') {
    try {
      const products = await client.product.findMany();
      return res.json({
        ok: true,
        products
      });
    } catch (e) {
      console.error(e);
    }
  }
};

export default Product;
