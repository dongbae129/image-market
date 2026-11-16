import { timeFailed } from '@libs/server/utils';
import client from '@libs/server/client';
import { type NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@libs/server/auth';
import {
  ProductManagementError,
  withdrawProduct
} from '@libs/server/productDownloads';
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
    const product = await client.product.findFirst({
      where: {
        id: +productId,
        saleStatus: 'ACTIVE'
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
            id: true,
            image: true
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
        },
        versions: {
          where: { status: 'ACTIVE' },
          orderBy: { version: 'desc' },
          take: 1,
          select: { id: true, version: true }
        }
      }
    });
    if (product) {
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
export const POST = async (_req: NextRequest, { params }: Props) => {
  const { productId } = params;
  if (!productId) {
    return NextResponse.json(
      { ok: false, message: 'missing productId' },
      { status: 400 }
    );
  }

  try {
    const result = await client.productHit.updateMany({
      where: { productId: Number(productId) },
      data: { hit: { increment: 1 } }
    });
    if (!result.count) {
      return NextResponse.json(
        { ok: false, message: 'product not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error, 'productHitIncrementError');
    return NextResponse.json(
      { ok: false, message: 'failed to record product view' },
      { status: 500 }
    );
  }
};

export const DELETE = async (_req: NextRequest, { params }: Props) => {
  const auth = checkAuth();
  if (auth.checkError || !auth.userId) {
    return NextResponse.json(
      { ok: false, message: '로그인이 필요합니다.' },
      { status: 401 }
    );
  }

  const productId = Number(params.productId);
  if (!Number.isInteger(productId) || productId <= 0) {
    return NextResponse.json(
      { ok: false, message: '상품 정보가 올바르지 않습니다.' },
      { status: 400 }
    );
  }

  try {
    await withdrawProduct({ productId, userId: Number(auth.userId) });
    return NextResponse.json({
      ok: true,
      message: '상품 판매를 중단했습니다.'
    });
  } catch (error) {
    if (error instanceof ProductManagementError) {
      return NextResponse.json(
        { ok: false, code: error.code, message: error.message },
        { status: error.code === 'NOT_FOUND' ? 404 : 403 }
      );
    }
    console.error('Product withdrawal failed:', error);
    return NextResponse.json(
      { ok: false, message: '상품 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
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
