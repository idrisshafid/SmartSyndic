import api from "@/config/api";

import type {
  Apartment,
  ApiResponse,
  CreateApartmentInput,
  UpdateApartmentInput,
  searchApartmentInput,
  ApartmentPhoto,
  Service_Equipment,
  DeleteResponse,
} from "../types/apartments.types";

// =================================================
// APARTMENTS
// =================================================
//GET all apartments
export const getAllApartment = async ()
: Promise<ApiResponse<Apartment[]>> => {
  const response = await api.get(`/apartment/`);
  return response.data;
};

// GET all apartments of one residence
export const getApartmentsByResidence = async (
  residenceId: string
): Promise<ApiResponse<Apartment[]>> => {
  const response = await api.get(`/apartment/residence/${residenceId}`);
  return response.data;
};

export const getApartmentById = async (
  id: string
): Promise<ApiResponse<Apartment>> => {
  const response = await api.get(`/apartment/${id}`);
  return response.data;
};

export const searchApartments = async (
  data: searchApartmentInput
): Promise<ApiResponse<Apartment[]>> => {
  const response = await api.get("/apartment/search", { params: data });
  return response.data;
};

export const createApartment = async (
  data: CreateApartmentInput
): Promise<ApiResponse<Apartment>> => {
  const response = await api.post("/apartment", data);
  return response.data;
};

export const editApartment = async (
  data: UpdateApartmentInput,
  id: string
): Promise<ApiResponse<Apartment>> => {
  const response = await api.put(`/apartment/${id}`, data);
  return response.data;
};

export const deleteApartment = async (
  id: string
): Promise<DeleteResponse> => {
  const response = await api.delete(`/apartment/${id}`);
  return response.data;
};

// =================================================
// PHOTOS
// =================================================

export const createApartmentPhoto = async (
  id: string,
  formData: FormData
): Promise<ApiResponse<ApartmentPhoto>> => {
  const response = await api.post(`/apartment/${id}/photos`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getApartmentPhotos = async (
  id: string
): Promise<ApiResponse<ApartmentPhoto[]>> => {
  const response = await api.get(`/apartment/${id}/photos`);
  return response.data;
};

export const deleteApartmentPhoto = async (

  photoId: string
)=> {
  const response = await api.delete(`/apartment/photos/${photoId}`);
  return response.data.message;
};

export const setPrimaryApartmentPhoto = async (
  photoId: string
): Promise<ApiResponse<ApartmentPhoto>> => {
  const response = await api.put(`/apartment/photos/${photoId}/primary`);
  return response.data;
};

// =================================================
// EQUIPMENT / SERVICES
// =================================================

export const createApartmentService = async (
  id: string,
  data: Service_Equipment
): Promise<ApiResponse<Service_Equipment>> => {
  const response = await api.post(`/apartment/${id}/equipments`, data);
  return response.data;
};

export const getApartmentServices = async (
  id: string
): Promise<ApiResponse<Service_Equipment[]>> => {
  const response = await api.get(`/apartment/${id}/equipments`);
  return response.data;
};

export const deleteApartmentService = async (
  equipmentId: string
): Promise<DeleteResponse> => {
  const response = await api.delete(`/apartment/equipments/${equipmentId}`);
  return response.data;
};