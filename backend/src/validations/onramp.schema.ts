import {z} from "zod"

const createTrans = z.object({
  amount: z.number().min(1,"Amount is required"), 
  provider: z.enum(["HDFC","SBI"])
})

const rampStatus = z.object({
  status: z.enum(["Processing","Failure","Success"])
})


export const onRampSchema = {
  createTrans,rampStatus
}