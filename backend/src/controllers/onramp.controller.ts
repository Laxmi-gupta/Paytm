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
      if (!userId) return Send.error(res,null, "Unauthorized");
      const validated = onRampSchema.createTrans.safeParse(req.body);
      if(!validated.success) return Send.error(res,"Invalid input");
      
      const {amount,provider} = validated.data;
      if(amount<=0) return Send.error(res,"Invalid amount");

      const response = await axios.post(`${process.env.BANK_URL}/bank/make-payment`,{
        userId,amount,provider
      })
      //console.log(response.data);  
      const ramp = await prisma.onRampTransaction.create({
        data: {
          startTime: new Date(),
          amount,
          provider,
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

  static getTransaction = async(req:Request,res:Response) => {
    try {
      const token = req.query.token as string;
      const userId = (req as any).userId;
      if (!userId) return Send.error(res,null, "Unauthorized");
      if(!token) return Send.error(res,null,"Token missing");

      const onrampData = await prisma.onRampTransaction.findUnique(
        {
          where:{token,userId},
          select:{amount:true,provider:true,startTime:true,status:true}
        });

      if (!onrampData) {
        return Send.error(res, "Transaction not found");
      }

      return Send.success(res,onrampData);
    } catch(error) {
      console.error("get transaction failed",error);
      return Send.error(res,"get Transaction failed");
    }
    
  }
}