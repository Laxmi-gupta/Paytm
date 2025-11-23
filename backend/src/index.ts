import express from "express"
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const app = express();
const prisma = new PrismaClient();
app.use(express.json());

app.get('/',(req,res) => {
  res.send("root route")
})

app.post('/login',(req,res) => {
  const {userId,password} = req.body;
  console.log({userId});
  //const token = jwt.sign({userId},process.env.JWT_SECRET_KEY as string);
  const token = jwt.sign({userId},process.env.PRIVATE_KEY as string,{algorithm:'RS256'});
  console.log(token);
  res.send("token generated");
})

app.post('/verify',(req,res) => {
  const auth = req.headers.token;
  const tok = auth?.slice(7,);

  if(typeof tok !== "string") {return res.send("token invalid")};
  const decoded = jwt.verify(tok,process.env.PUBLIC_KRY as string,{algorithms:['RS256']});
  console.log(decoded);
  res.send("verify")
  // const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;

})

app.listen(3000,() => {
  console.log("listening at port 3000")
})