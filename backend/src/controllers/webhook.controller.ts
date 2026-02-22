import express from "express";
import axios from "axios";
import type { Request,Response } from "express";
import z from "zod";
import { prisma } from "../db/prisma.js";

export const paymentCallbackSchema = z.object({
    token: z.string().min(1, "Token is required"),
    userId: z.number().int().positive(),
    amount: z.number().min(1).max(2100000),
    status: z.enum(["Success","Failed"])
});

export class Webhook {
  static webhookHandler = async (req:Request,res:Response) => {
    try {
      const parsed = paymentCallbackSchema.safeParse(req.body);
      if(!parsed.success) return res.status(400).json({message:"Invalid data"});
      const {userId, amount, token,status} = parsed.data;  
      if (!token || !userId || !amount || !status) {
        return res.status(400).json({ message: "Invalid payload" });
      }

      await prisma.$transaction(async (tx) => {
        const onRampTx = await tx.onRampTransaction.findUnique({
          where: { token }
        });

        if (!onRampTx) {
           throw new Error("Transaction not found");
        }

        if (onRampTx.status === "Success") {
          return; // Already processed
        }

        if (onRampTx.userId !== userId) {
          throw new Error("User mismatch");
        }
      
        if (status === "Failed") {
          await tx.onRampTransaction.update({
            where: { token },
            data: { status: "Failure" }
          });
          return;
        }

        await tx.balance.update({
          where: { userId },
          data: {
            amount: {
              increment: onRampTx.amount
            }
          }
        });

        await tx.transactionLedger.create({
          data: {
            amount:onRampTx.amount,
            transactionType: "Onramp",
            mode: "Credit",
            userId,
            onRampTxLedger: onRampTx.id
          }
        })

        await tx.onRampTransaction.update({
          where: { token },
          data: { status: "Success" }
        });
        console.log("database updated")
      })
      return res.status(200).json({message:"db updated"})
    } catch(err) {
      console.error("Webhook error:", err);
      return res.status(200).json({ message: "Webhook received" });
    }
  }
}
