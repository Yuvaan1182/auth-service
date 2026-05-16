-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "isUsed" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Token_isUsed_idx" ON "Token"("isUsed");
