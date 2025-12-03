import {number, z} from "zod";

const login = z.object({
  email: z.string().min(1,"Email is required").email({message:"Invalid email format"}),
  password: z.string().min(1,"Password is required")
})

const register = z.object({
  name: z.string(),
  email: z.string().min(1,"Email is required").email({message:"Invalid email format"}),
  password: z.string().min(1,"Password is required"),
  number: z.string().min(10).max(10)
})

export const authSchema = {
  login,register
}