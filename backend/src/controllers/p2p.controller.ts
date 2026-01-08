import type { Request,Response } from "express"
import {z} from "zod"
import { PrismaClient } from "@prisma/client";
import { Send } from "../utils/response.utils.js";

const prisma = new PrismaClient();

const p2pTypes = z.object({
  number: z.string().trim(),
  amount: z.number().min(1).max(10000)   
})

export class p2p {
  static p2pTransfer = async (req:Request,res:Response) => {
    try {
      const parsed = p2pTypes.safeParse(req.body);
      console.log(parsed);
      if(parsed.error) return res.status(400).json({message: "Invalid input"});

      const {number,amount} = parsed.data;
      console.log(number,amount);

      const senderId = (req as any).userId;
      if(!senderId) return res.status(401).json({message: "Not authorized"});
      
      await prisma.$transaction(async(tx) => {
        const sender = await tx.user.findUnique({
          where: {id: senderId},
          include: {Balance:true}
        })

        console.log("sender",sender);

        if(!sender) throw new Error("Sender not found");

        if(!sender.Balance) throw new Error("No wallet");

        const receiver = await tx.user.findUnique({where: {number},
          include: {
            Balance:true
          }
        });

        console.log("receiver",receiver)

        if(!receiver) {
          console.log("not user")
          throw new Error("Receiver not exists")
        } 

        const userAmount = sender.Balance.amount;
        if(userAmount < amount) throw new Error("Balance not sufficient");

        if(sender.id === receiver.id) throw new Error("Cannot send money to yourself");

      // p2p transfer create
        const p2pCreation = await tx.p2PTransfer.create({
          data:{
            senderId:sender.id,
            receiverId:receiver.id,
            amount,
            status: "Pending",           
          }
        })
        console.log("trsn stared",p2pCreation);
          
        const debit = await tx.balance.update({
          where: {userId: sender.id},
          data: {
            amount:{decrement: Number(amount)},       
            locked: {increment: amount}
          }
        })

        console.log("debit",debit)

        // receiver increase money
        const credit = await tx.balance.update({
          where: {userId:receiver.id},
          data:{
            amount:{increment: Number(amount) } 
          }
        })

        console.log("credit",credit)

        await tx.balance.update({
          where: {userId: sender.id},
          data: {
            locked: {decrement: amount}
          }
        })
        console.log("locked oeny restored");

        // ledger cretd
        const ledger = await tx.transactionLedger.createMany
        ({
          data: [
            {
              userId: sender.id,
              amount,
              mode: "Debit",
              transactionType: "P2P",
              p2pTransferLedger: p2pCreation.id
            },
            {
              userId: receiver.id,
              amount,
              mode: "Credit",
              transactionType: "P2P",
              p2pTransferLedger: p2pCreation.id
            }
          ]
        })
        console.log("ledger",ledger);

        // update p2p status
        const updation = await tx.p2PTransfer.update({
          where: {id: p2pCreation.id},
          data: {status: "Success"}
        })
        console.log("updated",updation)
      })

      return res.status(200).json({message:"Transferred succesfully"})
    } catch(error: any) {
      console.error("P2p error",error.message);

      if(error.message === "Sender not found") return Send.error(res,null,"Sender not found");

      if(error.message === "No wallet") return Send.error(res,null,"No wallet found");

      if(error.message === "Receiver not exists") return Send.error(res,null,"Receiver not exists");

      if(error.message === "Balance not sufficient") return Send.error(res,null,"Balance not sufficient");

      if(error.message === "Cannot send money to yoursef") return Send.error(res,null,"Cannot send money to yourself");

    }
  }
}