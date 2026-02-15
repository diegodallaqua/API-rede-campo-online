import "reflect-metadata";
import "dotenv/config";

import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { errors } from "celebrate";

import "../../container/index";
import { errorHandler } from "./middlewares/errorHandler";
import { routes } from "./routes";

export const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(express.json({ limit: "1mb" }));

const corsOrigin = process.env.CORS_ORIGIN?.split(",").map((s) => s.trim()) ?? "*";
app.use(
  cors({
    origin: corsOrigin,
    credentials: true
  })
);

const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60000);
const max = Number(process.env.RATE_LIMIT_MAX ?? 120);

app.use(
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use(routes);

app.use(errors());

app.use(errorHandler);
