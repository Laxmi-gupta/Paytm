-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('Pending', 'Approved', 'Blocked', 'Executed', 'Failed');

-- CreateTable
CREATE TABLE "TransactionIntent" (
    "id" SERIAL NOT NULL,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "status" "TransactionStatus" NOT NULL,
    "amount" INTEGER NOT NULL,
    "decisionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decidedAt" TIMESTAMP(3),
    "executedAt" TIMESTAMP(3),

    CONSTRAINT "TransactionIntent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TransactionIntent" ADD CONSTRAINT "TransactionIntent_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionIntent" ADD CONSTRAINT "TransactionIntent_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
