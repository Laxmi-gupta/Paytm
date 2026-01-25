-- DropForeignKey
ALTER TABLE "TransactionIntent" DROP CONSTRAINT "TransactionIntent_senderId_fkey";

-- AlterTable
ALTER TABLE "TransactionIntent" ALTER COLUMN "senderId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "TransactionIntent" ADD CONSTRAINT "TransactionIntent_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
