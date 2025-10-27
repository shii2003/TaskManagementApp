import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { AppError } from "../utils/AppError";
import { ApiResponse } from "../utils/ApiResponse";

export const getUsersHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find({}, "name email");
        if (!users.length) {
            return next(AppError.notFound("No users found"));
        }

        res
            .status(200)
            .json(ApiResponse.success(
                "Users fetched successfully",
                users
            ));
    } catch (error) {
        next(error);
    }
};