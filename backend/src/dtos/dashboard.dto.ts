export type txnSchema = {
  id: number,
  status: "Success" | "Failure" | "Processing",
  startTime: string,
  amount: number,
  type: "Credit" | "Debit"
  user: {
    name: string
  } 
}

export type userSchema = {
  user : {
    id: number;
    name: string;
    balance: number;
  },
  transactions: txnSchema[]
}


// DTO = Data Transfer Object: A DTO is a shape created ONLY for sending data to the client
// It is: NOT a Prisma model. NOT a DB table. NOT stored anywhere. Just a transformed object
// Think of it as a “view model for API”.