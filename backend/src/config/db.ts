import mongoose from "mongoose";
import logger from "../utils/logger";

export const connectDB = async (mongoUri: string) => {
    try {
        await mongoose.connect(mongoUri);
        logger.info("MongoDB connected");
    } catch (err) {
        logger.error("MongoDB connection error:", err);
        throw err;
    }
};