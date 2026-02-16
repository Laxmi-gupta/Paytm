export const executep2p = async(tx:any,intent:any) => {
  const senderBal = await tx.balance.findUnique({
    where:{userId:intent.senderId}
  })
  console.log("sender bal",senderBal);
  const receiverBal = await tx.balance.findUnique({
    where: {userId : intent.receiverId}
  })
  console.log("rec bal",receiverBal);
  if(!senderBal || !receiverBal) throw new Error("Wallet is missing");

  if(senderBal.amount < intent.amount) throw new Error("Insufficient balance")

  const p2pCreation = await tx.p2PTransfer.create({
    data:{
      senderId:intent.senderId,
      receiverId:intent.receiverId,
      amount: intent.amount,
      status: "Pending",   
      intentId: intent.id        
    }
  })
  console.log("trsn stared",p2pCreation);
      
  const debit = await tx.balance.update({
    where: {userId: intent.senderId},
    data: {
      amount:{decrement: Number(intent.amount)},       
      locked: {increment: intent.amount}
    }
  })

  console.log("debit",debit)

  // receiver increase money
  const credit = await tx.balance.update({
    where: {userId:intent.receiverId},
    data:{
      amount:{increment: Number(intent.amount) } 
    }
  })

  console.log("credit",credit)

  await tx.balance.update({
    where: {userId: intent.senderId},
    data: {
      locked: {decrement: intent.amount}
    }
  })

  console.log("locked oeny restored");

  // ledger cretd
  const ledger = await tx.transactionLedger.createMany
  ({
    data: [
      {
        userId: intent.senderId,
        amount:intent.amount,
        mode: "Debit",
        transactionType: "P2P",
        p2pTransferLedger: p2pCreation.id
      },
      {
        userId: intent.receiverId,
        amount:intent.amount,
        mode: "Credit",
        transactionType: "P2P",
        p2pTransferLedger: p2pCreation.id
      }
    ]
  })
  console.log("ledger",ledger);

  // update p2p status
  await tx.p2PTransfer.update({
    where: {id: p2pCreation.id},
    data: {status: "Success"}
  })

  //update intent status 
  await tx.transactionIntent.update({
    where: {id: intent.id},
    data: {status: "Executed"}
  })
}