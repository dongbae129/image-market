// import { R2Client } from '@app/r2client';
import {
  GetObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';
import client from '@libs/server/client';
import { dbNow, validateFormData } from '@libs/server/utils';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { checkAuth } from '@libs/server/auth';
import { TokenPayload } from '@libs/server/utils';
import { nanoid } from 'nanoid';

const endpoint = process.env.NEXT_R2_S3_CLIENT_ENDPOINT!;
const accessKeyId = process.env.NEXT_R2_ACCESS_KEY_ID!;
const secretAccessKey = process.env.NEXT_R2_SECRET_ACCESS_KEY!;
const bucketName = process.env.NEXT_R2_BUCKET_NAME!;
const S3 = new S3Client({
  region: 'auto',
  endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey
  },
  forcePathStyle: true
});

const uploadImg = async (file: Buffer, fileName: string) => {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: file,
    ContentType: file.type
  });
  const imgUrl = await S3.send(command);
  return imgUrl;
};

export const POST = async (request: NextRequest) => {
  const auth = checkAuth();
  if (auth.checkError) {
    return NextResponse.json(
      {
        ok: false,
        auth
      },
      {
        status: 401
      }
    );
  }

  const userId = auth?.payload?.id;
  try {
    const form = await request.formData();
    const file = form.get('file') as File;

    const requiredFields = ['title', 'description', 'productAuth', 'ratio'];
    const missingFields = validateFormData(form, requiredFields);

    if (missingFields.length > 0)
      return NextResponse.json({
        ok: false,
        message: 'need to product information'
      });
    if (!file) return NextResponse.json({ error: 'File is required.' });
    const nano = nanoid();
    const buffer = Buffer.from(await file.arrayBuffer());
    const nanoImageKey = nano + file.name;
    const imgKey = await uploadImg(buffer, nanoImageKey);

    const now = dbNow();
    const product = await client.product.create({
      data: {
        image: nanoImageKey,
        title: form.get('title') as string,
        description: form.get('description') as string,
        userId,
        auth: !!form.get('productAuth'),
        ratio: form.get('ratio') as string,
        createdAt: now,
        updatedAt: now
      }
    });
    await client.productHit.create({
      data: {
        hit: 0,
        productId: product.id
      }
    });
    await client.hashTag.create({
      data: {
        hashtag: form.get('hashtag'),
        productId: product.id
      }
    });
    return NextResponse.json({
      ok: true,
      message: 'success make product',
      product: {
        id: product.id
      }
    });
  } catch (error: any) {
    console.error(error, 'error');
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
