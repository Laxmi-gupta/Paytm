import {z} from "zod";

const login = z.object({
  email: z.string().min(1,"Email is required").email({message:"Invalid email format"}).trim(),
  password: z.string().min(1,"Password is required")
})

const register = z.object({
  name: z.string().min(1,"Name is required"),
  email: z.string().min(1,"Email is required").email({message:"Invalid email format"}).trim(),
  password: z.string().min(1,"Password is required"),
  number: z.string().min(10).max(10).regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
})

export type LoginCred = z.infer<typeof login>
export type SignupCred = z.infer<typeof register> 

export const authSchema = {
  login,register
}