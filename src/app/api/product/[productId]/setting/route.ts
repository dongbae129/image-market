import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { checkAuth } from '@libs/server/auth';
import client from '@libs/server/client';
import { NextRequest, NextResponse } from 'next/server';

type UpdateProductBody = {
  title?: unknown;
  description?: unknown;
  hashtag?: unknown;
  productAuth?: unknown;
  tempKey?: unknown;
};

export async function PUT(
  request: NextRequest,
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

  let body: UpdateProductBody;
  try {
    body = (await request.json()) as UpdateProductBody;
  } catch {
    return NextResponse.json(
      { ok: false, message: '수정 요청 형식이 올바르지 않습니다.' },
      { status: 400 }
    );
  }

  if (
    typeof body.title !== 'string' ||
    !body.title.trim() ||
    typeof body.description !== 'string' ||
    typeof body.hashtag !== 'string' ||
    typeof body.productAuth !== 'boolean'
  ) {
    return NextResponse.json(
      { ok: false, message: '상품 정보를 모두 입력해주세요.' },
      { status: 400 }
    );
  }
  const title = (body.title as string).trim();

  let replacementImage: string | undefined;
  if (body.tempKey !== undefined) {
    if (
      typeof body.tempKey !== 'string' ||
      !body.tempKey.startsWith('temp/')
    ) {
      return NextResponse.json(
        { ok: false, message: '이미지 업로드 키가 올바르지 않습니다.' },
        { status: 400 }
      );
    }

    replacementImage = body.tempKey.slice('temp/'.length);
    if (!replacementImage || replacementImage.includes('/') || replacementImage.includes('\\')) {
      return NextResponse.json(
        { ok: false, message: '이미지 업로드 키가 올바르지 않습니다.' },
        { status: 400 }
      );
    }
  }

  try {
    const existingProduct = await client.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        userId: true,
        status: true,
        image: true,
        title: true,
        description: true,
        auth: true,
        hashtag: { select: { hashtag: true } }
      }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { ok: false, message: '상품을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    if (existingProduct.userId !== Number(auth.userId)) {
      return NextResponse.json(
        { ok: false, message: '상품 소유자만 수정할 수 있습니다.' },
        { status: 403 }
      );
    }

    if (existingProduct.status === 'PROCESSING') {
      return NextResponse.json(
        { ok: false, message: '이미지 처리 중인 상품은 잠시 후 수정할 수 있습니다.' },
        { status: 409 }
      );
    }

    const updatedProduct = await client.$transaction(async (tx) => {
      const product = await tx.product.update({
        where: { id: productId },
        data: {
          title,
          description: body.description as string,
          auth: body.productAuth as boolean,
          ...(replacementImage
            ? { image: replacementImage, status: 'PROCESSING' }
            : {})
        }
      });

      await tx.hashTag.upsert({
        where: { productId },
        update: { hashtag: body.hashtag as string },
        create: { productId, hashtag: body.hashtag as string }
      });

      return product;
    });

    if (body.tempKey && replacementImage) {
      const sqs = new SQSClient({ region: process.env.AWS_REGION });
      try {
        await sqs.send(
          new SendMessageCommand({
            QueueUrl: process.env.AWS_SQS_QUEUE_URL!,
            MessageBody: JSON.stringify({
              feenId: productId,
              tempKey: body.tempKey
            })
          })
        );
      } catch (error) {
        await client.$transaction(async (tx) => {
          await tx.product.update({
            where: { id: productId },
            data: {
              image: existingProduct.image,
              title: existingProduct.title,
              description: existingProduct.description,
              auth: existingProduct.auth,
              status: existingProduct.status
            }
          });

          if (existingProduct.hashtag) {
            await tx.hashTag.upsert({
              where: { productId },
              update: { hashtag: existingProduct.hashtag.hashtag },
              create: {
                productId,
                hashtag: existingProduct.hashtag.hashtag
              }
            });
          } else {
            await tx.hashTag.deleteMany({ where: { productId } });
          }
        });
        throw error;
      }
    }

    return NextResponse.json({ ok: true, product: updatedProduct });
  } catch (error) {
    console.error('Product update failed:', error);
    return NextResponse.json(
      { ok: false, message: '상품 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}
