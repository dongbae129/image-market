import { ResponseType } from '@libs/server/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/server/client';
const Product = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  if (req.method === 'GET') {
    const { productId } = req.query;
    if (!productId)
      return res.status(401).json({
        ok: false,
        message: "dont't have productId"
      });
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
        if (product.productHit) product.productHit.hit++;

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
  } else if (req.method === 'DELETE') {
    console.log(req.body, 'body');
    console.log(req.query, 'query');
    const { productId } = req.query;
    if (!productId)
      return res.status(401).json({
        ok: false,
        message: "doesn't have product"
      });

    try {
      const product = await client.product.findUnique({
        where: {
          id: +productId.toString()
        }
      });
      if (!product)
        return res.status(401).json({
          ok: false,
          message: "doesn't have the product"
        });
      await client.product.delete({
        where: {
          id: +productId.toString()
        }
      });

      res.json({
        ok: true,
        message: 'success delete the products'
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        ok: false,
        message: error
      });
    }
  }
};

export default Product;
