import Task, { TaskStatus, AssignedUserEmail } from "../models/Task";
import { AppError } from "../utils/AppError";
import logger from "../utils/logger";

export const createTask = async (
    userId: string,
    title: string,
    description?: string,
    status?: TaskStatus,
    assignedTo?: AssignedUserEmail
) => {
    try {
        if (!userId) throw AppError.unauthorized("User not authenticated");

        const task = await Task.create({
            title,
            description,
            status: status || "todo",
            assignedTo,
            createdBy: userId,
        });

        const populatedTask = await Task.findById(task._id)
            .populate("createdBy", "name email");

        logger.info(`Task created by user ${userId}: ${title}`);
        return populatedTask;
    } catch (error) {
        if (error instanceof AppError) throw error;
        logger.error("Error creating task:", error);
        throw AppError.internal("Something went wrong while creating task");
    }
};

export const getTasks = async (userId: string, queryParams: any) => {
    try {
        if (!userId) throw AppError.unauthorized("User not authenticated");

        const { status, search, assignedTo } = queryParams;
        const query: any = {
            createdBy: userId
        };

        if (status) query.status = status;
        if (assignedTo) query.assignedTo = assignedTo;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        const tasks = await Task.find(query)
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        return tasks;
    } catch (error) {
        if (error instanceof AppError) throw error;
        logger.error("Error fetching tasks:", error);
        throw AppError.internal("Something went wrong while fetching tasks");
    }
};

export const getTaskById = async (id: string) => {
    try {
        const task = await Task.findById(id)
            .populate("createdBy", "name email");

        if (!task) throw AppError.notFound("Task not found");

        return task;
    } catch (error) {
        if (error instanceof AppError) throw error;
        logger.error("Error fetching task by id:", error);
        throw AppError.internal("Something went wrong while fetching task");
    }
};

export const updateTask = async (
    id: string,
    userId: string,
    updates: { title?: string; description?: string; status?: TaskStatus; assignedTo?: AssignedUserEmail }
) => {
    try {
        const task = await Task.findById(id);
        if (!task) throw AppError.notFound("Task not found");

        if (task.createdBy.toString() !== userId)
            throw AppError.forbidden("Not authorized to update this task");

        Object.assign(task, updates);
        await task.save();

        const updatedTask = await Task.findById(id)
            .populate("createdBy", "name email");

        logger.info(`Task updated by user ${userId}: ${id}`);
        return updatedTask;
    } catch (error) {
        if (error instanceof AppError) throw error;
        logger.error("Error updating task:", error);
        throw AppError.internal("Something went wrong while updating task");
    }
};

export const deleteTask = async (id: string, userId: string) => {
    try {
        const task = await Task.findById(id);
        if (!task) throw AppError.notFound("Task not found");

        if (task.createdBy.toString() !== userId)
            throw AppError.forbidden("Not authorized to delete this task");

        await Task.findByIdAndDelete(id);
        logger.info(`Task deleted by user ${userId}: ${id}`);
    } catch (error) {
        if (error instanceof AppError) throw error;
        logger.error("Error deleting task:", error);
        throw AppError.internal("Something went wrong while deleting task");
    }
};

export const updateTaskStatus = async (id: string, status: TaskStatus) => {
    try {
        const validStatuses: TaskStatus[] = ["todo", "in_progress", "completed"];
        if (!validStatuses.includes(status)) {
            throw AppError.badRequest("Invalid status value");
        }

        const task = await Task.findById(id);
        if (!task) throw AppError.notFound("Task not found");

        task.status = status;
        await task.save();

        const updatedTask = await Task.findById(id)
            .populate("createdBy", "name email");

        logger.info(`Task status updated: ${id} -> ${status}`);
        return updatedTask;
    } catch (error) {
        if (error instanceof AppError) throw error;
        logger.error("Error updating task status:", error);
        throw AppError.internal("Something went wrong while updating task status");
    }
};

//fix validations