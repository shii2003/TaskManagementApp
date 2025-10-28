import { z } from "zod";
import { AssignedUserEmail } from "../models/Task";

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
            .enum(['john.doe@example.com', 'jane.smith@example.com', 'mike.johnson@example.com', 'sarah.wilson@example.com'])
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
            .enum(['john.doe@example.com', 'jane.smith@example.com', 'mike.johnson@example.com', 'sarah.wilson@example.com'])
            .optional(),
    });

export const updateStatusSchema = z
    .object({
        status: z.enum(["todo", "in_progress", "completed"]),
    });

export type updateTaskInput = z.infer<typeof updateTaskSchema>;