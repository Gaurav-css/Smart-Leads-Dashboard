import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error.middleware";
import { authRoutes } from "./modules/auth/auth.routes";
import { leadRoutes } from "./modules/leads/lead.routes";
import { AppError } from "./utils/app-error";
import { sendSuccess } from "./utils/api-response";

export const app = express();

app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
  }),
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  sendSuccess(res, 200, "API is healthy", { status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

app.use((_req, _res, next) => {
  next(new AppError(404, "Route not found"));
});

app.use(errorHandler);

