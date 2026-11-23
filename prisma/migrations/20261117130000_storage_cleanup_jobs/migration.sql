CREATE TABLE "StorageCleanupJob" (
    "id" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StorageCleanupJob_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "StorageCleanupJob_status_createdAt_idx"
ON "StorageCleanupJob"("status", "createdAt");
