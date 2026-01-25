/*
  Warnings:

  - A unique constraint covering the columns `[intentId]` on the table `OnRampTransaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[intentId]` on the table `P2PTransfer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `intentId` to the `OnRampTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `intentId` to the `P2PTransfer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `riskLevel` to the `TransactionIntent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `TransactionIntent` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "IntentType" AS ENUM ('Onramp', 'P2P');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('Low', 'Medium', 'High');

-- AlterTable
ALTER TABLE "OnRampTransaction" ADD COLUMN     "intentId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "P2PTransfer" ADD COLUMN     "intentId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TransactionIntent" ADD COLUMN     "riskLevel" "RiskLevel" NOT NULL,
ADD COLUMN     "type" "IntentType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OnRampTransaction_intentId_key" ON "OnRampTransaction"("intentId");

-- CreateIndex
CREATE UNIQUE INDEX "P2PTransfer_intentId_key" ON "P2PTransfer"("intentId");

-- AddForeignKey
ALTER TABLE "OnRampTransaction" ADD CONSTRAINT "OnRampTransaction_intentId_fkey" FOREIGN KEY ("intentId") REFERENCES "TransactionIntent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "P2PTransfer" ADD CONSTRAINT "P2PTransfer_intentId_fkey" FOREIGN KEY ("intentId") REFERENCES "TransactionIntent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
