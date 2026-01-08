import type { Request,Response } from "express"
import { PrismaClient } from "@prisma/client";
import { Send } from "../utils/response.utils.js";

const prisma = new PrismaClient(); 

export class Dashboard {
  static getUser = async(req:Request,res:Response) => {
    try {
      const userId = (req as any).userId;
      console.log("user id for dashboard",userId)

      if(!userId) return Send.unAuthorized(res,null,"User is not authorized");

      // DB shape is NOT suitable for UI => covert to dto
      const user = await prisma.user.findUnique({
        where: {id: userId},
        select: {
          id: true,
          name:true,
          Balance: {
            select: {
              amount: true
            }
          },
          ledgerEntries: {
            select: {
              id: true,
              amount: true,
              mode: true,
              createdAt: true
            }
          },
          sendTransfers: {
            select: {
              id:true,
              status: true,
              amount: true,
              receiver: {select: {name: true}},
              createdAt: true
            }
          }, receivedTransfers: {
            select: {
              id:true,
              status: true,
              amount: true,
              sender: {select: {name: true}},
              createdAt: true
            }
          },
        }
      })
      console.log(user)

      if(!user) return Send.error(res,null,"User not found");

      const transactions = [
        // ✅ Ledger (always success)
        ...user.ledgerEntries.map(le => ({
          id: `ledger-${le.id}`,
          amount: le.amount,
          type: le.mode,                     // Credit | Debit
          status: "Success",
          startTime: le.createdAt,
          user: {name: "Wallet added"}
        })),

        // ✅ P2P Sent (Pending / Failed / Success)
        ...user.sendTransfers.map(tx => ({ 
          id:   `Sent-${tx.id}`,
          amount: tx.amount,
          type: "Debit",
          status: tx.status,
          user: { name: tx.receiver.name },
          startTime: tx.createdAt
        })),

        // ✅ P2P Received (ONLY success should appear)
        ...user.receivedTransfers
          .map(tx => ({
            id:   `Receieve-${tx.id}`,
            amount: tx.amount,
            type: "Credit",
            status: tx.status,
            user: { name: tx.sender.name },
            startTime: tx.createdAt
          }))
      ];

      

       return Send.success(res, {
        id: user.id,
        name: user.name,
        balance: user.Balance?.amount,
        transactions
      }, "Dashboard data fetched");

    } catch (error) {
      console.error("Dashboard getUser error:", error);
      return Send.error(res, null, "Internal server error");
    }
  }
}