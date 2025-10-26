import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import cors from "cors";
import { PORT } from "./constants/env";
import requestLogger from "./middlewares/requestLogger";
import { errorHandler } from "./middlewares/errorHandler";
import logger from "./utils/logger";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(requestLogger);

app.get("/api/health", (req: Request, res: Response) => {
    res
        .status(200)
        .json({
            ok: true,
            message: "server is healthy!"
        })
});

app.use("/api/auth", authRoutes);

app.use(errorHandler);

const start = async () => {
    try {
        app.listen(PORT, () => {
            logger.info(`Server running on PORT:${PORT}.`)
        })
    } catch (err) {
        logger.error("Failed to start server", err);
        process.exit(1);
    }
}

start();
