import express from "express"
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser"; 

const app = express();
const prisma = new PrismaClient();
const APP_PORT = process.env.APP_PORT;
app.use(express.json());
app.use(cookieParser()) // Express will parse all cookies and store them inside req.cookies

app.get('/',(req,res) => {
  res.send("root route")
})

app.post('/signup',async(req,res) => {
  try {
    const {name,email,password} = req.body;
    const hashedPassword = await bcrypt.hash(password,10);
    if(!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Fill empty details"
      })
    }

    const exisited = await prisma.user.findUnique({where: {email}})
    if(exisited) {
      return res.status(400).json({success: false, message: "User already exists"})
    }

    const user = await prisma.user.create({data: {name,email,password:hashedPassword}})

    return res.status(200).json({
      status: true,
      message: "User created succesfully",
      user:  {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })
  } catch(error) {
      return res.status(500).json({
        success: false,
        message: error
      })
    }
})

app.post('/login',async (req,res) => {
  try {
    const {email,password} = req.body;
    if(!email || !password) {
      return res.json({
        success: false,
        message: "Fill empty details"
      })
    }

    const user = await prisma.user.findUnique({where: {email}});
  
    if(!user) {
      return res.json({success:false,message: "User not exists"});
    }

    const isValidUser = await bcrypt.compare(password,user.password);

    if(!isValidUser) {
      return res.json({success:false,message: "Password is incorrect"});
    }

    const token = jwt.sign({email},process.env.JWT_SECRET_KEY as string);
    //const token = jwt.sign({userId},process.env.PRIVATE_KEY as string,{algorithm:'RS256'});
    console.log(token);

    return res.status(200).json({
      success:true,
      message: "User logged in succesfully",
      token
    })
  } catch(error) {
    return res.status(400).json({
        success: false,
        message: error
      })
  }
  
})

app.post('/verify',(req,res) => {
  const auth = req.headers.token;
  const tok = auth?.slice(7,);

  if(typeof tok !== "string") {return res.send("token invalid")};
  const decoded = jwt.verify(tok,process.env.PUBLIC_KEY as string);
  console.log(decoded);
  res.send("verify")
  // const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;

})

app.listen(APP_PORT,() => {
  console.log("listening at port 3000")
})