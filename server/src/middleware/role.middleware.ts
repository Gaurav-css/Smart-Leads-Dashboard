import { NextFunction, Request, Response } from "express";
import { UserRole } from "../modules/users/user.types";
import { AppError } from "../utils/app-error";

export const authorizeRoles =
  (...allowedRoles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError(401, "Authentication is required");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError(403, "You are not allowed to perform this action");
    }

    next();
  };

