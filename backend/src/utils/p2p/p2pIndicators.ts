import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const p2pDetails = async(senderId:number) => {
  const txnCountLast10Min = await prisma.transactionIntent.count({
    where: {
      senderId,
      type: "P2P",
      createdAt: {
        // “Fetch all transaction intents that were created in the last 10 minutes
        gte: new Date(Date.now() - 10*60*60) 
      } 
    },
  })

  const avgTxnAmt = await prisma.p2PTransfer.aggregate({
    where: {senderId,status:"Success"},
    _avg: {amount:true}
  })

  const avgAmt = avgTxnAmt._avg.amount ?? 0;
  return {txnCountLast10Min,avgAmt};
}