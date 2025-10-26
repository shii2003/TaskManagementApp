import jwt, { Secret, SignOptions } from "jsonwebtoken"
import { JWT_EXPIRES_IN, JWT_SECRET } from "../constants/env"
import { AppError } from "../utils/AppError";
import logger from "../utils/logger";

interface JWTPayload {
    id: string;
    email: string;
    name: string;
}

export const generateToken = (payload: JWTPayload): string => {
    try {
        return jwt.sign(
            payload,
            JWT_SECRET, {
            expiresIn: "7d",
        });
    } catch (error) {
        logger.error("Failed to generate token", error);
        throw AppError.internal("Failed to generate token");
    }
};

export const verifyToken = (token: string): JWTPayload => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        return decoded;
    } catch (error: any) {
        logger.error("Token verification failed:", error);

        if (error.name === "TokenExpiredError") {
            throw AppError.unauthorized("Token has expired. Please log in again.");
        }

        if (error.name === "JsonWebTokenError") {
            throw AppError.unauthorized("Invalid token. Please log in again.");
        }

        throw AppError.internal("Failed to verify token");
    }
};