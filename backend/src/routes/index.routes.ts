import { Router } from "express";
import authRoutes from "./auth.routes"
import taskRoutes from "./task.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/task", taskRoutes);

export default router;