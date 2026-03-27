// import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/server/client';
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { nanoid } from 'nanoid';
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
      },
      select: {
        id: true,
        image: true,
        title: true,
        ratio: true,
        description: true,
        commentsCount: true,
        likesCount: true,
        user: {
          select: {
            id: true,
            image: true,
            name: true
          }
        }
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
export const POST = async (req: NextRequest, res: NextResponse) => {
  const bucketName = process.env.AWS_S3_BUCKET_NAME!;

  const file = await req.json();

  console.log(file, 'file');
  const key = nanoid() + file.name;

  const s3 = new S3Client({
    region: process.env.AWS_REGION!
  });
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: file.type
  });
  const url = await getSignedUrl(s3, command, {
    expiresIn: 60 * 5
  });

  return NextResponse.json({
    ok: true,
    data: {
      url,
      key
    }
  });
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
