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

// Atrás de um proxy reverso (Railway, Nginx, etc.) defina TRUST_PROXY com o
// número de proxies à frente da API. Rodando localmente, deixe 0/ausente para
// que o rate-limit use o IP real da conexão e não confie em X-Forwarded-For.
const trustProxy = Number(process.env.TRUST_PROXY ?? 0);
app.set("trust proxy", trustProxy);

app.disable("x-powered-by");
app.use(helmet());
app.use(express.json({ limit: "1mb" }));

// Sem CORS_ORIGIN definido, reflete a origem da requisição. Necessário porque
// `credentials: true` é incompatível com `Access-Control-Allow-Origin: *`.
const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((s) => s.trim())
  : true;

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
