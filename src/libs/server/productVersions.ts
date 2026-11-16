import { Prisma, ProductVersion } from '@prisma/client';
import client from '@libs/server/client';

export type ProductVersionState = 'ACTIVE' | 'RETIRED' | 'TAKEN_DOWN';

export async function publishProductVersion({
  productId,
  imageKey
}: {
  productId: number;
  imageKey: string;
}): Promise<ProductVersion> {
  return client.$transaction((tx) =>
    publishProductVersionInTransaction(tx, { productId, imageKey })
  );
}

export async function publishProductVersionInTransaction(
  tx: Prisma.TransactionClient,
  { productId, imageKey }: { productId: number; imageKey: string }
): Promise<ProductVersion> {
  const latestVersion = await tx.productVersion.findFirst({
    where: { productId },
    orderBy: { version: 'desc' },
    select: { version: true }
  });

  await tx.productVersion.updateMany({
    where: { productId, status: 'ACTIVE' },
    data: { status: 'RETIRED' }
  });

  return tx.productVersion.create({
    data: {
      productId,
      version: (latestVersion?.version ?? 0) + 1,
      imageKey,
      status: 'ACTIVE'
    }
  });
}

export async function retireActiveProVersion({
  productId,
  nextStatus
}: {
  productId: number;
  nextStatus: Extract<ProductVersionState, 'RETIRED' | 'TAKEN_DOWN'>;
}): Promise<void> {
  await client.productVersion.updateMany({
    where: { productId, status: 'ACTIVE' },
    data: { status: nextStatus }
  });
}
