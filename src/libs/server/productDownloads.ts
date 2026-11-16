import client from '@libs/server/client';
import path from 'node:path';

export class ProductDownloadError extends Error {
  constructor(
    public readonly code:
      | 'PRODUCT_UNAVAILABLE'
      | 'PURCHASE_REQUIRED'
      | 'VERSION_BLOCKED'
      | 'ENTITLEMENT_REQUIRED',
    message: string
  ) {
    super(message);
    this.name = 'ProductDownloadError';
  }
}

export class ProductManagementError extends Error {
  constructor(
    public readonly code: 'NOT_FOUND' | 'NOT_OWNER' | 'VERSION_NOT_FOUND',
    message: string
  ) {
    super(message);
    this.name = 'ProductManagementError';
  }
}

export async function withdrawProduct({
  userId,
  productId
}: {
  userId: number;
  productId: number;
}): Promise<void> {
  const product = await client.product.findUnique({
    where: { id: productId },
    select: { userId: true, saleStatus: true }
  });
  if (!product) {
    throw new ProductManagementError('NOT_FOUND', '상품을 찾을 수 없습니다.');
  }
  if (product.userId !== userId) {
    throw new ProductManagementError(
      'NOT_OWNER',
      '상품 소유자만 삭제할 수 있습니다.'
    );
  }
  await client.product.update({
    where: { id: productId },
    data: { saleStatus: 'WITHDRAWN' }
  });
}

export async function blockProductVersion({
  productVersionId,
  reason
}: {
  productVersionId: number;
  reason: string;
}): Promise<void> {
  const result = await client.productVersion.updateMany({
    where: { id: productVersionId },
    data: { status: 'TAKEN_DOWN', moderationReason: reason }
  });
  if (!result.count) {
    throw new ProductManagementError(
      'VERSION_NOT_FOUND',
      '상품 버전을 찾을 수 없습니다.'
    );
  }
}

export async function getProductDownload({
  userId,
  productId,
  productVersionId
}: {
  userId: number;
  productId: number;
  productVersionId?: number;
}): Promise<{ key: string; filename: string }> {
  const product = await client.product.findUnique({
    where: { id: productId },
    select: {
      title: true,
      image: true,
      auth: true,
      status: true,
      saleStatus: true
    }
  });

  if (!product || product.saleStatus === 'TAKEN_DOWN') {
    throw new ProductDownloadError(
      'PRODUCT_UNAVAILABLE',
      '다운로드할 상품을 찾을 수 없습니다.'
    );
  }

  const sanitizeTitle = (title: string) =>
    title.replace(/[\\/:*?"<>|\u0000-\u001f]/g, '_').trim();

  if (!productVersionId) {
    if (
      product.saleStatus !== 'ACTIVE' ||
      product.auth ||
      product.status !== 'READY' ||
      !product.image
    ) {
      throw new ProductDownloadError(
        'PURCHASE_REQUIRED',
        'Pro 상품은 구매 후 원본을 다운로드할 수 있습니다.'
      );
    }
    return {
      key: `736x/${product.image}`,
      filename: `${sanitizeTitle(product.title) || `image-${productId}`}${path.extname(product.image)}`
    };
  }

  const version = await client.productVersion.findFirst({
    where: { id: productVersionId, productId },
    select: { id: true, imageKey: true, status: true }
  });
  if (!version || version.status === 'TAKEN_DOWN') {
    throw new ProductDownloadError(
      'VERSION_BLOCKED',
      '이 이미지 버전은 더 이상 다운로드할 수 없습니다.'
    );
  }

  const entitlement = await client.productEntitlement.findUnique({
    where: {
      userId_productVersionId: { userId, productVersionId }
    },
    select: { titleAtPurchase: true }
  });
  if (!entitlement) {
    throw new ProductDownloadError(
      'ENTITLEMENT_REQUIRED',
      '이 Pro 이미지 버전을 구매해야 다운로드할 수 있습니다.'
    );
  }

  return {
    key: `original/${version.imageKey}`,
    filename: `${sanitizeTitle(entitlement.titleAtPurchase) || `image-${productId}`}${path.extname(version.imageKey)}`
  };
}
