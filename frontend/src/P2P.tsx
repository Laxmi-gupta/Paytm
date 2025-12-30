import React from "react"
import { useForm } from "react-hook-form"
import type { p2pSchema } from "./types/trans";
import { saveP2pData } from "./services/transService";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod"

const p2pTypes = z.object({
  number: z.string(),
  amount: z.number()
})

type Payment = z.infer<typeof p2pTypes>

export const P2P:React.FC = () => {
  const {register,handleSubmit,formState:{errors}} = useForm<Payment>(
    {
      resolver: zodResolver(p2pTypes)
    }
  );

  const onSubmit = async(data:p2pSchema) => {
    console.log(data);
    const res = await saveP2pData(data);
    console.log(res);
  }
  return (
    <>
      <form className="mt-11" onSubmit={handleSubmit(onSubmit)}>
        <input 
          type="text" 
          {...register("number",{required:"Phone no is required"})} 
          placeholder="Enter Phone no"
        />
        {errors.number && <p>{errors.number.message as string}</p>}

        <input 
          type="number" 
          {...register("amount",{required:"Amount is required",valueAsNumber:true})} placeholder="Enter Amount"
        />
        {errors.amount && <p>{errors.amount.message as string}</p>}
        <button type="submit">Submit</button>
      </form>
    </>
  )
} 