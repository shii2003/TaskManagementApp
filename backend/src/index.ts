import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import cors from "cors";
import { MONGO_URI, PORT } from "./constants/env";
import requestLogger from "./middlewares/requestLogger.middlewares";
import { errorHandler } from "./middlewares/errorHandler.middlewares";
import logger from "./utils/logger";
import routes from "./routes/index.routes"
import { connectDB } from "./config/db";

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

app.use("/api", routes);

app.use(errorHandler);

const start = async () => {
    try {
        await connectDB(MONGO_URI);
        app.listen(PORT, () => {
            logger.info(`Server running on PORT:${PORT}.`)
        })
    } catch (err) {
        logger.error("Failed to start server", err);
        process.exit(1);
    }
}

start();
