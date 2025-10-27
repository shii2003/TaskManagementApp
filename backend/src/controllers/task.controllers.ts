import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { AppError } from "../utils/AppError";
import {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    updateTaskStatus,
} from "../services/task.services";
import { createTaskSchema, updateStatusSchema, updateTaskSchema } from "../validations/task.validations";
import Task from "../models/Task";

export const createTaskHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = createTaskSchema.safeParse(req.body);
        if (!parsed.success) {
            return next(AppError.badRequest(parsed.error.issues[0].message));
        }

        const userId = req.user?.id;
        const { title, description, status, assignedTo } = parsed.data;

        const result = await createTask(userId!, title, description, status, assignedTo);
        res
            .status(201)
            .json(ApiResponse.success(
                "Task created successfully",
                result
            ));
    } catch (error) {
        next(error);
    }
};

export const getTasksHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const result = await getTasks(userId!, req.query);
        res
            .status(200)
            .json(ApiResponse.success(
                "Tasks fetched successfully",
                result
            ));
    } catch (error) {
        next(error);
    }
};

export const getTaskByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await getTaskById(id);
        res
            .status(200)
            .json(ApiResponse.success(
                "Task fetched successfully",
                result
            ));
    } catch (error) {
        next(error);
    }
};

export const updateTaskHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = updateTaskSchema.safeParse(req.body);
        if (!parsed.success) {
            return next(AppError.badRequest(parsed.error.issues[0].message));
        }

        const { id } = req.params;
        const userId = req.user?.id;
        const result = await updateTask(id, userId!, parsed.data);
        res
            .status(200)
            .json(ApiResponse.success(
                "Task updated successfully",
                result
            ));
    } catch (error) {
        next(error);
    }
};

export const deleteTaskHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        await deleteTask(id, userId!);
        res.
            status(200).json(ApiResponse.success(
                "Task deleted successfully"
            ));
    } catch (error) {
        next(error);
    }
};

export const getMyTasksHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;

        const tasks = await Task.find({ createdBy: userId })
            .populate("assignedTo", "name email")
            .sort({ createdAt: -1 });

        return res
            .status(200)
            .json(ApiResponse.success("Tasks fetched successfully", tasks));
    } catch (error) {
        next(error);
    }
};

export const updateTaskStatusHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = updateStatusSchema.safeParse(req.body);
        if (!parsed.success) {
            return next(AppError.badRequest(parsed.error.issues[0].message));
        }

        const { id } = req.params;
        const { status } = parsed.data;
        const result = await updateTaskStatus(id, status);
        res
            .status(200)
            .json(ApiResponse
                .success(
                    "Task status updated successfully",
                    result
                ));
    } catch (error) {
        next(error);
    }
};
