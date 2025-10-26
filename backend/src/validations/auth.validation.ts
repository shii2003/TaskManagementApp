import { z } from "zod";

export const registerSchema = z
    .object({
        name: z
            .string()
            .min(2, "Name must be at least 2 characters long.")
            .max(20, "Name must be at most 20 characters long."),

        email: z
            .string()
            .email("Invalid email format"),

        password: z
            .string()
            .min(6, "Password must be at least 6 characters long.")
            .max(20, "Password must be at most 20 characters long.")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),

        confirmPassword: z
            .string()
            .nonempty("confirmPassword not passed"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const loginSchema = z.object({
    email: z
        .string()
        .email("Invalid email format"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters long.")
        .max(20, "Password must be at most 20 characters long.")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
