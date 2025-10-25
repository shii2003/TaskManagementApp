import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

interface AppError extends Error {
    status?: number;
    statusCode?: number;
}

export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    logger.error("Error: %s, stack: %s", message, err.stack || "");
    res.status(status).json({ success: false, message });
}