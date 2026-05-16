import { ApiResponse } from "../types/api";
import { AuthSuccessData, AuthUser, LoginPayload, RegisterPayload } from "../types/auth";
import { http } from "./http";

export const authService = {
  register: async (payload: RegisterPayload): Promise<AuthSuccessData> => {
    const response = await http.post<ApiResponse<AuthSuccessData>>("/auth/register", payload);
    return response.data.data;
  },

  login: async (payload: LoginPayload): Promise<AuthSuccessData> => {
    const response = await http.post<ApiResponse<AuthSuccessData>>("/auth/login", payload);
    return response.data.data;
  },

  getMe: async (): Promise<AuthUser> => {
    const response = await http.get<ApiResponse<AuthUser>>("/auth/me");
    return response.data.data;
  },
};

