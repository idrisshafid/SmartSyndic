import { UserRole } from "./user.types";

export interface RegisterInput {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone ?: number;
  role: UserRole;
  country ?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}