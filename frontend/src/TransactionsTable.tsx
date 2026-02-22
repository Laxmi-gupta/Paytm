import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import type { txnSchema } from "./types/transHistory.type";

interface Props {
  transactions: txnSchema[];
}

export const TransactionsTable = ({ transactions }: Props) => (
  <>
  {transactions.length > 0  && (<h3 className="font-semibold text-lg mb-4 mt-8">Recent Transactions</h3> )}
  {transactions.map((tx: txnSchema) => (
    <div
      key={tx.id}
      className="flex justify-between items-center bg-white rounded-lg p-4 mb-4 shadow-sm"
    >
      <div className="flex items-center gap-4">
      
        <div
          className={`p-2 rounded-md ${
            tx.type === "Credit"
              ? "bg-green-500/20 text-green-600"
              : "bg-red-500/20 text-red-600"
          }`}
        >
          {tx.type=="Credit" && <ArrowUpRight size={20}/> }
          {tx.type=="Debit" &&<ArrowDownLeft  size={20} /> }
          </div>
          
          <div>
            <p className="font-medium">{tx.user.name}</p>
            <p className="text-xs text-gray-500">
              {new Date(tx.createdAt).toLocaleString()}
            </p>
        </div>
      </div>
      <p
        className={`font-semibold ${
          tx.type === "Credit" ? "text-green-600" : "text-red-600"
        }`}
      >
        {tx.type === "Credit" ? "+" : "-"}₹{tx.amount}
      </p>
    </div>
  ))}
    

  </>
);
