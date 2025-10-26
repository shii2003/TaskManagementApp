import User from "../models/User";
import { AppError } from "../utils/AppError";
import { comparePasswords, hashPassword } from "../utils/hashPassword";
import logger from "../utils/logger";
import { generateToken } from "./token.services";

interface AuthResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    }
}

export const createUser = async (
    name: string,
    email: string,
    password: string
): Promise<AuthResponse> => {
    try {

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw AppError.conflict("User with this email already exists");
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        logger.info(`New user registered: ${user.email}`);

        const token = generateToken({
            id: user._id.toString(),
            email: user.email,
            name: user.name,
        });

        return {
            token,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
            },
        };
    } catch (error) {
        if (error instanceof AppError) throw error;

        logger.error("Error creating user:", error);
        throw AppError.internal("Something went wrong while creating user");
    }
};

export const loginUser = async (
    email: string,
    password: string
): Promise<AuthResponse> => {
    try {

        const user = await User.findOne({ email });
        if (!user) {
            throw AppError.unauthorized("User does not exist.");
        }

        const isPasswordValid = await comparePasswords(password, user.password);
        if (!isPasswordValid) {
            throw AppError.unauthorized("Wrong password.");
        }

        logger.info(`User logged in: ${user.email}`);

        const token = generateToken({
            id: user._id.toString(),
            email: user.email,
            name: user.name,
        });

        return {
            token,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
            },
        };
    } catch (error) {
        if (error instanceof AppError) throw error;

        logger.error("Error logging in user:", error);
        throw AppError.internal("Something went wrong while logging in");
    }
};