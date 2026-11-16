-- Keep a purchase's displayed product name stable after the listing is renamed.
ALTER TABLE "ProductEntitlement" ADD COLUMN "titleAtPurchase" TEXT;

-- Existing entitlements can only be backfilled with the current product title.
UPDATE "ProductEntitlement" AS entitlement
SET "titleAtPurchase" = product."title"
FROM "ProductVersion" AS version
JOIN "Product" AS product ON product."id" = version."productId"
WHERE version."id" = entitlement."productVersionId";

ALTER TABLE "ProductEntitlement"
ALTER COLUMN "titleAtPurchase" SET NOT NULL;
