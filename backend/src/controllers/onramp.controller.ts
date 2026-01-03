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
      console.log("transac",userId);
      const validated = onRampSchema.createTrans.safeParse(req.body);
      if(!validated.success) return Send.error(res,"Invalid input");
      
      const {amount,provider} = validated.data;
      if(amount<=0) return Send.error(res,"Invalid amount");
      
      const response = await axios.post("http://localhost:3001/bank/make-payment",{
        userId,amount,provider
      })
      //console.log(response.data);  
      const ramp = await prisma.onRampTransaction.create({
        data: {
          startTime: new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000)),
          amount,
          provider,
          token: response.data.token, 
          userId,
          status: "Processing"
        }
      })
      console.log("ramo created",ramp)
      

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
    console.log("inside dbupadte")
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
        console.log("database updated")
        return res.status(200).json({message:"success"}) // mai pehle idar se bhej rhi thi 

    } catch(e) {
        console.error(e);
        res.status(411).json({
            message: "Error while processing webhook"
        })
    }
  }

  static getTransaction = async(req:Request,res:Response) => {
    try {
      const token = req.query.token as string;
      console.log(token); // we shld check both token and userId bcoz whose token is it we get to know but whether its authorized or not it shld be checked
      if(!token) return Send.error(res,"Token missing");

      const onrampData = await prisma.onRampTransaction.findUnique(
        {
          where:{token},
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