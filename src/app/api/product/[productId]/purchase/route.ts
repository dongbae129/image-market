import { checkAuth } from '@libs/server/auth';
import {
  getProductPurchaseInfo,
  ProductPurchaseError,
  purchaseProductVersion,
  type ProductPaymentType
} from '@libs/server/productEntitlements';
import { NextRequest, NextResponse } from 'next/server';

type Props = { params: { productId: string } };

const parseIds = (productId: string, rawVersionId: string | null) => {
  const id = Number(productId);
  const productVersionId = Number(rawVersionId);
  if (
    !Number.isInteger(id) ||
    id <= 0 ||
    !Number.isInteger(productVersionId) ||
    productVersionId <= 0
  ) {
    return null;
  }
  return { productId: id, productVersionId };
};

const errorResponse = (error: unknown) => {
  if (error instanceof ProductPurchaseError) {
    const status =
      error.code === 'INSUFFICIENT_BALANCE'
        ? 402
        : error.code === 'PRODUCT_UNAVAILABLE'
          ? 404
          : 409;
    return NextResponse.json(
      { ok: false, code: error.code, message: error.message },
      { status }
    );
  }
  console.error('Product purchase request failed:', error);
  return NextResponse.json(
    { ok: false, message: '구매 요청을 처리하지 못했습니다.' },
    { status: 500 }
  );
};

export async function GET(request: NextRequest, { params }: Props) {
  const auth = checkAuth();
  if (auth.checkError || !auth.userId) {
    return NextResponse.json(
      { ok: false, message: '로그인이 필요합니다.' },
      { status: 401 }
    );
  }

  const ids = parseIds(
    params.productId,
    request.nextUrl.searchParams.get('productVersionId')
  );
  if (!ids) {
    return NextResponse.json(
      { ok: false, message: '상품 정보가 올바르지 않습니다.' },
      { status: 400 }
    );
  }

  try {
    const info = await getProductPurchaseInfo({
      userId: Number(auth.userId),
      ...ids
    });
    return NextResponse.json({ ok: true, ...info });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest, { params }: Props) {
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

  let body: {
    productVersionId?: unknown;
    paymentType?: unknown;
    idempotencyKey?: unknown;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { ok: false, message: '구매 요청 형식이 올바르지 않습니다.' },
      { status: 400 }
    );
  }

  const productVersionId = Number(body.productVersionId);
  if (
    !Number.isInteger(productVersionId) ||
    productVersionId <= 0 ||
    (body.paymentType !== 'COIN' && body.paymentType !== 'BONUS_COUPON') ||
    typeof body.idempotencyKey !== 'string' ||
    body.idempotencyKey.length < 8 ||
    body.idempotencyKey.length > 128
  ) {
    return NextResponse.json(
      { ok: false, message: '구매 정보가 올바르지 않습니다.' },
      { status: 400 }
    );
  }

  try {
    const result = await purchaseProductVersion({
      userId: Number(auth.userId),
      productId,
      productVersionId,
      paymentType: body.paymentType as ProductPaymentType,
      idempotencyKey: body.idempotencyKey
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return errorResponse(error);
  }
}
