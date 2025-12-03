import type { Request,Response } from "express"
import { PrismaClient } from "@prisma/client";
import { Send } from "../utils/response.utils.js";
import { onRampSchema } from "../validations/onramp.schema.js";
import crypto from "crypto"
const prisma = new PrismaClient()

export class OnRamp {
  static createTransaction = async(req:Request,res:Response) => {
    try {
      const userId = (req as any).userId; 
      const validated = onRampSchema.createTrans.safeParse(req.body);
      if(!validated.success) return Send.error(res,"Invalid input");

      const {amount} = validated.data;
      const token = crypto.randomBytes(32).toString("hex");
      // const user = await prisma.user.findUnique({where: {id:userId}});
      await prisma.onRampTransaction.create({
        data: {
          startTime: new Date(),
          amount,
          provider: "HDFC",
          token,  
          userId,
          status: "Processing"
          // user
        }
      })
      return Send.success(res,{
        amount,
        token,
        redirectUrl: `http://localhost:3000/bank/pay?token=${token}`
      });
      // frontend will redirct to bank pay page with the token
    } catch(error) {
      console.log("create Transaction failed",error);
      return Send.error(res,"create Transaction failed");
    }
  }
}