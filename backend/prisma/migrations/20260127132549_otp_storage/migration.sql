-- CreateTable
CREATE TABLE "TransactionOtp" (
    "id" TEXT NOT NULL,
    "otpHash" TEXT NOT NULL,
    "intentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "TransactionOtp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TransactionOtp_intentId_key" ON "TransactionOtp"("intentId");

-- AddForeignKey
ALTER TABLE "TransactionOtp" ADD CONSTRAINT "TransactionOtp_intentId_fkey" FOREIGN KEY ("intentId") REFERENCES "TransactionIntent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
