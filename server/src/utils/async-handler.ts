import { NextFunction, Request, RequestHandler, Response } from "express";

type AsyncController = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

export const asyncHandler =
  (handler: AsyncController): RequestHandler =>
  (req, res, next) => {
    handler(req, res, next).catch(next);
  };

