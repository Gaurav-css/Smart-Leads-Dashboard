export type UserRole = "admin" | "sales";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthSuccessData {
  token: string;
  user: AuthUser;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  adminKey?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

