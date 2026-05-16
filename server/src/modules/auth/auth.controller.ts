import { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { AppError } from "../../utils/app-error";
import { sendSuccess } from "../../utils/api-response";
import { getValidationMessage } from "../../utils/validation";
import { loginBodySchema, registerBodySchema } from "./auth.schema";
import { getCurrentUser, loginUser, registerUser } from "./auth.service";

export const registerController = asyncHandler(async (req: Request, res: Response) => {
  const parsed = registerBodySchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, getValidationMessage(parsed.error));
  }

  const result = await registerUser(parsed.data);

  sendSuccess(res, 201, "Registration successful", result);
});

export const loginController = asyncHandler(async (req: Request, res: Response) => {
  const parsed = loginBodySchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, getValidationMessage(parsed.error));
  }

  const result = await loginUser(parsed.data);

  sendSuccess(res, 200, "Login successful", result);
});

export const meController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(401, "Authentication is required");
  }

  const user = await getCurrentUser(req.user.userId);
  sendSuccess(res, 200, "Current user fetched", user);
});

