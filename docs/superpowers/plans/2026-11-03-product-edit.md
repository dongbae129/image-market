# 상품 편집 화면 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** 상품 상세의 데이터를 재사용해 현재 `/product/[id]/setting`에서 신규 등록 화면과 같은 편집 UI를 제공한다.

**Architecture:** 루트 React Query 캐시에 상세 데이터가 있으면 같은 `['product', productId]` 키로 초기값을 채우고, 없으면 기존 상품 조회 API로 가져온다. 편집 화면은 `MediaCanvas`와 `MetadataEditor`를 공유하며, API는 소유권을 확인하고 텍스트 변경을 저장하거나 새 이미지가 있을 때 S3 임시 업로드 및 SQS 변환을 요청한다.

**Tech Stack:** Next.js 14 App Router, React Query v5, Prisma, AWS SDK v3 S3/SQS, TypeScript.

**Spec:** `docs/superpowers/specs/2026-11-03-product-edit-design.md`

## Global Constraints

- 상세와 편집은 기존 `/product/[id]/setting` 경로를 사용한다.
- 상세/편집 query key는 `['product', productId]`로 통일한다.
- 이미지 교체가 없는 편집은 새 파일을 업로드하지 않는다.
- 교체 시 원본 입력 파일은 S3의 `temp/`를 거쳐 기존 SQS 상품 처리 흐름으로 넘긴다.
- 편집 API는 로그인과 상품 소유권을 검사한다.
- 테스트를 추가하거나 실행하지 않는다.

## Review Focus

- 캐시가 있는 상세→편집 이동에서 입력값과 이미지가 즉시 채워진다.
- 캐시가 없는 편집 직접 진입 시 API 조회 후 폼이 채워진다.
- 늦은 API 응답이 사용자가 수정 중인 폼 값을 덮어쓰지 않는다.
- 기존 이미지를 유지한 저장은 S3 업로드 및 SQS 요청을 생략한다.
- 새 이미지 교체는 한 장만 허용하고, 비소유자 수정은 거부한다.

---

### Task 1: 캐시 우선 편집 화면 데이터 로딩

**Files:**
- Modify: `src/app/product/[id]/setting/page.tsx`
- Read reference: `src/app/product/[id]/page.tsx`
- Read reference: `src/app/product/[id]/_component/ProductPage.tsx`

**Interfaces:**
- Consumes: 상세 쿼리 `['product', productId]` 및 `ProductDetailType` 응답.
- Produces: 편집 화면에 전달할 로딩 완료 상품 데이터.

- [x] `ProductSetting`의 query key를 `['product', productId]`로 맞춘다.
- [x] `useQueryClient().getQueryData` 캐시를 초기값으로 사용하고, 캐시 미스 때 기존 `getProduct(productId)` 조회를 수행한다.
- [x] 캐시 데이터가 없는 로딩 중과 상품을 찾지 못한 경우를 구분해 편집 화면에 전달한다.
- [x] 데이터 확인: 상세에서 편집으로 이동할 때 캐시 값이 보이고, 편집 URL 직접 진입 시 API 응답으로 폼이 채워지는지 확인한다.

### Task 2: 등록 UI를 편집 모드로 재사용

**Files:**
- Create: `src/app/upload/_component/ProductEditor.tsx`
- Modify: `src/app/upload/page.tsx`
- Modify: `src/app/upload/_component/MediaCanvas.tsx`
- Modify: `src/app/upload/_component/MetaDataEditor.tsx`
- Modify: `src/app/product/[id]/setting/page.tsx`

**Interfaces:**
- `ProductEditor` props: `{ mode: 'create' | 'edit'; productId?: string; initialProduct?: ProductDetailType['product'] }`.
- `MetadataEditor` props에 `mode`, `productId`, `initialProduct`를 추가한다.
- Consumes: Task 1의 상품 데이터와 `UploadImageItem[]`.
- Produces: 제목/설명/해시태그/유료 설정 초기값, 기존 이미지 미리보기, 변경 이미지 파일.

- [x] `ProductEditor`에 현재 업로드 페이지의 이미지 상태, `MediaCanvas`와 `MetadataEditor` 구성을 둔다. 게시판 탭은 `mode='create'`에서만 노출한다.
- [x] `/upload`는 `ProductEditor`를 `mode='create'`로 렌더링하고 `/product/[id]/setting`은 같은 컴포넌트를 `mode='edit'`로 렌더링한다.
- [x] `MediaCanvas`가 기존 이미지 URL을 새 파일과 별도로 보여주고 새 파일 선택 시에만 변경 이미지 상태를 설정한다.
- [x] `MetadataEditor`는 `initialProduct`의 title, description, hashtag, auth 값을 초기값으로 적용하며, 최초 초기화 후 비동기 응답으로 사용자 편집 내용을 덮어쓰지 않는다.
- [x] 편집 모드의 상품 이미지 교체는 한 파일로 제한한다.
- [x] 데이터 확인: 제목/설명/해시태그/유료 설정이 표시되고, 기존 이미지와 새 이미지 미리보기가 구분되는지 확인한다.

### Task 3: 소유권 검증과 상품 수정 저장

**Files:**
- Modify: `src/app/api/product/[productId]/setting/route.ts`
- Reference: `src/app/api/product/init/route.ts`
- Reference: `src/app/api/product/route.ts`
- Modify: `src/app/upload/_component/MetaDataEditor.tsx`
- Modify: `src/app/product/[id]/setting/page.tsx`

**Interfaces:**
- Consumes: `PUT /api/product/{productId}/setting` JSON body `{ title, description, hashtag, productAuth, tempKey? }`.
- Produces: `{ ok: true, product }`; optional image replacement queues `{ feenId: productId, tempKey }`.

- [x] PUT API에서 로그인 사용자와 상품 소유자를 검증하고 상품 텍스트/설정을 갱신한다.
- [x] `tempKey`가 있을 때에만 새 이미지 키를 DB에 반영하고 SQS에 기존 상품 처리 메시지를 보낸다.
- [x] 편집 화면은 새 파일이 있을 때에만 init presigned POST 업로드 사이클을 실행하고, 없으면 JSON PUT만 수행한다.
- [x] 저장 성공 시 `['product', productId]` 캐시를 갱신하고 상세 페이지로 이동한다.
- [x] 데이터 확인: 파일 변경 없는 저장에는 init/S3/SQS 요청이 없고, 파일 교체 시 업로드와 SQS 처리 요청이 발생하며, 비소유자 PUT은 거부되는지 확인한다.

### Task 4: 타입 검사

**Files:**
- Verify: `src/app/product/[id]/setting/page.tsx`
- Verify: `src/app/upload/_component/MediaCanvas.tsx`
- Verify: `src/app/upload/_component/MetaDataEditor.tsx`
- Verify: `src/app/api/product/[productId]/setting/route.ts`

- [x] `npx tsc --noEmit --pretty false`를 실행하고 이 변경 파일에서 발생한 오류를 정리한다. 기존의 무관한 프로젝트 오류는 별도 범위로 남긴다.

