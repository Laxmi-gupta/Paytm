import type { Request,Response } from "express"
import {success, z} from "zod"
import { Send } from "../utils/response.utils.js";
import { evaluateP2pIntent } from "../utils/p2p/p2pDecision.js";
import { p2pDetails } from "../utils/p2p/p2pIndicators.js";
import {generateOtp, hashOtp} from '../utils/otpGeneration.js'
import { prisma } from "../db/prisma.js";
import { RiskLevel, TransactionStatus } from "@prisma/client";
import { compare } from "bcrypt";
import { executep2p } from "../utils/p2p/p2pExecution.service.js";

const p2pTypes = z.object({
  number: z.string().trim(),
  amount: z.number().min(1).max(10000)   
})

const verifyOtpTypes = z.object({
  intentId: z.number(),
  otp: z.string().trim().min(6)
})

export class p2p {
  static p2pTransfer = async (req:Request,res:Response) => {
    try {
      const parsed = p2pTypes.safeParse(req.body);
      if(parsed.error) return res.status(400).json({message: "Invalid input"});

      const {number,amount} = parsed.data;

      const senderId = (req as any).userId;
      if(!senderId) return res.status(401).json({message: "Not authorized"});
      
      let result = await prisma.$transaction(async(tx) => {
        const sender = await tx.user.findUnique({
          where: {id: senderId},
          include: {Balance:true}
        })

        if(!sender) throw new Error("Sender not found");

        if(!sender.Balance) throw new Error("No wallet");

        const receiver = await tx.user.findUnique({where: {number},
          include: {
            Balance:true
          }
        });

        if(!receiver) throw new Error("Receiver not exists")

        const userAmount = sender.Balance.amount;
        // if(userAmount < amount) throw new Error("Balance not sufficient");

        if(sender.id === receiver.id) throw new Error("Cannot send money to yourself");

        // p2p trsn intent
        const intent = await tx.transactionIntent.create({
          data: {
            amount,
            status: TransactionStatus.Pending,
            senderId:sender.id,
            receiverId: receiver.id,
            createdAt: new Date(),
            type: "P2P",
          }
        })

        // finds the total trsn cnt in 10min and avg amt for decision engine
        const {txnCountLast5Min,avgAmt} = await p2pDetails(senderId);

        // decison is taken with decison engine
        const decison = await evaluateP2pIntent({senderBal: userAmount,amount: intent.amount,txnCountLast5Min,avgAmt});

        // if approved continue p2p trsnx
        const updated_intent = await tx.transactionIntent.update({
          where: {id:intent.id},
          data: {
            status: decison.status,
            riskLevel:decison.riskLevel,
            decisionReason:decison.reason as string,
            decidedAt: new Date()          
          }
        })

         // medium risk need otp verfication
        if(updated_intent.riskLevel===RiskLevel.Medium) {

          let otp = generateOtp();
          console.log("otp",otp)
          let otpHash = await hashOtp(otp);

          await tx.transactionOtp.create({
            data: {
              intentId:intent.id,
              otpHash,
              expiredAt: new Date(Date.now() + 5*60*1000),
              attempts:0 
            }
          });

         // send otp to sms
         
        }

        if(updated_intent.riskLevel===RiskLevel.Low) {
          await executep2p(tx,updated_intent);

        }

        return {intentId:updated_intent.id,status: updated_intent.status,riskLevel:updated_intent.riskLevel,reason: updated_intent.decisionReason};
      })

      // we hv used result bcoz inside trsntn we cant return -< means Run DB logic atomically and RETURN ONE VALUE to the outside world
      // $transaction should ONLY create/update DB rows and RETURN a summary
      if(result.riskLevel===RiskLevel.Low) {
        return res.json({
          success: true,
          intentId: result.intentId,
          riskLevel: result.riskLevel,
          status: result.status,
        })
      }

      if(result.riskLevel===RiskLevel.Medium) {
        return res.json({
          success: true,
          intentId: result.intentId,
          riskLevel: result.riskLevel,
          status: result.status,
          message: "Otp sent"
        })
      }
     
      // if high risk then block but for mdeium risk it shld be verified through otp
      return res.status(200).json({success:false,message:result.reason,riskLevel: result.riskLevel,
          status: result.status,code: "HIGH_RISK"})

    } catch(error: any) {
      console.error("P2p error",error.message);

      // if(error.message === "Sender not found") return res.status(400).json({success: false,message:"Sender not found"});

      // if(error.message === "No wallet") return res.status(400).json({success: false,message:"No wallet found"});

      // if(error.message === "Receiver not exists") return res.status(400).json({success: false,message:"Receiver not exists"});

      // // if(error.message === "Balance not sufficient") return Send.error(res,null,"Balance not sufficient");

      // if(error.message === "Cannot send money to yourself") return res.status(400).json({success: false,message:"Cannot send money to yourself"});

      return res.status(400).json({
        success: false,
        message: error.message|| "P2P failed"
      });
    }
  }

  static p2pVerify = async (req:Request,res:Response) => {
    try {
      const parsed = verifyOtpTypes.safeParse(req.body);
      if(!parsed.success) return res.status(400).json({message: "Invalid input"});

      const {intentId,otp} = parsed.data;
      
      await prisma.$transaction(async(tx) => {

        const dbOtpHash = await tx.transactionOtp.findUnique({
          where: {
            intentId
          }
        })

        if(!dbOtpHash) throw new Error("Otp not found");

        if(new Date() > dbOtpHash.expiredAt) throw new Error("Otp expired");

        const isValid = await compare(otp,dbOtpHash.otpHash);

        if(!isValid) {
          await tx.transactionOtp.update({
            where: {intentId},
            data: {attempts: {increment: 1}}
          })
          throw new Error("Invalid otp");
        }

        const updated_intent = await tx.transactionIntent.update({
          where: {id:intentId},
          data: {status: "Approved"}
        })

        await executep2p(tx,updated_intent)
      })
      return res.status(200).json({success: true,message:"Transfer successful",intentId})
    } 
    catch(err:any) {
      console.error("verify error",err);

      return res.status(400).json({
        success: false,
        message:err.message
      });
    } 
  }

  // static p2pExecute = async (req:Request,res:Response) => {
  //   try {
  //     const intentId = req.body.intentId;
  //     const userId = (req as any).userId;
      
  //     if(!intentId) return res.status(400).json({message: "no intent found"});

  //     const intent = await prisma.transactionIntent.findUnique({
  //       where: {id:intentId}
  //     })
  //     console.log("intent ",intent)
  //     if(!intent) return res.status(400).json({message: "no intent found"});

  //     if(intent.status === "Executed") return res.status(400).json({message:"Already executed"})

  //     if(intent.status!=="Approved") return res.status(400).json({message: "otp not verified"})
        
  //     if(userId!==intent.senderId) return res.status(403).json({message: "Unauthorized"})
      
  //     if(!intent.senderId) return res.status(400).json({message:"Invalid intent"})

  //     // p2p transfer create
  //     await prisma.$transaction(async(tx) => {
  //       await executep2p(tx,intent);
  //       return res.status(200).json({success: true,message: "executed"});
  //     })
  //   } catch(err:any) {
  //       console.error("p2p execution failed",err.message);
  //       return res.status(400).json({success: false,message:err.message || "Execution failed"});
  //   }
  // }
 }