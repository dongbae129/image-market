import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import client from '@libs/server/client';
import { checkAuth } from '@libs/server/auth';
import { NextRequest, NextResponse } from 'next/server';
import path from 'node:path';

const s3 = new S3Client({
  region: process.env.AWS_REGION!
});

const encodeRFC5987Value = (value: string) =>
  encodeURIComponent(value).replace(
    /[!'()*]/g,
    (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`
  );

export async function GET(
  _request: NextRequest,
  { params }: { params: { productId: string } }
) {
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
      { ok: false, message: '올바르지 않은 상품 ID입니다.' },
      { status: 400 }
    );
  }

  try {
    const product = await client.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        image: true,
        title: true,
        auth: true,
        status: true,
        userId: true
      }
    });

    if (!product || product.status !== 'READY' || !product.image) {
      return NextResponse.json(
        { ok: false, message: '다운로드할 이미지를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    // auth PRO버전 다운 나중에 구현
    // if (product.auth && product.userId !== Number(auth.userId)) {
    //   const entitlement = await client.productAuth.findFirst({
    //     where: {
    //       productId: product.id,
    //       userId: Number(auth.userId)
    //     },
    //     select: { id: true }
    //   });

    //   if (!entitlement) {
    //     return NextResponse.json(
    //       { ok: false, message: '이 이미지를 다운로드할 권한이 없습니다.' },
    //       { status: 403 }
    //     );
    //   }
    // }

    const extension = path.extname(product.image);
    const safeTitle = product.title
      .replace(/[\\/:*?"<>|\u0000-\u001f]/g, '_')
      .trim();
    const filename = `${safeTitle || `image-${product.id}`}${extension}`;
    const fallbackFilename = `image-${product.id}${extension}`;
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: `original/${product.image}`,
      ResponseContentDisposition: `attachment; filename="${fallbackFilename}"; filename*=UTF-8''${encodeRFC5987Value(filename)}`
    });
    const url = await getSignedUrl(s3, command, { expiresIn: 300 });

    return NextResponse.json({ ok: true, url, expiresIn: 300 });
  } catch (error) {
    console.error('Product image download URL error:', error);
    return NextResponse.json(
      { ok: false, message: '다운로드 링크를 만들지 못했습니다.' },
      { status: 500 }
    );
  }
}
