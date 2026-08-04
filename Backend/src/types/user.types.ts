export type UserRole = "admin" | "syndic" | "owner";

export interface User {
  id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  country?: string;
  role: UserRole;
  is_active: boolean;
  avatar_url?: string;
  reset_token?: string;
  reset_token_expires?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface AuthPayload {
  id: string;
  email: string;
  role: UserRole;
}