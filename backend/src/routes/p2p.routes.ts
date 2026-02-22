import {Router} from "express"
import { AuthMiddleware } from "../middlewares/auth.middlewares.js";
import { OnRamp } from "../controllers/onramp.controller.js";
import { p2p } from "../controllers/p2p.controller.js";

const router = Router();

router.post('/p2p',AuthMiddleware.authenticateUser,p2p.p2pTransfer);

router.post('/p2p/verify-otp',AuthMiddleware.authenticateUser,p2p.p2pVerify);

router.get('/transaction/intent',AuthMiddleware.authenticateUser,p2p.getSuccessData);

export default router;