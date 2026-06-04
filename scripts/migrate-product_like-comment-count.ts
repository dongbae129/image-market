// scripts/migrate-comment-count.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 댓글 카운트 초기화 작업을 시작합니다...');

  // 1. 모든 제품의 commentCount를 실제 댓글 수로 업데이트
  // SQL의 강력함을 믿으세요!
  const updatedCount = await prisma.$executeRaw`
    UPDATE "Product" p
    SET "commentsCount" = (
      SELECT COUNT(*) 
      FROM "Chat" c 
      WHERE c."productId" = p.id
    )
  `;

  console.log(`✅ 총 ${updatedCount}개의 제품 데이터가 업데이트되었습니다.`);
}

main()
  .catch((e) => {
    console.error('❌ 작업 중 오류 발생:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
