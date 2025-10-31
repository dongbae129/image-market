// import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/server/client';
import { type NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest, res) => {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get('id');
  const searchQuery = searchParams.get('search');
  try {
    if (!id)
      return NextResponse.json({
        ok: false,
        message: 'not have lastId'
      });
    let lastId = 0;
    lastId = +id.toString();

    const products = await client.product.findMany({
      take: 6,
      skip: lastId ? 1 : 0,
      ...(lastId && { cursor: { id: lastId } }),
      where: {
        ...(searchQuery
          ? {
              title: {
                contains: searchQuery.toString()
              }
            }
          : {})
      }
    });
    return NextResponse.json({
      products
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        ok: false,
        error: e
      },
      { status: 500 }
    );
  }
};

// const Product = async (req: NextApiRequest, res: NextApiResponse) => {
//   if (req.method === 'GET') {
//     const searchQuery = req.query.search;
//     console.log(searchQuery, 'searchQuery');
//     try {
//       // if (!req.query.id)
//       //   return res.json({
//       //     ok: false,
//       //     message: 'not have lastId'
//       //   });
//       let lastId = 0;
//       if (req.query.id) lastId = +req.query.id.toString();

//       const products = await client.product.findMany({
//         take: 6,
//         skip: lastId ? 1 : 0,
//         ...(lastId && { cursor: { id: lastId } }),
//         where: {
//           ...(searchQuery
//             ? {
//                 title: {
//                   contains: searchQuery.toString()
//                 }
//               }
//             : {})
//         }
//       });
//       return res.json({
//         products
//       });
//     } catch (e) {
//       console.error(e);
//       return res.status(500).json({
//         ok: false,
//         error: e
//       });
//     }
//   }
// };

// export default Product;
