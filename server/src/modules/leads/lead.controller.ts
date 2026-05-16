import { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { AppError } from "../../utils/app-error";
import { sendSuccess } from "../../utils/api-response";
import { getValidationMessage } from "../../utils/validation";
import {
  createLeadBodySchema,
  leadIdParamSchema,
  listLeadsQuerySchema,
  updateLeadBodySchema,
} from "./lead.schema";
import {
  createLead,
  deleteLeadById,
  exportLeadsCsv,
  getLeadById,
  listLeads,
  updateLeadById,
} from "./lead.service";

const requireAuthUser = (req: Request) => {
  if (!req.user) {
    throw new AppError(401, "Authentication is required");
  }
  return req.user;
};

export const createLeadController = asyncHandler(async (req: Request, res: Response) => {
  const user = requireAuthUser(req);
  const parsed = createLeadBodySchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, getValidationMessage(parsed.error));
  }

  const lead = await createLead(parsed.data, user);
  sendSuccess(res, 201, "Lead created", lead);
});

export const listLeadsController = asyncHandler(async (req: Request, res: Response) => {
  const user = requireAuthUser(req);
  const parsed = listLeadsQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    throw new AppError(400, getValidationMessage(parsed.error));
  }

  const result = await listLeads(parsed.data, user);

  sendSuccess(res, 200, "Leads fetched", result.records, result.meta);
});

export const getLeadController = asyncHandler(async (req: Request, res: Response) => {
  const user = requireAuthUser(req);
  const parsedParams = leadIdParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    throw new AppError(400, getValidationMessage(parsedParams.error));
  }

  const lead = await getLeadById(parsedParams.data.id, user);
  sendSuccess(res, 200, "Lead fetched", lead);
});

export const updateLeadController = asyncHandler(async (req: Request, res: Response) => {
  const user = requireAuthUser(req);
  const parsedParams = leadIdParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    throw new AppError(400, getValidationMessage(parsedParams.error));
  }

  const parsedBody = updateLeadBodySchema.safeParse(req.body);
  if (!parsedBody.success) {
    throw new AppError(400, getValidationMessage(parsedBody.error));
  }

  const lead = await updateLeadById(parsedParams.data.id, parsedBody.data, user);
  sendSuccess(res, 200, "Lead updated", lead);
});

export const deleteLeadController = asyncHandler(async (req: Request, res: Response) => {
  const user = requireAuthUser(req);
  const parsedParams = leadIdParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    throw new AppError(400, getValidationMessage(parsedParams.error));
  }

  const lead = await deleteLeadById(parsedParams.data.id, user);
  sendSuccess(res, 200, "Lead deleted", lead);
});

export const exportLeadsCsvController = asyncHandler(async (req: Request, res: Response) => {
  const user = requireAuthUser(req);
  const parsed = listLeadsQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    throw new AppError(400, getValidationMessage(parsed.error));
  }

  const csv = await exportLeadsCsv(parsed.data, user);
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="leads.csv"`);
  res.status(200).send(csv);
});

