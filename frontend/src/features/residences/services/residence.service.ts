import api from "@/config/api";

import type {
  ApiResponse,
  CreateResidenceInput,
  CreateResidenceServiceInput,
  PaginatedResidences,
  Residence,
  ResidencePhoto,
  ResidenceService,
  UpdateResidenceInput,
} from "../types/residence.types";

// =================================
// PUBLIC RESIDENCES
// GET /residence/public
// =================================
export const getPublicResidences = async (): Promise<
  ApiResponse<PaginatedResidences>
> => {
  const response = await api.get("/residence/public");
  return response.data;
};

// =================================
// GET ALL RESIDENCES OF CURRENT SYNDIC
// GET /residence
// =================================
export const getResidences = async (): Promise<
  ApiResponse<PaginatedResidences>
> => {
  const response = await api.get("/residence");
  return response.data;
};

// =================================
// GET ONE RESIDENCE
// GET /residence/:id
// =================================
export const getResidence = async (
  id: string
): Promise<ApiResponse<Residence>> => {
  const response = await api.get(`/residence/${id}`);
  return response.data;
};

// =================================
// CREATE
// POST /residence
// =================================
export const createResidence = async (
  data: CreateResidenceInput
): Promise<ApiResponse<Residence>> => {
  const response = await api.post("/residence", data);
  return response.data;
};

// =================================
// UPDATE
// PUT /residence/:id
// =================================
export const updateResidence = async (
  id: string,
  data: UpdateResidenceInput
): Promise<ApiResponse<Residence>> => {
  const response = await api.put(`/residence/${id}`, data);
  return response.data;
};

// =================================
// DELETE
// DELETE /residence/:id
// =================================
export const deleteResidence = async (
  id: string
): Promise<ApiResponse<null>> => {
  const response = await api.delete(`/residence/${id}`);
  return response.data;
};

// =================================
// UPLOAD PHOTO
// POST /residence/:id/photos
// =================================
export const uploadResidencePhoto = async (
  id: string,
  formData: FormData
): Promise<ApiResponse<ResidencePhoto>> => {
  const response = await api.post(`/residence/${id}/photos`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// =================================
// GET PHOTOS
// GET /residence/:id/photos
// =================================
export const getResidencePhotos = async (
  id: string
): Promise<ApiResponse<ResidencePhoto[]>> => {
  const response = await api.get(`/residence/${id}/photos`);
  return response.data;
};

// =================================
// DELETE PHOTO
// DELETE /residence/:id/photos/:photoId
// =================================
export const deleteResidencePhoto = async (
  photoId: string 
): Promise<ApiResponse<null>> => {
  const response = await api.delete(`/residence/photos/${photoId}` )
  return response.data; 
};

// =================================
// GET SERVICES
// GET /residence/:id/services
// =================================
export const getResidenceServices = async (
  id: string
): Promise<ApiResponse<ResidenceService[]>> => {
  const response = await api.get(`/residence/${id}/services`);
  return response.data;
};

// =================================
// ADD SERVICE
// POST /residence/:id/services
// =================================
export const addResidenceService = async (
  id: string,
  data: CreateResidenceServiceInput
): Promise<ApiResponse<ResidenceService>> => {
  const response = await api.post(`/residence/${id}/services`, data);
  return response.data;
};

// =================================
// DELETE SERVICE
// DELETE /residence/:id/services/:serviceId
// =================================
export const deleteResidenceService = async (
  serviceId: string
): Promise<ApiResponse<null>> => {
  const response = await api.delete(`/residence/services/${serviceId}`);
  return response.data;
};