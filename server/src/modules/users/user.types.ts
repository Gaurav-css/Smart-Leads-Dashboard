export const USER_ROLES = ["admin", "sales"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export interface AuthUser {
  userId: string;
  role: UserRole;
  email: string;
}

