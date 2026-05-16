import { ZodError } from "zod";

export const getValidationMessage = (error: ZodError): string =>
  error.issues[0]?.message ?? "Invalid request data";

