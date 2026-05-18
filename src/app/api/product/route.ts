// import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/server/client';
import { NextRequest, NextResponse } from 'next/server';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

import { checkAuth } from '@libs/server/auth';
import { dbNow } from '@libs/server/utils';
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
        status: 'READY',
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
        dominantColor: true,
        lqip: true,
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
  // const auth = checkAuth();
  // if (auth.checkError) {
  //   return NextResponse.json(
  //     {
  //       ok: false,
  //       auth
  //     },
  //     {
  //       status: 401
  //     }
  //   );
  // }
  // const userId = auth?.payload?.id;

  // const test = await req.json();
  const productInfo = await req.json();
  const now = dbNow();
  const userId = 2;
  let feenId = null;

  try {
    const { productAuth, title, hashtag, description, ratio, tempKey } =
      productInfo;
    const imageKey = tempKey.slice(5);
    const sqs = new SQSClient({ region: process.env.AWS_REGION });
    const product = await client.product.create({
      data: {
        image: imageKey,
        title,
        description,
        userId,
        auth: !!productAuth,
        ratio,
        createdAt: now,
        updatedAt: now
      }
    });
    feenId = product.id;
    await client.productHit.create({
      data: {
        hit: 0,
        productId: product.id
      }
    });
    await client.hashTag.create({
      data: {
        hashtag,
        productId: product.id
      }
    });
    await sqs.send(
      new SendMessageCommand({
        QueueUrl: process.env.AWS_SQS_QUEUE_URL!,
        MessageBody: JSON.stringify({ feenId, tempKey })
      })
    );
    return NextResponse.json({
      ok: true
    });
  } catch (error) {
    if (feenId) {
      await client.product
        .update({
          where: {
            id: feenId
          },
          data: {
            status: 'FAILED'
          }
        })
        .catch((e) => {
          console.error('롤백실패', e);
        });
    }
    return NextResponse.json(
      {
        ok: false,
        message: '업로드실패'
      },
      {
        status: 500
      }
    );
  }

  // const bucketName = process.env.AWS_S3_BUCKET_NAME!;

  // const file = await req.json();
  // const uuid = uuIdV4();
  // console.log(file, 'file');
  // const filetype = file.type.split('/')[1];
  // const tempKey = `temp/${uuid}.${filetype}`;

  // const s3 = new S3Client({
  //   region: process.env.AWS_REGION!
  // });
  // // const command = new PutObjectCommand({
  // //   Bucket: bucketName,
  // //   Key: tempKey,
  // //   ContentType: file.type,
  // // });

  // // const url = await getSignedUrl(s3, command, {
  // //   expiresIn: 60 * 5,
  // // });
  // const { url, fields } = await createPresignedPost(s3, {
  //   Bucket: process.env.AWS_S3_BUCKET_NAME!,
  //   Key: tempKey,
  //   Conditions: [
  //     ['content-length-range', 0, 10485760], // 파일 크기 최대 10MB 강제
  //     ['starts-with', '$Content-Type', 'image/'] // 이미지 파일만 허용
  //   ],
  //   Expires: 60 // 🌟 60초 뒤 티켓 폐기 (리플레이 공격 최소화)
  // });
  // return NextResponse.json({
  //   ok: true,
  //   data: {
  //     url,
  //     fields
  //   }
  // });
};
