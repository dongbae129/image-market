import { checkAuth } from '@libs/server/auth';
import client from '@libs/server/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const auth = checkAuth();
  if (auth.checkError || !auth.userId) {
    return NextResponse.json(
      { ok: false, message: '로그인이 필요합니다.' },
      { status: 401 }
    );
  }

  const rawCursor = request.nextUrl.searchParams.get('cursor');
  const cursor = rawCursor === null ? undefined : Number(rawCursor);
  if (rawCursor !== null && (!Number.isInteger(cursor) || (cursor ?? 0) <= 0)) {
    return NextResponse.json(
      { ok: false, message: '페이지 정보가 올바르지 않습니다.' },
      { status: 400 }
    );
  }

  try {
    const rows = await client.productEntitlement.findMany({
      where: { userId: Number(auth.userId) },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: 21,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      select: {
        id: true,
        paymentType: true,
        amountPaid: true,
        titleAtPurchase: true,
        createdAt: true,
        productVersion: {
          select: {
            id: true,
            productId: true,
            version: true,
            imageKey: true,
            status: true,
            product: {
              select: {
                saleStatus: true
              }
            }
          }
        }
      }
    });

    const hasMore = rows.length > 20;
    const page = rows.slice(0, 20);
    return NextResponse.json({
      ok: true,
      purchases: page.map((purchase) => ({
        id: purchase.id,
        productId: purchase.productVersion.productId,
        productVersionId: purchase.productVersion.id,
        version: purchase.productVersion.version,
        title: purchase.titleAtPurchase,
        paymentType: purchase.paymentType,
        amountPaid: purchase.amountPaid,
        purchasedAt: purchase.createdAt,
        preview: `474x/${purchase.productVersion.imageKey}`,
        canDownload:
          purchase.productVersion.status !== 'TAKEN_DOWN' &&
          purchase.productVersion.product.saleStatus !== 'TAKEN_DOWN'
      })),
      nextCursor: hasMore ? (page[page.length - 1]?.id ?? null) : null
    });
  } catch (error) {
    console.error('Product purchase history failed:', error);
    return NextResponse.json(
      { ok: false, message: '구매 내역을 불러오지 못했습니다.' },
      { status: 500 }
    );
  }
}
