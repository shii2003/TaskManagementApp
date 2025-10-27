import { Router } from "express";
import { loginHandler, logoutHandler, signupHanlder } from "../controllers/auth.controllers";
import { protect } from "../middlewares/auth.middlewares";

const router = Router();

router.post('/register', signupHanlder);
router.post('/login', loginHandler);
router.post('/logout', protect, logoutHandler);

export default router;