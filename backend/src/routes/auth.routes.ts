import { Router } from "express";
import { loginHandler, signupHanlder } from "../controllers/authController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

router.post('/register', signupHanlder);
router.post('/login', protect, loginHandler);

export default router;