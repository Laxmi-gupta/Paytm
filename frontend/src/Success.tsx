import axios from "axios";
import type React from "react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

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
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/transaction/status?token=${token}`,{withCredentials:true})
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
    <div className="min-h-screen bg-gray-100 flex justify-center py-10">
      <div className="w-full max-w-xl bg-white rounded-xl shadow p-6">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Payment Link Details</h2>
        </div>

        {/* Amount Section */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            ₹
          </div>
          <div>
            <p className="text-gray-500 text-sm">Amount</p>
            <p className="text-xl font-semibold">₹ {data.amount}</p>
          </div>
        </div>

        <hr className="mb-6" />

        {/* Transaction Info */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3">
            Payment Link Transactions
          </h3>

          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <p className="text-gray-500">Status</p>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium w-fit bg-green-100 text-green-700`}
            >
              {data.status === "Success" ? "Paid" : data.status}
            </span>

            <p className="text-gray-500">Created on</p>
            <p>{new Date(data.startTime).toLocaleString()}</p>

            <p className="text-gray-500">Provider</p>
            <p>{data.provider}</p>

            <p className="text-gray-500">Reference</p>
            <p>{token?.slice(0, 10)}...</p>
          </div>
        </div>

        <hr className="mb-6" />

        {/* Timeline */}
        <div>
          <h3 className="text-sm font-semibold mb-4">Timeline</h3>

          <div className="space-y-4 text-sm">
            <div className="flex gap-3">
              <span className="text-blue-600">✔</span>
              <div>
                <p className="font-medium">Created Payment Link</p>
                <p className="text-gray-500">
                  {new Date(data.startTime).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-blue-600">✔</span>
              <p>Awaiting Payment</p>
            </div>

            {data.status === "Success" && (
              <div className="flex gap-3">
                <span className="text-blue-600">✔</span>
                <p>
                  Payment Complete — ₹ {data.amount} received
                </p>
              </div>
            )}
          </div>
        </div>

        <Link to="/dashboard">Go to Dashboard</Link>
      </div>
    </div>
  );
  }
}