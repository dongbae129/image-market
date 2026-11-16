import { Prisma, ProductEntitlement } from '@prisma/client';
import client from '@libs/server/client';

export type ProductPaymentType = 'COIN' | 'BONUS_COUPON';

export class ProductPurchaseError extends Error {
  constructor(
    public readonly code:
      | 'PRODUCT_UNAVAILABLE'
      | 'INSUFFICIENT_BALANCE'
      | 'IDEMPOTENCY_CONFLICT',
    message: string
  ) {
    super(message);
    this.name = 'ProductPurchaseError';
  }
}

const paymentAmount = (paymentType: ProductPaymentType) =>
  paymentType === 'COIN' ? 10 : 1;

export async function getProductPurchaseInfo({
  userId,
  productId,
  productVersionId
}: {
  userId: number;
  productId: number;
  productVersionId: number;
}) {
  const version = await client.productVersion.findFirst({
    where: {
      id: productVersionId,
      productId,
      status: 'ACTIVE',
      product: {
        auth: true,
        status: 'READY',
        saleStatus: 'ACTIVE'
      }
    },
    select: { id: true }
  });

  if (!version) {
    throw new ProductPurchaseError(
      'PRODUCT_UNAVAILABLE',
      '현재 구매할 수 없는 Pro 상품입니다.'
    );
  }

  const entitlement = await client.productEntitlement.findUnique({
    where: {
      userId_productVersionId: { userId, productVersionId }
    },
    select: { id: true }
  });

  return { coinCost: 10, couponCost: 1, owned: Boolean(entitlement) };
}

export async function purchaseProductVersion({
  userId,
  productId,
  productVersionId,
  paymentType,
  idempotencyKey
}: {
  userId: number;
  productId: number;
  productVersionId: number;
  paymentType: ProductPaymentType;
  idempotencyKey: string;
}): Promise<{ entitlement: ProductEntitlement; charged: boolean }> {
  const existing = await client.productEntitlement.findUnique({
    where: {
      userId_productVersionId: { userId, productVersionId }
    }
  });
  if (existing) return { entitlement: existing, charged: false };

  const reusedKey = await client.productEntitlement.findUnique({
    where: {
      userId_idempotencyKey: { userId, idempotencyKey }
    }
  });
  if (reusedKey) {
    if (reusedKey.productVersionId === productVersionId) {
      return { entitlement: reusedKey, charged: false };
    }
    throw new ProductPurchaseError(
      'IDEMPOTENCY_CONFLICT',
      '요청 키가 다른 구매에 이미 사용되었습니다.'
    );
  }

  const amountPaid = paymentAmount(paymentType);
  try {
    const entitlement = await client.$transaction(async (tx) => {
      const version = await tx.productVersion.findFirst({
        where: {
          id: productVersionId,
          productId,
          status: 'ACTIVE',
          product: {
            auth: true,
            status: 'READY',
            saleStatus: 'ACTIVE'
          }
        },
        select: {
          id: true,
          product: { select: { title: true } }
        }
      });
      if (!version) {
        throw new ProductPurchaseError(
          'PRODUCT_UNAVAILABLE',
          '현재 구매할 수 없는 Pro 상품입니다.'
        );
      }

      const debit = await tx.user.updateMany({
        where:
          paymentType === 'COIN'
            ? { id: userId, coin: { gte: amountPaid } }
            : { id: userId, bonusCoupon: { gte: amountPaid } },
        data:
          paymentType === 'COIN'
            ? { coin: { decrement: amountPaid } }
            : { bonusCoupon: { decrement: amountPaid } }
      });
      if (debit.count !== 1) {
        throw new ProductPurchaseError(
          'INSUFFICIENT_BALANCE',
          paymentType === 'COIN'
            ? '코인이 부족합니다.'
            : '보너스 쿠폰이 부족합니다.'
        );
      }

      return tx.productEntitlement.create({
        data: {
          userId,
          productVersionId,
          titleAtPurchase: version.product.title,
          paymentType,
          amountPaid,
          idempotencyKey
        }
      });
    });

    return { entitlement, charged: true };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      const winner = await client.productEntitlement.findUnique({
        where: {
          userId_productVersionId: { userId, productVersionId }
        }
      });
      if (winner) return { entitlement: winner, charged: false };

      const keyOwner = await client.productEntitlement.findUnique({
        where: { userId_idempotencyKey: { userId, idempotencyKey } }
      });
      if (keyOwner) {
        throw new ProductPurchaseError(
          'IDEMPOTENCY_CONFLICT',
          '요청 키가 다른 구매에 이미 사용되었습니다.'
        );
      }
    }
    throw error;
  }
}
