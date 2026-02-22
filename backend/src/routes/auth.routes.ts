import {Router} from "express"
import { Auth } from "../controllers/auth.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middlewares.js";

const router = Router();

router.post('/login',Auth.login);
router.post('/signup',Auth.register);
router.post('/logout',AuthMiddleware.authenticateUser,Auth.logout);
router.post('/refresh-token',Auth.refreshToken);

export default router;