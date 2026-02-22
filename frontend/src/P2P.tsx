import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { saveP2pData, verifyOtpService } from "./services/transService";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod"
import toast from "react-hot-toast";
import { Wallet } from "lucide-react";
import type { userSchema } from "./types/transHistory.type";
import { api } from "./utils/axios";
import { useNavigate } from "react-router-dom";

const p2pTypes = z.object({
  number: z.string()
          .regex(/^[6-9]\d{9}$/, "Enter valid 10-digit mobile number"),
  amount: z.number()
          .min(1,"Amount is required")
          .max(10000,"Maximum amount cannot be transferred more than 10000")
})

type Payment = z.infer<typeof p2pTypes>

export const P2P:React.FC = () => {
  let [otpBox,SetOtpBox] = useState<boolean>(false);
  const {register,handleSubmit,formState:{errors,isSubmitting},reset} = useForm<Payment>(
    {
      resolver: zodResolver(p2pTypes)
    }
  );
  const [user,setUser] = useState<userSchema | null>(null);
  const [intentId,setIntentId] = useState<number | null>(null);
  const [otp,SetOtp] = useState("");
  const navigate = useNavigate();

  const onSubmit = async(data:Payment) => {
    try {
      const res = await saveP2pData(data);
      console.log(res);

      if(!res.success) {
        toast.error(res.message)
        if(res.code==="HIGH_RISK") {
          navigate('/login');
        }
        return;
      }

       if(res.riskLevel==="Medium") {
        setIntentId(res.intentId);
        toast.success("Otp send to your registered email");
        SetOtpBox(true);
        return;
      }

      if(res.riskLevel==="Low") {
        navigate(`/success-p2p?intentId=${res.intentId}`); // pass intwntid also
        reset();
      }

    } catch(err:any) {
      console.error("error in p2p transfer",err);
      toast.error(err?.response?.data?.message || "Transfer failed");
    }
  }
  
  useEffect(() => {
    const fetchUserDetails = async() => {
      const res = await api.get(`/dashboard`)
      setUser(res.data.data)
    }
    fetchUserDetails();
  },[]) 

  const verifyOtp = async(otp:string) => {
    if(!intentId) return; 
    if (otp.length !== 6) {
      toast.error("Enter valid 6 digit OTP");
      return;
    }
    try {
      const payload = {
        otp,
        intentId
      }
      const res = await verifyOtpService(payload);
      if(res.success) {
        navigate(`/success-p2p?intentId=${res.intentId}`); // pass intwntid also
        reset();
        SetOtpBox(false);
      }
    } catch(err) {
      toast.error("Otp verification failed")
      console.log("otp verified failed",err);
    }
  }

  return (
    <div className="min-h-screen bg-white">
        <div className="flex justify-center mt-8 px-4">
          <div className="w-full max-w-xl space-y-6">
            <div>
              <h1 className="text-lg font-semibold text-center">P2P Transfer</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Wallet size={40} className="bg-white/20 p-2 rounded-md" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">From</p>
                  <p className="font-medium">{user?.name}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500">Balance</p>
                <p className="font-semibold text-lg">{user?.balance.toLocaleString()}</p>
              </div>
            </div>

            {/* FORM CARD */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="">
                  <label className="text-sm font-medium text-gray-700">
                    Receiver's Mobile Number
                  </label>
                  <input 
                    className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    type="text"
                    {...register("number")} 
                      placeholder="eg. 9135454660"
                  />
                  {errors.number && <p className="text-red-500">{errors.number.message as string}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Amount</label>
                  <input 
                    className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-xl font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" 
                    {...register("amount",{valueAsNumber:true})} placeholder="0.00"
                  />
                  {errors.amount && <p className="text-red-500">{errors.amount.message as string}</p>}
                </div> 
                {!otpBox && (     
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white py-3 rounded-xl flex items-center justify-center gap-2 font-medium mt-2 mb-4" disabled={isSubmitting} >{isSubmitting ? "Sending": "Pay" }</button>)}
              </form>

              {otpBox && (
                <form onSubmit={(e) =>{e.preventDefault(); verifyOtp(otp)}} className="mt-2">
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-700">
                    OTP
                    </label>
                    <input type="text"
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="" onChange={(e) => SetOtp(e.target.value)}/>
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium" type="submit">Verify Otp</button>
                  </div>
                </form>    
              )}
            </div>
          </div>
        </div>

      
    </div>
  )
} 