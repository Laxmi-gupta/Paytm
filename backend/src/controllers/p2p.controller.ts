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
    console.log(parsed);

    if(parsed.error) return Send.error(res,"Invalid input");

    const {number,amount} = parsed.data;
    const user = await prisma.user.findUnique({where: {number},
      include: {
        Balance:true
      }
    });
    if(!user) return Send.error(res,"User not exists");

    if(!user.Balance) return Send.error(res,"No wallet");

    if(user.Balance.amount < amount) return Send.error(res,"No enough money");

     // await prisma.balance.update({amount: user.Balance.amount-amount, locked:amount },where: {userId:user.id})

    return Send.success(res,user);

  }
}