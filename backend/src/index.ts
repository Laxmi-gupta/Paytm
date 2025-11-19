import express from "express"
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
console.log(prisma);

app.get('/',(req,res) => {
  res.send("root route")
})

app.listen(3000,() => {
  console.log("listening at port 3000")
})