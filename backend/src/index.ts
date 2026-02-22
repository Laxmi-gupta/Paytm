import express from "express"
import cookieParser from "cookie-parser"; 
import { Auth } from "./controllers/auth.controller.js";
import { appConfig } from "./config/app.config.js";
import { AuthMiddleware } from "./middlewares/auth.middlewares.js";
import { OnRamp } from "./controllers/onramp.controller.js";
import cors from "cors";
import type { Request,Response } from "express";
import { Dashboard } from "./controllers/dashboard.controller.js";
import { Webhook } from "./controllers/webhook.controller.js";
import AuthRoutes from "./routes/auth.routes.js";
import OnRampRoutes from "./routes/onramp.routes.js";
import P2pRoutes from "./routes/p2p.routes.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials:true
}))

app.use(express.json());
app.use(cookieParser()) // Express will parse all cookies and store them inside req.cookies

app.get("/me", AuthMiddleware.authenticateUser, (req:Request, res:Response) => {
  res.json({ userId: (req as any).userId });
});

app.use(AuthRoutes);

app.get('/dashboard',AuthMiddleware.authenticateUser,Dashboard.getUser);

app.get('/getName',AuthMiddleware.authenticateUser,Dashboard.getUserName);

app.post('/webhooks',Webhook.webhookHandler)

app.use(P2pRoutes);

app.use(OnRampRoutes);


app.listen(appConfig.port,() => {
  console.log(`listening at port ${appConfig.port}`)
})