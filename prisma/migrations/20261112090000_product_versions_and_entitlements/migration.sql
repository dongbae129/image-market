-- AlterTable
ALTER TABLE "Product" ADD COLUMN "saleStatus" TEXT NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "ProductVersion" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "version" INTEGER NOT NULL,
    "imageKey" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "moderationReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductEntitlement" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "productVersionId" INTEGER NOT NULL,
    "paymentType" TEXT NOT NULL,
    "amountPaid" INTEGER NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductEntitlement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Product_saleStatus_status_idx" ON "Product"("saleStatus", "status");

-- CreateIndex
CREATE INDEX "ProductVersion_productId_status_idx" ON "ProductVersion"("productId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVersion_productId_version_key" ON "ProductVersion"("productId", "version");

-- CreateIndex
CREATE INDEX "ProductEntitlement_userId_createdAt_idx" ON "ProductEntitlement"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProductEntitlement_userId_productVersionId_key" ON "ProductEntitlement"("userId", "productVersionId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductEntitlement_userId_idempotencyKey_key" ON "ProductEntitlement"("userId", "idempotencyKey");

-- AddForeignKey
ALTER TABLE "ProductVersion" ADD CONSTRAINT "ProductVersion_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductEntitlement" ADD CONSTRAINT "ProductEntitlement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductEntitlement" ADD CONSTRAINT "ProductEntitlement_productVersionId_fkey" FOREIGN KEY ("productVersionId") REFERENCES "ProductVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Backfill the current image for each existing Pro listing as its first version.
INSERT INTO "ProductVersion" ("productId", "version", "imageKey", "status", "createdAt")
SELECT "id", 1, "image", 'ACTIVE', "createdAt"
FROM "Product"
WHERE "auth" = TRUE;
