import { useEffect, useState, type JSX } from "react"
import { api } from "./utils/axios";
import { Link } from "react-router-dom";
import {ArrowUpRight, CreditCard, Plus, Send, Wallet} from "lucide-react"
import { TransactionsTable } from "./TransactionsTable";
import type { userSchema } from "./types/transHistory.type";

// type userSchema = {   
//   id: number;
//   name: string;
//   Balance : {
//     amount: number
//   },
//   // trsn details
//   ledgerEntries: {
//     id: number,
//     amount: number,
//     mode: "Credit" | "Debit",
//     createdAt: string, 
//   },
//   sendTransfers: {
//     status: string,
//     receiver: {
//       name: string
//     }
//   }
// }  

export const Dashboard = ():JSX.Element => {
  const [user,setUser] = useState<userSchema | null>(null);

  useEffect(() => {
    const fetchUserDetails = async() => {
      const res = await api.get(`${import.meta.env.VITE_API_URL}/dashboard`)
      console.log(res.data.data)
      setUser(res.data.data)
    }
    fetchUserDetails();
  },[]) 

  const latestTxn = [...(user?.transactions || [])]
    .sort(
      (a, b) =>
        new Date(b.startTime).getTime() -
        new Date(a.startTime).getTime()
    )[0];

    console.log("fetched usser",user)

  return (
    <div className="px-28 py-8 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-semibold mb-1">Hello, {user?.name}</h1>
        <p className="text-gray-500 mb-8">Welcom back to PayX</p>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl p-6 shadow-lg overflow-hidden relative">
            <div className="flex items-center gap-2 text-sm opacity-90 mb-1">
              <Wallet size={40} className="bg-white/20 p-2 rounded-md" />
              <div>
                <p className="opacity-70">Wallet Balance</p>
                <p className="opacity-70">Available to spend</p>
              </div>
            </div>
            
            <div className="text-3xl font-bold mb-1 mt-4">Rs. {user?.balance}</div>
            <p className="text-sm opacity-80">Indian rupees</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="flex">
              <Link to="/transaction" className="flex items-center gap-3 bg-green-500 text-white rounded-xl p-6 font-medium shadow hover:bg-green-600 transition">
                <Plus className="bg-white/20 p-1 rounded-md" />
                <p className="block">Add money</p>
              </Link>
            
              <Link to="/p2p" className="flex items-center gap-3 ml-4 bg-blue-600 text-white rounded-xl p-6 font-medium shadow hover:bg-blue-700 transition">
                <Send className="bg-white/20 p-1 rounded-md" />
                <p className="block">Send money</p></Link>
            </div>
          </div>
        </div>


         <div className="grid grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-xl p-6 shadow">
            
            <div className="text-2xl font-semibold">
                <div className="bg-blue-600 p-3 rounded-lg w-12 mb-2">
                  <CreditCard size={20} className="text-white" />
                </div>
              {user?.balance.toLocaleString()}
            </div>
            <div className="text-gray-500 text-sm my-2">Total Balance</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow">
            
            <div className="text-2xl font-semibold">
               <div className="bg-blue-600 p-3 rounded-lg w-12 mb-2">
                  < ArrowUpRight size={20} className="text-white"/>
                </div>
              Rs. {latestTxn?.amount}
            </div>
            <div className="text-gray-500 text-sm my-2 ">Last Transaction</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow">
            
            <div className="text-2xl font-semibold">
               <div className="bg-blue-600 p-3 rounded-lg w-12 mb-2">
                <CreditCard  className=" text-white" size={20}/>
              </div>
              {user?.transactions.length}
            </div>
            <div className="text-gray-500 text-sm my-2">Total Transactions</div>
          </div>
        </div>
      </div>

      <TransactionsTable transactions={user?.transactions || []}/>  
      {/* here pass the actual transaction list */}
    </div>
  )
}