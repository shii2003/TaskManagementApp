import { NextFunction, Request, Response } from "express";
import { ApiResponse, } from "../utils/ApiResponse";
import { loginSchema, registerSchema } from "../validations/auth.validations";
import { AppError } from "../utils/AppError";
import { createUser, loginUser } from "../services/auth.services";

export const signupHanlder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = registerSchema.safeParse(req.body);
        if (!parsed.success) {
            return next(AppError.badRequest(parsed.error.issues[0].message));
        }

        const { name, email, password } = parsed.data;
        const result = await createUser(name, email, password);

        return res
            .status(201)
            .json(ApiResponse.success("User registered successfully", result));
    } catch (error) {
        next(error);
    }
};

export const loginHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success) {
            return next(AppError.badRequest(parsed.error.issues[0].message));
        }

        const { email, password } = parsed.data;
        const result = await loginUser(email, password);

        return res
            .status(200)
            .json(ApiResponse.success("Login successful", result));
    } catch (error) {
        next(error);
    }
};


