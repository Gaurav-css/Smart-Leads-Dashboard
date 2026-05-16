export type LeadStatus = "new" | "contacted" | "qualified" | "lost";
export type LeadSource = "website" | "instagram" | "referral";
export type LeadSort = "latest" | "oldest";

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadCreatePayload {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
}

export interface LeadUpdatePayload {
  name?: string;
  email?: string;
  status?: LeadStatus;
  source?: LeadSource;
}

export interface LeadQuery {
  page: number;
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: LeadSort;
}

