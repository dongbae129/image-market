ALTER TABLE "Board"
ADD COLUMN "deletionStatus" TEXT NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN "deletionError" TEXT,
ADD COLUMN "deletionAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "deletionLastAttemptAt" TIMESTAMP(3);

CREATE INDEX "Board_deletionStatus_deletionLastAttemptAt_idx"
ON "Board"("deletionStatus", "deletionLastAttemptAt");
