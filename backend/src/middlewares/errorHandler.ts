import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import logger from "../utils/logger";

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (res.headersSent) {
        return next(err);
    }

    let statusCode = 500;
    let message = "Internal Server Error";

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    } else {
        logger.error("Unhandled Error:", err);
    }

    return res.status(statusCode).json({
        success: false,
        message,
    });
};

//check if logger is working fine
