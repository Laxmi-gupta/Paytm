import express from "express"
import cookieParser from "cookie-parser"; 
import { Auth } from "./controllers/auth.controller.js";
import { appConfig } from "./config/app.config.js";
import { AuthMiddleware } from "./middlewares/auth.middlewares.js";
import { OnRamp } from "./controllers/onramp.controller.js";
import cors from "cors";
import { p2p } from "./controllers/p2p.controller.js";
import axios from "axios";
import { Dashboard } from "./controllers/dashboard.controller.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials:true
}))

app.use(express.json());
app.use(cookieParser()) // Express will parse all cookies and store them inside req.cookies

app.get('/',(req,res) => {
  res.send("root route")
})

app.post('/signup',Auth.register);

app.post('/login',Auth.login);

app.post('/logout',AuthMiddleware.authenticateUser,Auth.logout);

app.post('/refresh-token',Auth.refreshToken);

app.get('/dashboard',AuthMiddleware.authenticateUser,Dashboard.getUser);

app.get('/getName',AuthMiddleware.authenticateUser,Dashboard.getUserName);

app.post('/transaction',AuthMiddleware.authenticateUser,OnRamp.createTransaction);

app.post('/webhooks',async(req,res) => {
  const {userId, amount, token}:any = req.body;  
  console.log("inside webhooko ")
  await axios.post('http://localhost:3000/dbUpdate',{userId, amount, token});
  console.log("database updated")
  return res.status(200).json({message:"db updated"})
})

app.post('/dbUpdate',OnRamp.databaseUpdate);

app.post('/p2p',AuthMiddleware.authenticateUser,p2p.p2pTransfer);

app.post('/p2p/verify-otp',AuthMiddleware.authenticateUser,p2p.p2pVerify);

app.get('/transaction/status',AuthMiddleware.authenticateUser,OnRamp.getTransaction)

app.listen(appConfig.port,() => {
  console.log(`listening at port ${appConfig.port}`)
})