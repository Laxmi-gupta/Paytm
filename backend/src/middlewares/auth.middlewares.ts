import type { Request,Response,NextFunction } from "express"
import jwt from "jsonwebtoken"
import { authConfig } from "../config/auth.config.js";
import { Send } from "../utils/response.utils.js";

interface decodedTok {
  userId: string
}

export class AuthMiddleware {
  static authenticateUser = (req:Request,res:Response,next: NextFunction) => {
    try {
      const token = req.cookies.accessToken;
      console.log("authenticate",token)
      if(!token) {
        return Send.unAuthorized(res,null,"Token not exists");
      }

      const decodedToken = jwt.verify(token,authConfig.secret) as decodedTok;
      (req as any).userId = decodedToken.userId;    // cant be decodeed in controller so here string norrmal variabel
      console.log("req user",(req as any).userId)
      next();   // if not call then it will stuck here only
    } catch(error) {
      console.log("Authenticate user failed",error);
      return Send.unAuthorized(res,null,"Authenticate user");
    } 
  }
}