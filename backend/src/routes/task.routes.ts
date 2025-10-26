import { Router } from "express";
import { protect } from "../middlewares/auth.middlewares";
import {
    createTaskHandler,
    deleteTaskHandler,
    getTaskByIdHandler,
    getTasksHandler,
    updateTaskHandler,
    updateTaskStatusHandler
} from "../controllers/task.controllers";

const router = Router();

router.use(protect);

router.post("/", createTaskHandler);
router.get("/", getTasksHandler);
router.get("/:id", getTaskByIdHandler);
router.put("/:id", updateTaskHandler);
router.delete("/:id", deleteTaskHandler);
router.patch("/:id/status", updateTaskStatusHandler);

export default router;