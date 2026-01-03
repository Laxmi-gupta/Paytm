import type React from "react";
import { useForm } from "react-hook-form";
import { api } from "./utils/axios";

export const Transactions: React.FC = () => {
  const {register,handleSubmit,formState:{errors},reset} = useForm();

  const onSubmit = async(data:any) => {
    try {
      const res = await api.post('/transaction',data);
      console.log("frotend calling",res.data.data.paymentUrl);
      window.location.href = (res.data.data.paymentUrl);
      reset();
    } catch(error) {
      console.log("Transaction failed",error);
    }
  }

  return (
    <div className="p-8 bg-gray-50 flex items-center justify-center">
      <div className="w-full bg-white shadow-lg rounded-xl p-8 max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Make a payment</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
            <input 
              type="number" 
              id="amount" 
              placeholder="Enter amount" 
              {...register("amount",{required:"Amount is required", valueAsNumber:true})}
              className="mt-1 w-full px-4 py-2 border rounded-md"  
            />
            {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message as string}</p>}
          </div>
          
          <div>
            <label htmlFor="provider" className="block text-sm font-medium text-gray-700">Select Bank</label>
            <select 
              id="provider" 
              className="mt-1 w-full px-4 py-2 border rounded-md"
              {...register("provider",{required: "Please select an option"})}>
              <option value="">-- Select Bank --</option>
              <option value="HDFC">HDFC</option>
              <option value="SBI">SBI</option>
            </select>
            {errors.provider && <p className="text-red-500 text-sm mt-1">{errors.provider.message as string}</p>}
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">Proceed to Pay</button>
        </form>
      </div>
    </div>
  )
}