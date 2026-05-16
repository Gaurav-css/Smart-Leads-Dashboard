import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { authorizeRoles } from "../../middleware/role.middleware";
import {
  createLeadController,
  deleteLeadController,
  exportLeadsCsvController,
  getLeadController,
  listLeadsController,
  updateLeadController,
} from "./lead.controller";

export const leadRoutes = Router();

leadRoutes.use(authenticate);
leadRoutes.post("/", createLeadController);
leadRoutes.get("/", listLeadsController);
leadRoutes.get("/export/csv", exportLeadsCsvController);
leadRoutes.get("/:id", getLeadController);
leadRoutes.patch("/:id", updateLeadController);
leadRoutes.delete("/:id", authorizeRoles("admin"), deleteLeadController);
