import { RiskLevel, TransactionStatus } from "@prisma/client"

type p2pIntent = {
  senderBal:number,
  amount:number,

  txnCountLast5Min:number,
  avgAmt:number
}

// if this not done -> it gives eror bcoz status and risk level is enum but returning make it string
type p2pIntentResult =  { 
  status: TransactionStatus,
  riskLevel: RiskLevel,
  reason?: string
}

export async function evaluateP2pIntent(input: p2pIntent): Promise<p2pIntentResult> {
  // decison making
  const { senderBal, amount, txnCountLast5Min, avgAmt } = input;

  // 1. amount > wallet amt
  if(senderBal<amount) {
    return {status: TransactionStatus.Blocked, reason: "INSUFFICIENT_BALANCE",riskLevel: RiskLevel.High}
  }

  // 3. Very small amount — probing / testing behavior
  if(amount<=5) {
    return {status:TransactionStatus.Pending,reason:"LOW_AMOUNT_PROBING",riskLevel:RiskLevel.Medium}
  }

  // 4. if trscn done more than 5 times within 5min
  if(txnCountLast5Min) {
    return {status:TransactionStatus.Blocked,reason: "HIGH_TXN_VELOCITY",riskLevel:RiskLevel.High}
  }

  // 5. if txn amt is 3 times more than avg
  if(amount > avgAmt * 3) {
    return {status:TransactionStatus.Pending,reason: "AMOUNT_ANOMALY",riskLevel:RiskLevel.Medium}
  }

    // 2. transferring more moeny reruires otp verification
  if(amount>=7000) {
    return {status: TransactionStatus.Pending,reason: "HIGH_VALUE_TRANSACTION",riskLevel: RiskLevel.Medium}
  }

  return {status: TransactionStatus.Approved,riskLevel: RiskLevel.Low}
}