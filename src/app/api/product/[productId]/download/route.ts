import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { checkAuth } from '@libs/server/auth';
import { NextRequest, NextResponse } from 'next/server';
import {
  getProductDownload,
  ProductDownloadError
} from '@libs/server/productDownloads';
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

  const rawVersionId = _request.nextUrl.searchParams.get('productVersionId');
  const productVersionId =
    rawVersionId === null ? undefined : Number(rawVersionId);
  if (
    rawVersionId !== null &&
    (!Number.isInteger(productVersionId) || (productVersionId ?? 0) <= 0)
  ) {
    return NextResponse.json(
      { ok: false, message: '올바르지 않은 상품 버전입니다.' },
      { status: 400 }
    );
  }

  try {
    const target = await getProductDownload({
      userId: Number(auth.userId),
      productId,
      productVersionId
    });
    const filename = target.filename;
    const extension = path.extname(filename);
    const fallbackFilename = `image-${productId}${extension}`;
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: target.key,
      ResponseContentDisposition: `attachment; filename="${fallbackFilename}"; filename*=UTF-8''${encodeRFC5987Value(filename)}`
    });
    const url = await getSignedUrl(s3, command, { expiresIn: 300 });

    return NextResponse.json({ ok: true, url, expiresIn: 300 });
  } catch (error) {
    if (error instanceof ProductDownloadError) {
      const status =
        error.code === 'ENTITLEMENT_REQUIRED'
          ? 403
          : error.code === 'PURCHASE_REQUIRED'
            ? 402
            : 404;
      return NextResponse.json(
        { ok: false, code: error.code, message: error.message },
        { status }
      );
    }
    console.error('Product image download URL error:', error);
    return NextResponse.json(
      { ok: false, message: '다운로드 링크를 만들지 못했습니다.' },
      { status: 500 }
    );
  }
}
