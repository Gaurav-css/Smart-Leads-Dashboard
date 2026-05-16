import { stringify } from "csv-stringify/sync";
import { Types } from "mongoose";
import { AppError } from "../../utils/app-error";
import { AuthUser } from "../users/user.types";
import { ILead, LeadModel } from "./lead.model";
import { LeadListQuery } from "./lead.types";

const PAGE_SIZE = 10;

interface LeadPayload {
  name: string;
  email: string;
  status: ILead["status"];
  source: ILead["source"];
}

interface UpdateLeadPayload {
  name?: string | undefined;
  email?: string | undefined;
  status?: ILead["status"] | undefined;
  source?: ILead["source"] | undefined;
}

interface LeadFilter {
  _id?: string;
  status?: ILead["status"];
  source?: ILead["source"];
  createdBy?: Types.ObjectId;
  $or?: Array<{ name: RegExp } | { email: RegExp }>;
}

const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildAccessFilter = (user: AuthUser): LeadFilter => {
  if (user.role === "admin") {
    return {};
  }

  return { createdBy: new Types.ObjectId(user.userId) };
};

const buildListFilter = (query: LeadListQuery, user: AuthUser): LeadFilter => {
  const baseFilter = buildAccessFilter(user);

  if (query.status) {
    baseFilter.status = query.status;
  }

  if (query.source) {
    baseFilter.source = query.source;
  }

  if (query.search) {
    const regex = new RegExp(escapeRegex(query.search), "i");
    baseFilter.$or = [{ name: regex }, { email: regex }];
  }

  return baseFilter;
};

export const createLead = async (payload: LeadPayload, user: AuthUser) => {
  const createdLead = await LeadModel.create({
    ...payload,
    createdBy: user.userId,
  });

  return createdLead;
};

export const listLeads = async (query: LeadListQuery, user: AuthUser) => {
  const filter = buildListFilter(query, user);
  const page = query.page ?? 1;
  const skip = (page - 1) * PAGE_SIZE;
  const sortDirection = query.sort === "oldest" ? 1 : -1;

  const [records, total] = await Promise.all([
    LeadModel.find(filter)
      .sort({ createdAt: sortDirection })
      .skip(skip)
      .limit(PAGE_SIZE)
      .lean(),
    LeadModel.countDocuments(filter),
  ]);

  return {
    records,
    meta: {
      total,
      page,
      pages: Math.max(Math.ceil(total / PAGE_SIZE), 1),
      limit: PAGE_SIZE,
    },
  };
};

export const getLeadById = async (id: string, user: AuthUser) => {
  const filter: LeadFilter = {
    _id: id,
    ...buildAccessFilter(user),
  };
  const lead = await LeadModel.findOne(filter).lean();

  if (!lead) {
    throw new AppError(404, "Lead not found");
  }

  return lead;
};

export const updateLeadById = async (id: string, payload: UpdateLeadPayload, user: AuthUser) => {
  const filter: LeadFilter = {
    _id: id,
    ...buildAccessFilter(user),
  };
  const updatedLead = await LeadModel.findOneAndUpdate(filter, payload, {
    new: true,
    runValidators: true,
  }).lean();

  if (!updatedLead) {
    throw new AppError(404, "Lead not found");
  }

  return updatedLead;
};

export const deleteLeadById = async (id: string, user: AuthUser) => {
  const filter: LeadFilter = {
    _id: id,
    ...buildAccessFilter(user),
  };
  const deletedLead = await LeadModel.findOneAndDelete(filter).lean();

  if (!deletedLead) {
    throw new AppError(404, "Lead not found");
  }

  return deletedLead;
};

export const exportLeadsCsv = async (query: LeadListQuery, user: AuthUser): Promise<string> => {
  const filter = buildListFilter(query, user);
  const sortDirection = query.sort === "oldest" ? 1 : -1;

  const leads = await LeadModel.find(filter).sort({ createdAt: sortDirection }).lean();

  const rows = leads.map((lead) => ({
    name: lead.name,
    email: lead.email,
    status: lead.status,
    source: lead.source,
    createdAt: new Date(lead.createdAt).toISOString(),
  }));

  return stringify(rows, {
    header: true,
    columns: ["name", "email", "status", "source", "createdAt"],
  });
};
