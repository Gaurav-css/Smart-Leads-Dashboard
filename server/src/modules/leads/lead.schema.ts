import { z } from "zod";
import { LEAD_SOURCES, LEAD_STATUSES } from "./lead.types";

export const createLeadBodySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.email("Enter a valid email").transform((value) => value.toLowerCase()),
  status: z.enum(LEAD_STATUSES).default("new"),
  source: z.enum(LEAD_SOURCES),
});

export const updateLeadBodySchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").optional(),
    email: z
      .email("Enter a valid email")
      .transform((value) => value.toLowerCase())
      .optional(),
    status: z.enum(LEAD_STATUSES).optional(),
    source: z.enum(LEAD_SOURCES).optional(),
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: "At least one field is required for update",
  });

export const leadIdParamSchema = z.object({
  id: z.string().trim().min(1, "Lead id is required"),
});

export const listLeadsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  status: z.enum(LEAD_STATUSES).optional(),
  source: z.enum(LEAD_SOURCES).optional(),
  search: z.string().trim().min(1).optional(),
  sort: z.enum(["latest", "oldest"]).optional(),
});

