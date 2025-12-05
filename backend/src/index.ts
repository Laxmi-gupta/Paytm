import express from "express"
import cookieParser from "cookie-parser"; 
import { Auth } from "./controllers/auth.controller.js";
import { appConfig } from "./config/app.config.js";
import { AuthMiddleware } from "./middlewares/auth.middlewares.js";
// import { OnRamp } from "./controllers/onramp.controller.js";
import cors from "cors";

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

app.post('/login',Auth.login,async (req,res) => {

})

app.post('/logout',AuthMiddleware.authenticateUser,Auth.logout,(req,res) => {
  
})

app.post('/refresh-token',AuthMiddleware.RefreshTokenValidation,Auth.refreshToken,() => {
  
})

// app.post('/bank/transaction',AuthMiddleware.authenticateUser,OnRamp.createTransaction,() => {

// })

app.listen(appConfig.port,() => {
  console.log(`listening at port ${appConfig.port}`)
})