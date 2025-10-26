import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/token.service";

export const protect = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res
                .status(401)
                .json({ message: "Not authorized, token missing" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token);
        req.user = {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name
        };
        next();
    } catch (err) {
        return res
            .status(401)
            .json({ message: "Not authorized, token invalid" });
    }
};