import { CheckCircle } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "./utils/axios";

type SuccessData = {
  amount: number;
  receiver:{email: string};
  status: string;
  sender:{email: string};
}

export const SuccessTxn: React.FC = () => {
  const [data,setData] = useState<SuccessData | null>(null);
  const [searchParams] = useSearchParams(); 
  const intentId = searchParams.get("intentId");

  const fetchTransctn = async() => {
    if(!intentId) return;
    try {
      const res = await api.get(`${import.meta.env.VITE_API_URL}/transaction/intent?intentId=${intentId}`)
      setData(res.data.data);
    }
    catch(error) {
      console.error("error in fetching success details");
    }
  }

  useEffect(() => {
    fetchTransctn();
  },[intentId]) 

  if(!data) return;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="bg-green-500 h-20 w-20 rounded-full flex items-center justify-center mb-6 shadow-md">
        <CheckCircle size={40} className="text-white" />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        "Transfer Successful!" 
      </h1>

      <p className="text-gray-600 mb-8 text-center">
        ₹{data.amount}{" "}
        {`sent to ${data.receiver.email}`}
      </p>

      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-md mb-6">

        <div className="flex justify-between mb-4 ">
          <span className="text-gray-500">From</span>
          <span className="font-medium">{data.sender.email}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-gray-500">Amount</span>
          <span className="font-semibold text-green-600">
            ₹{data.amount}
          </span>
        </div>
      </div>

      <div className="flex gap-4">
        <Link
          to="/dashboard"
          className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
        >
          Dashboard
        </Link>

        <Link to={"/p2p"} className="px-6 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition">{"New Transfer" }</Link>
      </div>
    </div>
  )
}