import React from "react"
import { useForm } from "react-hook-form"
import { saveP2pData } from "./services/transService";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod"

const p2pTypes = z.object({
  number: z.string()
          .regex(/^[6-9]\d{9}$/, "Enter valid 10-digit mobile number"),
  amount: z.number()
          .min(1,"Amount is required")
          .max(10000,"Maximum amount cannot be transferred more than 10000")
})

type Payment = z.infer<typeof p2pTypes>

export const P2P:React.FC = () => {
  const {register,handleSubmit,formState:{errors,isSubmitting}} = useForm<Payment>(
    {
      resolver: zodResolver(p2pTypes)
    }
  );

  const onSubmit = async(data:Payment) => {
    const res = await saveP2pData(data);
    console.log(res);
  }
  return (
    <>
      <form className="mt-11" onSubmit={handleSubmit(onSubmit)}>
        <input 
          type="text" 
          {...register("number",{required:"Phone no is required",pattern: {
              value: /^[6-9]\d{9}$/,
              message: "Enter valid 10-digit mobile number",
            },})} 
          placeholder="Enter Phone no"
        />
        {errors.number && <p className="text-red-500">{errors.number.message as string}</p>}

        <input 
          {...register("amount",{valueAsNumber:true})} placeholder="Enter Amount"
        />
        {errors.amount && <p>{errors.amount.message as string}</p>}
        <button type="submit" className="border bg-blue-400 p-2 rounded-xl" disabled={isSubmitting} >{isSubmitting ? "Sending": "Pay" }</button>
      </form>
    </>
  )
} 