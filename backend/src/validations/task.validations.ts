import { z } from "zod";

export const createTaskSchema = z
    .object({
        title: z
            .string()
            .min(1, "Title is required"),
        description: z
            .string()
            .optional(),
        status: z
            .enum(["todo", "in_progress", "completed"])
            .optional(),
        assignedTo: z
            .string()
            .optional(),
    });

export const updateTaskSchema = z
    .object({
        title: z
            .string()
            .optional(),
        description: z
            .string()
            .optional(),
        status: z
            .enum(["todo", "in_progress", "completed"])
            .optional(),
        assignedTo: z
            .string()
            .optional(),
    });

export const updateStatusSchema = z
    .object({
        status: z.enum(["todo", "in_progress", "completed"]),
    });

export type updateTaskInput = z.infer<typeof updateTaskSchema>;