  export type txnSchema = {
    id: number,
    status: "Success" | "Failure" | "Processing",
    createdAt: string,
    amount: number,
    type: "Credit" | "Debit"
    user: {
      name: string | null
    } 
  }

  export type userSchema = {
    id: number;
    name: string;
    balance: number;
    transactions: txnSchema[]
  }