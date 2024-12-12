-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "emailActive" BOOLEAN,
    "name" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "coin" INTEGER NOT NULL DEFAULT 0,
    "bonusCoupon" INTEGER NOT NULL DEFAULT 0,
    "delete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialUser" (
    "id" SERIAL NOT NULL,
    "socialId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SocialUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocalUser" (
    "id" SERIAL NOT NULL,
    "memId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "LocalUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayUsage" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "coin" INTEGER NOT NULL DEFAULT 0,
    "coupon" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PayUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayDetail" (
    "id" SERIAL NOT NULL,
    "merchant_uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "paid_amount" INTEGER NOT NULL,
    "pg_provider" TEXT NOT NULL,
    "buyer_name" TEXT NOT NULL,
    "buyer_email" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PayDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayProduct" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "basicCoin" INTEGER NOT NULL,
    "bonusCoin" INTEGER NOT NULL DEFAULT 0,
    "bonusCoupon" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PayProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "tag" TEXT NOT NULL DEFAULT '',
    "auth" BOOLEAN NOT NULL DEFAULT false,
    "ratio" TEXT NOT NULL DEFAULT '1',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Board" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoardChat" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "boardId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "BoardChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductAuth" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ProductAuth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductHit" (
    "id" SERIAL NOT NULL,
    "hit" INTEGER NOT NULL DEFAULT 0,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "ProductHit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoardHit" (
    "id" SERIAL NOT NULL,
    "hit" INTEGER NOT NULL DEFAULT 0,
    "boardId" INTEGER NOT NULL,

    CONSTRAINT "BoardHit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HashTag" (
    "id" SERIAL NOT NULL,
    "hashtag" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "HashTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoardTag" (
    "id" SERIAL NOT NULL,
    "hashtag" TEXT NOT NULL,
    "boardId" INTEGER NOT NULL,

    CONSTRAINT "BoardTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SocialUser_socialId_key" ON "SocialUser"("socialId");

-- CreateIndex
CREATE UNIQUE INDEX "SocialUser_userId_key" ON "SocialUser"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LocalUser_userId_key" ON "LocalUser"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PayUsage_userId_key" ON "PayUsage"("userId");

-- CreateIndex
CREATE INDEX "Product_userId_idx" ON "Product"("userId");

-- CreateIndex
CREATE INDEX "Board_userId_idx" ON "Board"("userId");

-- CreateIndex
CREATE INDEX "Chat_productId_idx" ON "Chat"("productId");

-- CreateIndex
CREATE INDEX "Chat_userId_idx" ON "Chat"("userId");

-- CreateIndex
CREATE INDEX "BoardChat_boardId_idx" ON "BoardChat"("boardId");

-- CreateIndex
CREATE INDEX "BoardChat_userId_idx" ON "BoardChat"("userId");

-- CreateIndex
CREATE INDEX "ProductAuth_productId_idx" ON "ProductAuth"("productId");

-- CreateIndex
CREATE INDEX "ProductAuth_userId_idx" ON "ProductAuth"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductHit_productId_key" ON "ProductHit"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "BoardHit_boardId_key" ON "BoardHit"("boardId");

-- CreateIndex
CREATE UNIQUE INDEX "HashTag_productId_key" ON "HashTag"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "BoardTag_boardId_key" ON "BoardTag"("boardId");

-- AddForeignKey
ALTER TABLE "SocialUser" ADD CONSTRAINT "SocialUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocalUser" ADD CONSTRAINT "LocalUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayUsage" ADD CONSTRAINT "PayUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayDetail" ADD CONSTRAINT "PayDetail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardChat" ADD CONSTRAINT "BoardChat_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardChat" ADD CONSTRAINT "BoardChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAuth" ADD CONSTRAINT "ProductAuth_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAuth" ADD CONSTRAINT "ProductAuth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductHit" ADD CONSTRAINT "ProductHit_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardHit" ADD CONSTRAINT "BoardHit_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HashTag" ADD CONSTRAINT "HashTag_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardTag" ADD CONSTRAINT "BoardTag_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;
