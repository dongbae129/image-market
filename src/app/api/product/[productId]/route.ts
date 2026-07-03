import { ResponseType, imgDelete, timeFailed } from '@libs/server/utils';
import client from '@libs/server/client';
import { type NextRequest, NextResponse } from 'next/server';
type Props = {
  params: {
    productId: string;
  };
};
export const GET = async (req: NextRequest, { params }: Props) => {
  const { productId } = params;
  if (!productId)
    return NextResponse.json(
      {
        ok: false,
        message: "dont't have productId"
      },
      {
        status: 401
      }
    );
  try {
    const product = await client.product.findUnique({
      where: {
        id: +productId
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
            id: true
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
      const timeExpired = timeFailed(product);
      return NextResponse.json({
        ok: true,
        product,
        timeExpired
      });
    } else {
      return NextResponse.json({
        ok: false,
        message: 'fail to find the product'
      });
    }
  } catch (error) {
    console.error(error, 'getProductError');
  }
};
export const PUT = async (req) => {
  return NextResponse.json({
    message: '???'
  });
};
// const Product = async (
//   req: NextApiRequest,
//   res: NextApiResponse<ResponseType>
// ) => {
//   if (req.method === 'GET') {
//     console.log('product test');
//     const { productId } = req.query;
//     if (!productId)
//       return res.status(401).json({
//         ok: false,
//         message: "dont't have productId"
//       });
//     try {
//       const product = await client.product.findUnique({
//         where: {
//           id: +productId
//         },
//         include: {
//           user: {
//             select: {
//               email: true,
//               name: true
//             }
//           },
//           productHit: {
//             select: {
//               hit: true
//             }
//           },
//           hashtag: {
//             select: {
//               hashtag: true
//             }
//           }
//         }
//       });
//       if (product) {
//         await client.productHit.update({
//           where: {
//             productId: product.id
//           },
//           data: {
//             hit: {
//               increment: 1
//             }
//           }
//         });
//         if (product.productHit) product.productHit.hit++;

//         return res.json({
//           ok: true,
//           product
//         });
//       } else {
//         return res.json({
//           ok: false,
//           message: 'fail to find the product'
//         });
//       }
//     } catch (error) {
//       console.error(error, 'getProductError');
//     }
//   } else if (req.method === 'DELETE') {
//     console.log(req.body, 'body');
//     console.log(req.query, 'query');
//     const { productId } = req.query;
//     if (!productId)
//       return res.status(401).json({
//         ok: false,
//         message: "doesn't have product"
//       });

//     try {
//       const product = await client.product.findUnique({
//         where: {
//           id: +productId.toString()
//         }
//       });
//       if (!product)
//         return res.status(401).json({
//           ok: false,
//           message: "doesn't have the product"
//         });
//       await client.product.delete({
//         where: {
//           id: +productId.toString()
//         }
//       });
//       const { nowater, water } = imgDelete(product.image);
//       let imgDeleteState = true;
//       if (!nowater || !water) {
//         console.error('fail to delete img file');
//         imgDeleteState = false;
//       }

//       res.json({
//         ok: true,
//         message: 'success delete the products',
//         imgDeleteState
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({
//         ok: false,
//         message: error
//       });
//     }
//   }
// };

// export default Product;
