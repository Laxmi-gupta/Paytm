import type { Request,Response } from "express"
import { authSchema } from "shared-validation-schemas"
import { PrismaClient } from "@prisma/client"
import {success, z} from "zod"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { authConfig } from "../config/auth.config.js"
import { Send } from "../utils/response.utils.js"
import { generateToken } from "../utils/jwtToken.js"

const prisma = new PrismaClient();

interface decodedTok {
  userId: string
}

export class Auth {
  static login = async (req:Request,res:Response) => {
    try {
      // deletes the prev user session
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      const validated = authSchema.login.safeParse(req.body);
      if(!validated.success) return res.status(400).json({
        success: false,
        message: "Invalid email or password format"
      });
      const {email,password} = validated.data;
      const user = await prisma.user.findUnique({where: {email}});
    
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User does not exist"
        });
      }

      const isValidUser = await bcrypt.compare(password,user.password);      
      if(!isValidUser) {
        return res.status(401).json({
          success: false,
          message: "Incorrect password"
        });
      }

      const {accessToken,refreshToken} = generateToken({id: user.id});
      
      await prisma.user.update({where: {id: user.id},data:{refreshToken}});

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

      return res.status(200).json({
          success: true,
          message: "Login successful",
          data: {
          id:user.id,
          name: user.name,
          email:user.email}
        } 
      )
    } catch(error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong"
      });
    }
  }

  static register = async (req:Request,res:Response) => {
    try {
      // deletes the prev user session
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      const validated = authSchema.register.safeParse(req.body);
      
      if(!validated.success) return Send.error(res,null,"Invalid input");
      const {name,email,password,number} = validated.data;
      const hashedPassword = await bcrypt.hash(password,10);
      
      const exisited = await prisma.user.findUnique({where: {email}})
      if(exisited) {
        return res.status(400).json({
        success: false,
        message: "Email already exists."});
      }

      const exisitedPhone = await prisma.user.findUnique({where: {number}})
      if(exisitedPhone) {
       res.status(400).json({
        success: false,
        message: "Phone number already exists."});
      }
  
      const user = await prisma.user.create({
        data: {
          name,email,password:hashedPassword,number,
          Balance: {                    // update balance during signup
            create:{
              amount: 0,
              locked: 0
            }
          }
        }
      });

     const {accessToken,refreshToken} = generateToken({id: user.id});  

     await prisma.user.update({where: {id: user.id},data:{refreshToken}});

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

      return res.status(200).json({
          success: true,
          message: "User created succesfully",
          data: {
          id:user.id,
          name: user.name,
          email:user.email}
        } 
      )
      
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
      const refreshToken = req.cookies.refreshToken;
      if(!refreshToken) {
        return Send.unAuthorized(res, { message: "No refresh token provided" });
      }

      // const decodedToken = jwt.verify(token, secret) as string; bcoz its a object
      const decodedToken = jwt.verify(refreshToken,authConfig.refresh_secret) as decodedTok;
      if(!decodedToken) return Send.unAuthorized(res,null,"Unauthorized user");

      // if i want accestoken new the refrsh token shld be valid and +nt in db
      const userId = Number(decodedToken.userId);
      if(!userId) return Send.unAuthorized(res,null,"Unauthorized user");
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
      res.cookie("accessToken",newAccessToken,{
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

