import { Router } from "express";
import { loginHandler, signupHanlder } from "../controllers/auth.controllers";
import { protect } from "../middlewares/auth.middlewares";

const router = Router();

router.post('/register', signupHanlder);
router.post('/login', loginHandler);

export default router;