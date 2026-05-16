import { HydratedDocument, Schema, Types, model } from "mongoose";
import { LEAD_SOURCES, LEAD_STATUSES, LeadSource, LeadStatus } from "./lead.types";

export interface ILead {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type LeadDocument = HydratedDocument<ILead>;

const leadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: LEAD_STATUSES,
      required: true,
      default: "new",
    },
    source: {
      type: String,
      enum: LEAD_SOURCES,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const LeadModel = model<ILead>("Lead", leadSchema);

