import type { Request,Response } from "express"
import { PrismaClient } from "@prisma/client";
import { Send } from "../utils/response.utils.js";
import { onRampSchema } from "../validations/onramp.schema.js";
import crypto from "crypto"
import axios from "axios";
const prisma = new PrismaClient()

export class OnRamp {
  static createTransaction = async(req:Request,res:Response) => {
    try {
      const userId = (req as any).userId; 
      const validated = onRampSchema.createTrans.safeParse(req.body);
      if(!validated.success) return Send.error(res,"Invalid input");

      const {amount} = validated.data;
      
      const response = await axios.post("http://localhost:3001/bank/make-payment",{
        userId,amount
      })
      console.log(response);
      await prisma.onRampTransaction.create({
        data: {
          startTime: new Date(),
          amount,
          provider: "HDFC",
          token: response.data.token, 
          userId,
          status: "Processing"
        }
      })
      return Send.success(res,{
        amount,
        token: response.data.token,
        paymentUrl: response.data.paymentUrl  
      });
      
    } catch(error) {
      console.log("create Transaction failed",error);
      return Send.error(res,"create Transaction failed");
    }
  }
}