import express from "express";

import cors from "cors";

import bodyParser from "body-parser";

import appRouter from "./routes/v1/appRouter";
import { globalLimiter } from "./middlewares/rateLimiter";

import "./config/passport";

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
    }),
);

app.use(bodyParser.json());

app.set("trust proxy", 1);

app.use("/api", globalLimiter);

app.use("/api/v1", appRouter());

export default app;
