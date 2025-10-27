import { Router } from "express";
import { protect } from "../middlewares/auth.middlewares";
import { getUsersHandler } from "../controllers/user.controllers";

const router = Router()

router.use(protect);

router.get("/", getUsersHandler);

export default router;