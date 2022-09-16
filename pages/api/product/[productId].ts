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
          },
          productHit: {
            select: {
              hit: true
            }
          },
          hashtag: {
            select: {
              hashtag: true
            }
          }
        }
      });
      if (product) {
        await client.productHit.update({
          where: {
            productId: product.id
          },
          data: {
            hit: {
              increment: 1
            }
          }
        });

        product.productHit[0].hit++;
        return res.json({
          ok: true,
          product
        });
      } else {
        return res.json({
          ok: false,
          message: 'fail to find the product'
        });
      }
    } catch (error) {
      console.error(error, 'getProductError');
    }
  }
};

export default Product;
