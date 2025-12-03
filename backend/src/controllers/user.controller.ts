import type { Request,Response } from "express"

class User {
  static getUser = async(req:Request,res:Response) => {
    const userId = (req as any).userId;
    
  }
}