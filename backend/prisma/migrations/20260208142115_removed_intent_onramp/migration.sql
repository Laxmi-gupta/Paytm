/*
  Warnings:

  - You are about to drop the column `intentId` on the `OnRampTransaction` table. All the data in the column will be lost.
  - Made the column `senderId` on table `TransactionIntent` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "OnRampTransaction" DROP CONSTRAINT "OnRampTransaction_intentId_fkey";

-- DropForeignKey
ALTER TABLE "TransactionIntent" DROP CONSTRAINT "TransactionIntent_senderId_fkey";

-- DropIndex
DROP INDEX "OnRampTransaction_intentId_key";

-- AlterTable
ALTER TABLE "OnRampTransaction" DROP COLUMN "intentId";

-- AlterTable
ALTER TABLE "TransactionIntent" ALTER COLUMN "senderId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "TransactionIntent" ADD CONSTRAINT "TransactionIntent_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
