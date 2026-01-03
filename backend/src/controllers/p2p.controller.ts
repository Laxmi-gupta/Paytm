import type { Request,Response } from "express"
import {z} from "zod"
import { Send } from "../utils/response.utils.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const p2pTypes = z.object({
  number: z.string(),
  amount: z.number()
          
})

export class p2p {
  static p2pTransfer = async (req:Request,res:Response) => {
    const parsed = p2pTypes.safeParse(req.body);
    console.log(parsed)
    if(parsed.error) return Send.error(res,"Invalid input");

    const {number,amount} = parsed.data;

    const user = await prisma.user.findUnique({where: {number},
      include: {
        Balance:true
      }
    });

    console.log("user",user)

    if(!user) {
      console.log("not user")
      return res.status(400).json({message:"User not exists"});
    }
    
    await prisma.$transaction(async(tx) => {
      if(!user.Balance) return Send.error(res,"No wallet");

      const userAmount = user.Balance.amount;
      if(userAmount < amount) return Send.error(res,"Balance not sufficient");
      
      const balup = await tx.balance.update({
        where: {userId:user.id},
        data:{
          amount:{increment: Number(amount) } 
        }
      })

      console.log(balup)
    })

    return Send.success(res,"balup");

  }
}