import type { Request,Response } from "express"
import { PrismaClient } from "@prisma/client";
import { Send } from "../utils/response.utils.js";

const prisma = new PrismaClient(); 

export class Dashboard {
  static getUserName = async(req:Request,res:Response) => {
    try {
      const userId = (req as any).userId;

      if(!userId) return Send.unAuthorized(res,null,"Not authorized");
      const user = await prisma.user.findUnique({where: {id: userId},select: {name:true}});

      return Send.success(res,user?.name);
    } catch(error) {
        console.error("Dashboard getName error:", error);
        return Send.error(res, null, "Internal server error");
    }
  }

  static getUser = async(req:Request,res:Response) => {
    try {
      const userId = (req as any).userId;

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
              createdAt: true,
              transactionType: true,

              p2pTransfer: {
                select: {
                  sender: {select: {name:true}},
                  receiver: {select: {name:true}}
                }
              },

              onRampTx: {
                select: {provider:true}
              }
            }
          }       
        }
      })

      if(!user) return Send.error(res,null,"User not found");
      
      const transactions = user.ledgerEntries.map((le) => {
        let displayName: string = "Bank Wallet "; if(le.onRampTx) displayName += le.onRampTx?.provider;   // for onramp ledger

        // p2p transfer ledger => receiever sender name
        if(le.transactionType=="P2P" && le.p2pTransfer) {
          displayName = le.mode == "Debit" ? le.p2pTransfer.receiver.name ?? "Unknown" : le.p2pTransfer.sender.name ?? "Unknown"
        }

        return {
          id: le.id,
          amount: le.amount,
          type: le.mode,
          createdAt: le.createdAt,
          user: {name: displayName},
          status: "Success"
        }
      })

       return Send.success(res, {
        id: user.id,
        name: user.name,
        balance: user.Balance?.amount ?? 0,
        transactions
      }, "Dashboard data fetched");

    } catch (error) {
      console.error("Dashboard getUser error:", error);
      return Send.error(res, null, "Internal server error");
    }
  }
}