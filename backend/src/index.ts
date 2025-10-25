import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import cors from "cors";


const app = express();
const PORT = process.env.NODE_ENV || 3000;

app.use(express.json());
app.use(cors());

app.get("api/health", (req: Request, res: Response) => {
    res.status(200).json({ ok: true, message: "server is healthy!" })
});

const start = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server is running on PORT:${PORT}.`)
        })
    } catch (err) {
        console.log("Failed to start the server", err)
    }
}

start();
