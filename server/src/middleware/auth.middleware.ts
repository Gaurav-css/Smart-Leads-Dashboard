import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../utils/app-error";
import { AuthUser, UserRole } from "../modules/users/user.types";

interface JwtPayload {
  userId: string;
  role: UserRole;
  email: string;
}

const isValidPayload = (payload: unknown): payload is JwtPayload => {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const typedPayload = payload as Record<string, unknown>;
  return (
    typeof typedPayload.userId === "string" &&
    (typedPayload.role === "admin" || typedPayload.role === "sales") &&
    typeof typedPayload.email === "string"
  );
};

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new AppError(401, "Authorization header is required");
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    throw new AppError(401, "Authorization header must be in Bearer token format");
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    if (!isValidPayload(payload)) {
      throw new AppError(401, "Invalid authentication token payload");
    }

    const user: AuthUser = {
      userId: payload.userId,
      role: payload.role,
      email: payload.email,
    };
    req.user = user;
    next();
  } catch {
    throw new AppError(401, "Invalid or expired token");
  }
};

