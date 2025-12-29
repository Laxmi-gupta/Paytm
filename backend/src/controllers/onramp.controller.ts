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
      console.log(response.data);  
      await prisma.onRampTransaction.create({
        data: {
          startTime: new Date(),
          amount,
          provider: "SBI",
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

  static databaseUpdate = async(req:Request,res:Response) => {
    const {userId,amount,token} = req.body;
      try {
        await prisma.$transaction([
            prisma.balance.updateMany({
                where: {
                    userId: Number(userId)  
                },
                data: {
                    amount: {
                        // You can also get this from your DB
                        increment: Number(amount)
                    }
                }
            }),
            prisma.onRampTransaction.updateMany({
                where: {
                    token: token
                }, 
                data: {
                    status: "Success",
                }
            })
        ]);

        res.json({
            message: "Captured"
        })

    } catch(e) {
        console.error(e);
        res.status(411).json({
            message: "Error while processing webhook"
        })
    }
  }
}