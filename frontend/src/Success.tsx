import type React from "react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "./utils/axios";
import { ArrowRight, CheckCircle, Send } from "lucide-react";

type Transaction = {
  amount: number;
  provider: string;
  startTime: string;
  status: string;
}

export const Success: React.FC = () => {
  const [data,setData] = useState<Transaction | null>(null);
  const [searchParams] = useSearchParams();   // fetch values from query strings
  const token= searchParams.get("token")

  const fetchTransctn = async() => {
    if(!token) return;
    try {
      const res = await api.get(`${import.meta.env.VITE_API_URL}/transaction/status?token=${token}`,{withCredentials:true})
      setData(res.data.data);
    }
    catch(error) {
      console.error("error in fetching transctn details");
    }
  }

  useEffect(() => {
    fetchTransctn();
  },[token]) // api call only when token chnages

  if(data) {
    return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center">
        
        <div className="mx-auto bg-green-500 h-20 w-20 rounded-full flex items-center justify-center mb-6 shadow-md">
          <CheckCircle size={40} className="text-white flex items-center justify-center " />
        </div>
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Money Added Successfully!
        </h2>
        <p className="text-gray-500 mb-6">
          Your wallet has been credited through {data.provider}.
        </p>
        
        {/* Amount Section */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-2xl py-6 mb-6">
          <p className="text-green-700 text-sm font-medium">Amount Credited</p>
          <p className="text-4xl font-bold text-green-700">
            ₹ {data.amount}
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <Link to="/dashboard" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:opacity-90 transition">Go to Dashboard  <ArrowRight size={18} /></Link>
          <Link to="/p2p" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition"> <Send size={18} />Make P2P Transfer</Link>
        </div>
      </div>
    </div>
  );
  }
}