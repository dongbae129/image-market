# Product Purchase and Versioning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete normal Product editing, seller withdrawal, version-scoped Pro purchases, and buyer re-downloads without changing Product identity. Rights/safety moderation is deferred.

**Architecture:** Keep `Product` as the public listing and introduce immutable `ProductVersion` records for paid Pro originals plus a `ProductEntitlement` ledger keyed by user and version. Version publishing, coin debit, and entitlement checks live in server-side product services; Next route handlers call those services and the client uses purchase/download history endpoints. Public listing state is separate from image-processing state.

**Tech Stack:** Next.js 14 App Router, TypeScript, Prisma 5 / PostgreSQL, AWS S3 presigned downloads, existing SQS image processing, React Query.

**Spec:** `docs/superpowers/specs/2026-11-10-product-purchase-and-deletion-policy-design.md`

## Global Constraints

- `auth=false`는 무료 상품으로 취급하고 736px 이미지를 제공한다.
- `auth=true`는 Pro 상품으로 취급하고, 재화를 사용해 구매한 버전의 원본을 제공한다.
- Pro 사용권은 상품 버전 단위로 발급한다. 구매자는 구매한 버전을 추가 재화 차감 없이 재다운로드할 수 있다.
- 당장은 판매자가 가격을 정하지 않는다. 구매자는 코인 10개 또는 보너스 쿠폰 1장으로 Pro 버전을 구매한다.
- 일반 상품 삭제는 신규 노출과 구매를 중단하되, 기존 구매자의 구매 버전 권한을 보존한다.
- 일반 삭제 이후에도 기존 구매자는 만료 없이 해당 버전을 재다운로드할 수 있다.
- 구매한 Pro 버전은 삭제 후에도 찾고 다시 받을 수 있도록 회원별 구매 내역을 제공한다.
- 권리·안전 신고, 운영자 강제 차단, 환불은 이번 단계의 비목표다.

## Prerequisites and Open Product Decision

- Keep the existing SQS consumer and payload unchanged. Use a unique base object key in `Product.image` and store the same base key on each Pro version; the worker's existing `474x/`, `736x/`, and `original/` prefixes produce the versioned files. No Lambda source changes are in scope.
- Current Pro payment choices are fixed at 10 `User.coin` or 1 `User.bonusCoupon`; the buyer selects one. Store the actual payment type and amount on the entitlement so later seller-set pricing can be added.
- Do not create a branch or worktree. The user explicitly requested all changes on the existing `feat/delete` branch.
- Preserve the pre-existing local modification in `src/app/api/product/[productId]/route.ts`; inspect its diff before editing and retain its behavior unless the owner explicitly asks otherwise.

## Deferred edge cases

- Rights/safety reports, moderator authorization and UI, forced Product/version takedown, buyer download suspension, and refunds.
- Product restoration/relisting after seller withdrawal.
- S3/CDN object cleanup after free image replacement or normal withdrawal.
- Seller-configurable Pro pricing.

The `TAKEN_DOWN` schema values and defensive download checks are groundwork only. There is no moderator-facing API/UI, so rights/safety takedown is not part of the completed core feature.

## Review Focus

- Concurrent coin/coupon purchases for the same user and version must create only one entitlement and perform at most one selected-currency debit.
- Insufficient selected balance must leave both balances unchanged and create no entitlement.
- A Pro image replacement must use a new base key so the prior purchased version still maps to its original `original/{baseKey}` object.
- A normally withdrawn product must disappear from public discovery while prior buyers can still re-download their version.

---

### Task 1: Add version, entitlement, and publication state to Prisma

**Files:**

- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/<timestamp>_product_versions_and_entitlements/migration.sql`
- Create: `prisma/migrations/<timestamp>_product_entitlement_title_snapshot/migration.sql`
- Test/verify: Prisma schema validation and generated client

**Interfaces:**

- Produces `ProductVersion`: `id`, `productId`, `version`, `imageKey`, `status` (`ACTIVE`, `RETIRED`, reserved `TAKEN_DOWN`), `createdAt`; unique `(productId, version)`. Forced takedown is deferred.
- Produces `ProductEntitlement`: `id`, `userId`, `productVersionId`, `titleAtPurchase`, `paymentType` (`COIN`, `BONUS_COUPON`), `amountPaid`, `idempotencyKey`, `createdAt`; unique `(userId, productVersionId)` and unique `(userId, idempotencyKey)`.
- Existing entitlements are backfilled with the current Product title because their historical title cannot be recovered.
- Adds `Product.saleStatus` with values `ACTIVE`, `WITHDRAWN`, and reserved `TAKEN_DOWN`, independent of the existing image-processing `status`. The normal flow uses `ACTIVE` and `WITHDRAWN` only.
- Existing `ProductAuth` remains untouched in this migration; new purchase logic uses `ProductEntitlement`.

- [x] **Step 1: Add Prisma models and relations**

Add the fields and unique constraints listed in the Interfaces block. Keep purchase records related to a specific ProductVersion. Do not add cascade deletion from Product to versions or entitlements.

- [x] **Step 2: Create and inspect the SQL migration**

Add `saleStatus` with default `ACTIVE`; create version and entitlement tables, foreign keys, and unique indexes. Preserve all Product rows and backfill each existing `auth=true` Product as version 1 using its current `image` key; create no purchase entitlements.

- [x] **Step 3: Validate and generate Prisma Client**

Run: `npx prisma validate`
Expected: schema is valid.

Run: `npx prisma generate`
Expected: Prisma Client includes `productVersion` and `productEntitlement` delegates.

---

### Task 2: Publish free edits and immutable Pro versions

**Files:**

- Create: `src/libs/server/productVersions.ts`
- Modify: `src/app/api/product/route.ts`
- Modify: `src/app/api/product/[productId]/setting/route.ts`
- Keep existing SQS consumer and Lambda source unchanged

**Interfaces:**

- `publishProductVersion({ productId, imageKey }): Promise<ProductVersion>` creates a pending Pro snapshot; its exact return shape is the Prisma `ProductVersion` model.
- `retireActiveProVersion({ productId, nextStatus }): Promise<void>` retires the previous current Pro version. `TAKEN_DOWN` is used only for failed upload cleanup in the current flow; moderator takedown remains deferred.
- Existing SQS payload remains `{ feenId: productId, tempKey, tableType: 'PRODUCT' }`; the existing consumer writes derivatives under the unique base image key and `ProductVersion.imageKey` references that base key.

- [x] **Step 1: Implement version lifecycle service**

Create `productVersions.ts`. Keep free image replacement on the Product row with a new S3 base key. For Pro replacement, retain old keys and create a new ProductVersion using the new image key. The active Pro file is `original/{imageKey}` and previews use `474x/{imageKey}` and `736x/{imageKey}`. Keep Product processing status as the readiness signal; no Lambda changes are planned.

- [x] **Step 2: Wire create and edit routes to the service**

Create a Pro ProductVersion on Pro product creation. On edit, metadata-only changes update Product; free image replacement updates the free image key; Pro image replacement creates a new version; `free → Pro` creates the first Pro version; `Pro → free` retires the active version and changes current listing access. Keep the existing SQS payload and do not edit Lambda code.

Only `ACTIVE` Products can be edited. Seller withdrawal is terminal in this iteration; restoration/relisting is deferred.

---

### Task 3: Implement atomic Pro purchase and entitlement issuance

**Files:**

- Create: `src/libs/server/productEntitlements.ts`
- Create: `src/app/api/product/[productId]/purchase/route.ts`

**Interfaces:**

- `purchaseProductVersion({ userId, productId, productVersionId, paymentType, idempotencyKey }): Promise<{ entitlement: ProductEntitlement; charged: boolean }>`.
- `paymentType` is `COIN` (debit 10 `User.coin`) or `BONUS_COUPON` (debit 1 `User.bonusCoupon`). `charged` is `false` when the user already owns that version.
- `GET /api/product/{productId}/purchase?productVersionId=...` returns `{ ok: true, coinCost: 10, couponCost: 1, owned }` for the signed-in user and requested sellable version.
- `POST /api/product/{productId}/purchase` body: `{ productVersionId: number; paymentType: 'COIN' | 'BONUS_COUPON'; idempotencyKey: string }`; success response: `{ ok: true, entitlement, charged }`.

- [x] **Step 1: Implement transactional purchase service**

In one Prisma transaction, verify the product is `ACTIVE`, the version is currently sellable, and the user does not already own it; conditionally decrement only the selected balance (`coin >= 10` or `bonusCoupon >= 1`); create the entitlement with payment type, amount paid, and idempotency key. Use database uniqueness to make duplicate/concurrent requests safe; any failed entitlement insert must roll back the balance change.

- [x] **Step 2: Add the authenticated purchase route**

Validate path/body IDs and the idempotency key, derive `userId` from `checkAuth()`, call `purchaseProductVersion`, and map unauthenticated, invalid, insufficient-balance, unavailable-product, and duplicate request outcomes to stable HTTP responses.

- [x] **Step 3: Inspect purchase transaction paths**

Confirm by code inspection that coin and coupon paths each conditionally debit only their selected field, and duplicate purchase requests return the existing entitlement without another debit.

---

### Task 4: Enforce downloads, withdrawal, and public filtering

**Files:**

- Modify: `src/app/api/product/[productId]/download/route.ts`
- Modify: `src/app/api/product/[productId]/route.ts`
- Modify: `src/app/api/product/route.ts`
- Modify: `src/app/api/product/popular.ts`
- Modify: `src/app/api/user/[userId]/products/route.ts`
- Create: `src/app/api/product/purchases/route.ts`
- Create: `src/libs/server/productDownloads.ts`

**Interfaces:**

- `getProductDownload({ userId, productId, productVersionId? }): Promise<{ key: string; filename: string }>` returns a `736x/{Product.image}` object for an active free Product, or `original/{ProductVersion.imageKey}` for a Pro version with a matching entitlement.
- Public `GET /api/product/{productId}` returns current public Pro version metadata `{ id, version }` when the listing is Pro; it does not return entitlements or private purchase data.
- `withdrawProduct({ userId, productId }): Promise<void>` sets `saleStatus='WITHDRAWN'`; it does not delete ProductVersion or ProductEntitlement rows.
- `GET /api/product/purchases` returns only the authenticated user's purchased versions and their re-download availability.

- [x] **Step 1: Implement download and deletion services**

Free downloads return `736x/{Product.image}` only while Product is active. Pro downloads require `productVersionId` and a matching entitlement, then sign `original/{ProductVersion.imageKey}`. A retired version remains downloadable to entitled buyers. Add owner-authenticated `DELETE /api/product/{productId}` to set `saleStatus='WITHDRAWN'`; do not call or change Lambda. Rights/safety takedown is deferred.

- [x] **Step 2: Filter public queries and add purchase history API**

Filter `saleStatus='ACTIVE'` in public list, popular, and profile product queries. Add cursor-paginated purchase history for the authenticated user, including withdrawn Product and version metadata without exposing private buyer or creator fields.

- [x] **Step 3: Inspect withdrawal and download policy paths**

Confirm by code inspection that public detail/list endpoints reject withdrawn Products, entitled buyers can still resolve retired version keys, and non-owners cannot withdraw Products.

---

### Task 5: Add buyer purchase and re-download UI

**Files:**

- Modify: `src/app/product/[id]/_component/ProductBtnModifty.tsx`
- Modify: `src/app/product/[id]/_component/ProductInfo.tsx`
- Modify: `src/app/product/[id]/_component/ProductPage.tsx`
- Modify: `src/app/board/_component/BoardHeader.tsx`
- Create: `src/app/purchases/page.tsx`
- Create: `src/app/purchases/_components/PurchaseHistory.tsx`

**Interfaces:**

- Pro product action loads `GET /api/product/{productId}/purchase?productVersionId=...` for fixed costs/ownership; if unowned, it offers coin 10 or bonus coupon 1, then requests that version's download URL.
- Edit/delete controls are shown only to the Product owner; the API independently checks ownership.
- Already-entitled buyers see a no-charge download action.
- `/purchases` lists every owned version, including versions whose Product is withdrawn, with a 474px version thumbnail, the title at purchase time, and a re-download action.
- Free product action downloads the 736px preview without coin debit.

- [x] **Step 1: Update product detail download actions**

Replace the unconditional original download action with free 736px download, Pro purchase using either selected currency, or owned-version download based on server response. Show coin/coupon costs and update product query state after purchase.

- [x] **Step 2: Add purchase history page and navigation entry**

Create `/purchases` with authenticated, paginated ProductVersion history and download states. Add the navigation link to `BoardHeader`, which is rendered by `src/app/layout.tsx`; do not edit the inactive duplicate `src/app/_components/headmenu.tsx`.

- [x] **Step 3: Inspect purchase and history UI paths**

Confirm the UI offers the correct selected currency, existing entitlements do not prompt another charge, and withdrawn items remain in purchase history. Rights/safety-blocked versions are deferred.

---

### Task 6: Product feature integration verification

**Files:**

- Verify: all Product schema, service, API, and UI files above
- No test files are added or run, per the user's instruction.

- [x] **Step 1: Run migration and client checks**

Run: `npx prisma validate; npx prisma generate`
Expected: migration model and generated client are valid.

- [x] **Step 2: Run TypeScript and lint validation**

The user reports that the normal Product flows work after applying migrations. Scoped ESLint passes for changed TypeScript files. The repository-wide lint and TypeScript checks report existing errors in unrelated files. No test code was added or run, per user instruction.

Run: `npm run lint`
Expected: no lint errors in changed files.
