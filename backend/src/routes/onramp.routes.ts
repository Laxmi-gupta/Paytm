import {Router} from "express"
import { AuthMiddleware } from "../middlewares/auth.middlewares.js";
import { OnRamp } from "../controllers/onramp.controller.js";

const router = Router();

router.post('/transaction',AuthMiddleware.authenticateUser,OnRamp.createTransaction);
router.get('/transaction/status',AuthMiddleware.authenticateUser,OnRamp.getTransaction);

export default router;