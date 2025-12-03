import type { Request,Response } from "express"
import { authSchema } from "../validations/auth.schema.js"
import { PrismaClient } from "@prisma/client"
import {z} from "zod"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { authConfig } from "../config/auth.config.js"
import { Send } from "../utils/response.utils.js"

const prisma = new PrismaClient();

export class Auth {
  static login = async (req:Request,res:Response) => {
    try {
      const validated = authSchema.login.safeParse(req.body);
      console.log(validated);
      if(!validated.success) return Send.error(res,null,"Invalid input");
      const {email,password} = validated.data;
      const user = await prisma.user.findUnique({where: {email}});
    
      if(!user) {
        return Send.error(res,null,"User not exists");
      }

      const isValidUser = await bcrypt.compare(password,user.password);      
      if(!isValidUser) {
        return Send.error(res,null,"Password is incorrect");
      }

      const accessToken = jwt.sign(
        {userId:user.id},
        authConfig.secret,
        {expiresIn:authConfig.secret_expires as any}
      )

      const refreshToken = jwt.sign(
        {userId:user.id},
        authConfig.refresh_secret,
        {expiresIn:authConfig.refresh_expires as any}
      )

      await prisma.user.update({where: {email},data:{refreshToken}});
      console.log(req.cookies);
      res.cookie("accessToken",accessToken,{
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15*60*1000,
        sameSite: "strict"
      });

      res.cookie("refreshToken",refreshToken,{
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24*60*60*1000,
        sameSite: "strict"
      });

      return Send.success(res,{
          id:user.id,
          name: user.name,
          email:user.email,
        } 
      )
    } catch(error) {
      console.log("Login failed",error);
      return Send.error(res,null,"Login failed");
    }
  }

  static register = async (req:Request,res:Response) => {
    try {
      const validated = authSchema.register.safeParse(req.body);
      console.log(validated);
      if(!validated.success) return Send.error(res,null,"Invalid input");
      const {name,email,password,number} = validated.data;
      const hashedPassword = await bcrypt.hash(password,10);
  
      const exisited = await prisma.user.findUnique({where: {email}})
      if(exisited) {
        return Send.error(res, null, "Email already exists.");
      }
  
      const user = await prisma.user.create({data: {name,email,password:hashedPassword,number}});
      return Send.success(res, {
          id: user.id,
          name: user.name,
          email: user.email
      },"User created succesfully")
    } catch(error) {
      console.log("Register failed",error);
      return Send.error(res,null,"Register failed");
    }
  }

  static logout = async(req: Request,res:Response) => {
    try {
     
      const userId = (req as any).userId;
      if(userId) {
        await prisma.user.update({where: {id: userId},data: {refreshToken:null}});
      }

      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      res.status(200).json({success:true,message: "Logout successfully"});
    } catch(error) {
      console.log("Logout failed",error);
      res.status(500).json({success:false,message: "Logout failed"});
    }
  }

  static refreshToken = async(req:Request,res:Response) => {
    try{
      // if i want accestoken new the refrsh token shld be valid and +nt in db
      const userId = (req as any).userId;
      const refreshTokenCookie = req.cookies.refreshToken;
      const user = await prisma.user.findUnique({where: {id: userId}});
      if(!user) {
        return Send.error(res,null,"User not exists");
      }
      const refreshTokendb = user.refreshToken;
      if(!refreshTokendb) {
        return Send.error(res,null,"Refresh Token not found");
      }

      if(refreshTokenCookie!==refreshTokendb) {
        return Send.unAuthorized(res,null,"Refresh Token invalid");
      }

      const newAccessToken =jwt.sign({userId:user.id},authConfig.secret,{expiresIn:authConfig.secret_expires as any});
      res.cookie("accesstoken",newAccessToken,{
        httpOnly:true,
        maxAge: 15*60*1000,
        sameSite:"strict",
        secure: process.env.NODE_ENV === "production"
      })

      return Send.success(res,"Access token refresh successfully")
    } catch(error) {
      console.log("Refresh token failed",error);
      return Send.error(res,null,"Refresh token failed");
    }
  }
}

