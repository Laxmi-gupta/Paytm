import type React from "react";
import { useForm } from "react-hook-form";
import { api } from "./utils/axios";
import toast from "react-hot-toast";
import { Info } from "lucide-react";

export const Transactions: React.FC = () => {
  const {register,handleSubmit,formState:{errors},reset} = useForm();

  const onSubmit = async(data:any) => {
    try {
      const res = await api.post('/transaction',data);
      if(!res.data.ok) {
        toast.error(res.data.message);
        return
      }
      toast.success(res.data.message);
      window.location.href = (res.data.data.paymentUrl);
      reset();
    } catch(error:any) {
      console.log("Transaction failed",error);
       const message = error.response?.data?.message || "Transaction failed";
      toast.error(message);
    }
  }

  return (
  <div className="min-h-screen bg-white-100">
      <div className="flex justify-center items-center gap-3 pt-5">
        <h1 className="text-xl font-semibold">Add Money</h1> 
      </div>
      <div className="max-w-xl mx-auto p-6 space-y-6">
        <div className="bg-gray-100 border border-blue-100 rounded-xl p-4 flex gap-3">
          <Info className="text-blue-600 w-5 h-5 mt-1" />
          <div>
            <p className="font-medium text-gray-800">
              Bank → PayX Wallet
            </p>
            <p className="text-sm text-gray-500">
              Money will be credited instantly after bank confirmation.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="provider" className="text-sm font-medium text-gray-700">Select Bank</label>
              <select 
                id="provider" 
                className="mt-2 w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                {...register("provider",{required: "Please select an option"})}>
                <option value="">-- Select Bank --</option>
                <option value="HDFC">HDFC</option>
                <option value="SBI">SBI</option>
              </select>
              {errors.provider && <p className="text-red-500 text-sm mt-1">{errors.provider.message as string}</p>}
            </div>

            <div>
              <label htmlFor="amount" className="text-sm font-medium text-gray-700">Amount</label>
              <input 
                type="number" 
                id="amount" 
                placeholder="0.00" 
                {...register("amount",{required:"Amount is required", valueAsNumber:true,
                   min: {
                    value: 1,
                    message: "Amount must be greater than 0"
                  }
                })}
                className="w-full mt-2 p-3 text-xl border rounded-xl focus:ring-2 focus:ring-black outline-none"
                
              />
              {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message as string}</p>}
            </div>
            
            
            <button type="submit"  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-white font-semibold text-lg bg-gradient-to-r from-indigo-800 to-indigo-600 hover:opacity-95 transition">Proceed to Pay</button>
          </form>
        </div>
      </div>
    </div>
  )
}