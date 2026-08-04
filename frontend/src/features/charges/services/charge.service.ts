import api from "@/config/api";
import type {
  Charge,
  CreateChargeInput,
} from "../types/charge.type";

// ─── GET /charges/owner/:ownerId ──────────────────────────────────────────
export const getChargesForOwner = async (
  ownerId: string
): Promise<Charge[] | null> => {
  const response = await api.get(`/charges/owner/${ownerId}`);
  return response.data.data; 
}; 

// ─── GET /charges/syndic/:syndicId ────────────────────────────────────────
export const getChargesForSyndic = async (
  syndicId: string
): Promise<Charge[]> => {
  const response = await api.get(`/charges/syndic/${syndicId}`);
  return response.data.data;
};

// ─── GET /charges/:id ──────────────────────────────────────────────────────
export const getChargeById = async (id: string): Promise<Charge| null> => {
  const response = await api.get(`/charges/${id}`);
  return response.data.data;
};

// ─── POST /charges/ ────────────────────────────────────────────────────────
export const createCharge = async (
  data: CreateChargeInput
): Promise<Charge> => {
  const response = await api.post("/charges", data);
  return response.data.data;
};

// ─── PATCH /charges/:id/validate ──────────────────────────────────────────
export const validateCharge = async (id: string ,): Promise<Charge | null> => {
  const response = await api.patch(`/charges/${id}/validate`);
  return response.data.data;
};

// ─── PATCH /charges/mark-overdue ──────────────────────────────────────────
export const markOverdueCharges = async (): Promise<{ count: number }> => {
  const response = await api.patch("/charges/mark-overdue");
  return response.data.data;
};

export const deleteCharge = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete(`/charges/${id}`);
  return response.data.data;
};