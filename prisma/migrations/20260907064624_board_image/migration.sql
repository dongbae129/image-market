/*
  Warnings:

  - You are about to drop the column `image` on the `Board` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Board" DROP COLUMN "image";

-- CreateTable
CREATE TABLE "BoardImage" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PROCESSING',
    "dominantColor" TEXT,
    "boardId" INTEGER,

    CONSTRAINT "BoardImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BoardImage" ADD CONSTRAINT "BoardImage_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;
