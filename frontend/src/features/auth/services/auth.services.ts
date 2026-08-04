import api from "@/config/api";
import type { LoginData , RegisterData , ForgotpasswordData  } from "../types/auth.types";

// ===============================
// LOGIN
// POST /api/auth/login
// ===============================

export const login = async ( data : LoginData ) => {

  const response = await api.post("/auth/login",data  );

  return response.data ;  };

// ===============================
// REGISTER
// POST /api/auth/register
// ===============================

export const register = async ( data: RegisterData    ) => {

  const response = await api.post("/auth/register",data);
  
  return response.data;
};

// ===============================
// LOGOUT
// POST /api/auth/logout
// ===============================

export const logout = async () => {

  const response = await api.post("/auth/logout");

  return response.data;
};


// ===============================
// ME
// GET /api/auth/me
// ===============================

export const me = async () => {

  const response = await api.get("/auth/me");

  return response.data;    };

// ===============================
//  Forgot Password
// POST /api/auth/forgot-password
// ===============================

export const Forgotpassword = async (data : ForgotpasswordData ) => {

  const response = await api.post("/auth/forgot-password" , data);

  return response.data;    };

  // ===============================
//  /reset-password
// POST /api/auth/reset-password
// ===============================

export const Resetpassword = async (data: { token: string; newPassword: string }) => {
  const response = await api.post("/auth/reset-password/", data);
  return response.data;
};


  export const getUserById = async (id: string) => {
  const response = await api.get(`/auth/${id}`);
  return response.data.data;
};