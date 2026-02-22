import { useEffect, useState, type JSX } from "react"
import { api } from "./utils/axios";
import { Link } from "react-router-dom";
import {ArrowUpRight, CreditCard, Plus, Send, Wallet} from "lucide-react"
import { TransactionsTable } from "./TransactionsTable";
import type { userSchema } from "./types/transHistory.type";

export const Dashboard = ():JSX.Element => {
  const [user,setUser] = useState<userSchema | null>(null);

  useEffect(() => {
    const fetchUserDetails = async() => {
      try {
      const res = await api.get(`/dashboard`);
      setUser(res.data.data);
    } catch (error: any) {
      console.error(error);
    }
    }
    fetchUserDetails();
  },[]) 

  const latestTxn = [...(user?.transactions || [])]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )[0];

  return (
    <div className="px-40 py-8 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-semibold mb-1">Hello, {user?.name}</h1>
        <p className="text-gray-500 mb-8">Welcome back to PayX</p>
        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl p-6 shadow-lg overflow-hidden relative">
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

          <div className="col-span-2">
            <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>

            <div className="flex gap-6">
              
              {/* P2P Transfer Card */}
              <Link
                to="/p2p"
                className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-6  shadow-sm w-68 hover:shadow-lg transition"
              >
                <div className="bg-indigo-600 text-white p-4 rounded-xl">
                  <Send size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">P2P Transfer</p>
                  <p className="text-sm text-gray-500">Send money to anyone</p>
                </div>
              </Link>

              {/* Add Money Card */}
              <Link
                to="/transaction"
                className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-6 w-68 shadow-sm hover:shadow-lg transition"
              >
                <div className="bg-gray-100 text-indigo-600 p-4 rounded-xl">
                  <Plus size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Add Money</p>
                  <p className="text-sm text-gray-500">On-ramp from bank</p>
                </div>
              </Link>

            </div>
          </div>
        </div>


         <div className="grid grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-xl p-6 shadow">
            
            <div className="text-2xl font-semibold">
                <div className="bg-blue-600 p-3 rounded-lg w-12 mb-2">
                  <CreditCard size={20} className="text-white" />
                </div>
              Rs. {user?.balance.toLocaleString() ?? 0}
            </div>
            <div className="text-gray-500 text-sm my-2">Total Balance</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow">
            
            <div className="text-2xl font-semibold">
               <div className="bg-blue-600 p-3 rounded-lg w-12 mb-2">
                  < ArrowUpRight size={20} className="text-white"/>
                </div>
              Rs. {latestTxn?.amount ?? 0}
            </div>
            <div className="text-gray-500 text-sm my-2 ">Last Transaction</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow">
            
            <div className="text-2xl font-semibold">
               <div className="bg-blue-600 p-3 rounded-lg w-12 mb-2">
                <CreditCard  className=" text-white" size={20}/>
              </div>
              {user?.transactions.length ?? 0}
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