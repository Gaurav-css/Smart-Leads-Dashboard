import { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";
import { env } from "../config/env";
import { AppError } from "../utils/app-error";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: {
        code: error.statusCode,
      },
    });
    return;
  }

  if (error instanceof ZodError) {
    const message = error.issues[0]?.message ?? "Validation error";
    res.status(400).json({
      success: false,
      message,
      error: {
        code: 400,
      },
    });
    return;
  }

  if (error instanceof mongoose.Error.CastError) {
    res.status(400).json({
      success: false,
      message: "Invalid identifier format",
      error: {
        code: 400,
      },
    });
    return;
  }

  if (error instanceof mongoose.Error.ValidationError) {
    const message = Object.values(error.errors)[0]?.message ?? "Validation error";
    res.status(400).json({
      success: false,
      message,
      error: {
        code: 400,
      },
    });
    return;
  }

  if (typeof error === "object" && error !== null && "code" in error) {
    const mongoError = error as { code?: number; keyValue?: Record<string, unknown> };
    if (mongoError.code === 11000) {
      const duplicateField = Object.keys(mongoError.keyValue ?? {})[0] ?? "field";
      res.status(409).json({
        success: false,
        message: `${duplicateField} already exists`,
        error: {
          code: 409,
        },
      });
      return;
    }
  }

  const message = error instanceof Error ? error.message : "Something went wrong";
  res.status(500).json({
    success: false,
    message: env.NODE_ENV === "production" ? "Internal server error" : message,
    error: {
      code: 500,
    },
  });
};

