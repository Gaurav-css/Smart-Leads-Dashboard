import { ApiResponse, PaginationMeta } from "../types/api";
import { Lead, LeadCreatePayload, LeadQuery, LeadUpdatePayload } from "../types/leads";
import { http } from "./http";

interface ListLeadsResult {
  records: Lead[];
  meta: PaginationMeta;
}

const toQueryParams = (query: LeadQuery): Record<string, string | number> => {
  const params: Record<string, string | number> = { page: query.page };

  if (query.status) {
    params.status = query.status;
  }
  if (query.source) {
    params.source = query.source;
  }
  if (query.search) {
    params.search = query.search;
  }
  if (query.sort) {
    params.sort = query.sort;
  }

  return params;
};

export const leadsService = {
  list: async (query: LeadQuery): Promise<ListLeadsResult> => {
    const response = await http.get<ApiResponse<Lead[]>>("/leads", {
      params: toQueryParams(query),
    });
    const fallbackMeta: PaginationMeta = {
      total: response.data.data.length,
      page: query.page,
      pages: 1,
      limit: 10,
    };

    return {
      records: response.data.data,
      meta: response.data.meta ?? fallbackMeta,
    };
  },

  getById: async (id: string): Promise<Lead> => {
    const response = await http.get<ApiResponse<Lead>>(`/leads/${id}`);
    return response.data.data;
  },

  create: async (payload: LeadCreatePayload): Promise<Lead> => {
    const response = await http.post<ApiResponse<Lead>>("/leads", payload);
    return response.data.data;
  },

  update: async (id: string, payload: LeadUpdatePayload): Promise<Lead> => {
    const response = await http.patch<ApiResponse<Lead>>(`/leads/${id}`, payload);
    return response.data.data;
  },

  remove: async (id: string): Promise<Lead> => {
    const response = await http.delete<ApiResponse<Lead>>(`/leads/${id}`);
    return response.data.data;
  },

  exportCsv: async (query: LeadQuery): Promise<Blob> => {
    const response = await http.get("/leads/export/csv", {
      params: toQueryParams(query),
      responseType: "blob",
    });
    return response.data as Blob;
  },
};

