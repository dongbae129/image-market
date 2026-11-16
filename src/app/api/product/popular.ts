import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/server/client';
const Popular = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      console.log(req.query, '@@');
      const products = await client.product.findMany({
        take: 40,
        where: { status: 'READY', saleStatus: 'ACTIVE' }
      });
      return res.json({
        products
      });
    } catch (e) {
      console.error(e);
    }
  }
};

export default Popular;
