import { z } from "zod";
import { USER_ROLES } from "../users/user.types";

export const registerBodySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.email("Enter a valid email").transform((value) => value.toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(USER_ROLES).optional().default("sales"),
  adminKey: z.string().optional(),
});

export const loginBodySchema = z.object({
  email: z.email("Enter a valid email").transform((value) => value.toLowerCase()),
  password: z.string().min(1, "Password is required"),
});

