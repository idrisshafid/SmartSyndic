import api from "@/config/api";
import type {
  Owner,
  CreateOwnerInput,
  Apartment,
  ApiResponse,
} from "../types/owner.types";

// ========================================
// OWNERS
// ========================================

// Get all owners
export const getOwners = async (): Promise<ApiResponse<Owner[]>> => {
  const response = await api.get("/owner");
  return response.data;
};

// Get owner by id
export const getOwnerById = async (
  id: string
): Promise<ApiResponse<Owner>> => {
  const response = await api.get(`/owner/${id}`);
  return response.data;
};

// Create owner
export const createOwner = async (
  data: CreateOwnerInput
): Promise<ApiResponse<Owner>> => {
  const response = await api.post("/owner", data);
  return response.data;
};

// ========================================
// OWNER APARTMENTS
// ========================================

// Assign apartment to owner
export const assignApartment = async (
  ownerId: string,
  apartmentId: string
): Promise<ApiResponse<Owner>> => {
  const response = await api.post(
    `/owner/${ownerId}/apartment/${apartmentId}`
  );

  return response.data;
};

// Get apartments of one owner
export const getOwnerApartments = async (
  ownerId: string
): Promise<ApiResponse<Apartment[]>> => {
  const response = await api.get(`/owner/assign/${ownerId}`);
  return response.data;
};

// Remove apartment from owner
export const unassignApartment = async (ownerId: string, apartmentId: string) => {
  const response = await api.delete(`/owner/${ownerId}/apartments/${apartmentId}`);
  return response.data;
};