import jwt from "jsonwebtoken"
import { authConfig } from "../config/auth.config.js";

export const generateToken = (user: {id:number}) => {
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

    return {accessToken,refreshToken};
}