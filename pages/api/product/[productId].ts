import { ResponseType } from '@libs/server/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/server/client';
const Product = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  if (req.method === 'GET') {
    const { productId } = req.query;
    try {
      const product = await client.product.findUnique({
        where: {
          id: +productId
        },
        include: {
          user: {
            select: {
              email: true,
              name: true
            }
          }
        }
      });
      return res.json({
        ok: true,
        product
      });
    } catch (error) {
      console.error(error, 'getProductError');
    }
  }
};

export default Product;
