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
      if(!token) {
        return Send.error(res,null,"Token not exists");
      }

      const decodedToken = jwt.verify(token,authConfig.secret) as decodedTok;
      (req as any).userId = decodedToken.userId;    // cant be decodeed in controller so here string norrmal variabel
      
      next();   // if not call then it will stuck here only
    } catch(error) {
      console.log("Authenticate user failed",error);
      return Send.error(res,null,"Authenticate user");
    } 
  }
  
  static RefreshTokenValidation = (req:Request,res:Response,next:NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      console.log(refreshToken);
      if(!refreshToken) {
        return Send.unAuthorized(res, { message: "No refresh token provided" });
      }

      // const decodedToken = jwt.verify(token, secret) as string; ❌ bcoz its a object
      const decodedToken = jwt.verify(refreshToken,authConfig.refresh_secret) as decodedTok;
      (req as any).userId = decodedToken.userId;
      next();
    } catch(error) {
      console.log("Refresh token validation failed",error);
      return Send.error(res,null,"Refresh token validation failed");
    }
  }
  
}