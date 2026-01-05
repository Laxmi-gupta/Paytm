import type { Request,Response } from "express"
import { PrismaClient } from "@prisma/client";
import { Send } from "../utils/response.utils.js";

const prisma = new PrismaClient(); 

export class Dashboard {
  static getUser = async(req:Request,res:Response) => {
    try {
      const userId = (req as any).userId;
      console.log("user id for dashboard",userId)

      if(!userId) return Send.unAuthorized(res,null,"User is not authorized");

      const user = await prisma.user.findUnique({
        where: {id: userId},
        select: {
          id: true,
          name:true,
          Balance: {
            select: {
              amount: true
            }
          }
        }
        // include: {
        //   Balance: true,
        //   // OnRampTransaction: true
        // }
      })
      console.log(user)

      if(!user) return Send.error(res,null,"User not found");

      return Send.success(res,user,"Dashboard data fetched");

    } catch (error) {
      console.error("Dashboard getUser error:", error);
      return Send.error(res, null, "Internal server error");
    }
  }
}