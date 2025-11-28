import {z} from "zod";

const login = z.object({
  email: z.string().min(1,"Email is required").email({message:"Invalid email format"}),
  password: z.string().min(1,"Password is required")
})

const register = z.object({
  username: z.string(),
  email: z.string().min(1,"Email is required").email({message:"Invalid email format"}),
  password: z.string().min(1,"Password is required")
})

export const authSchema = {
  login,register
}