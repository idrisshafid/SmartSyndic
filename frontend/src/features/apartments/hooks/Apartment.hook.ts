import { useQuery, useMutation, useQueryClient,} from
 "@tanstack/react-query";

import {
  getApartmentsByResidence,
  getApartmentById,
  searchApartments,
  createApartment,
  editApartment,
  deleteApartment,getAllApartment
} from "../services/apartments.service";

import type {
  Apartment,
  ApiResponse,
  CreateApartmentInput,
  DeleteResponse,
  UpdateApartmentInput,
  searchApartmentInput,
} from "../types/apartments.types";
//===========================================
//GET ALL APARTMENTS
//===========================================
export const useAllApartments = () => {
  return useQuery<ApiResponse<Apartment[]>>({
    queryKey: ["apartments"],
    queryFn: () => getAllApartment(),
   
  });
};

// ======================================
// GET APARTMENTS OF A RESIDENCE
// Meant to be called from ResidenceDetailPage / SyndicResidenceDetailPage
// to fill the "Apartments" section — not a standalone apartments list page.
// ======================================
export const useApartmentsByResidence = (residenceId: string) => {
  return useQuery<ApiResponse<Apartment[]>>({
    queryKey: ["apartments", "by-residence", residenceId],
    queryFn: () => getApartmentsByResidence(residenceId),
    enabled: !!residenceId,
  });
};

// ======================================
// GET ONE APARTMENT
// ======================================
export const useApartment = (id: string) => {
  return useQuery<ApiResponse<Apartment>>({
    queryKey: ["apartment", id],
    queryFn: () => getApartmentById(id),
    enabled: !!id,
  });
};

// ======================================
// SEARCH APARTMENTS
// Query re-runs whenever `filters` changes. Pass `enabled: false` until
// the user actually submits a search if you don't want it firing on
// every keystroke.
// ======================================
export const useSearchApartments = (
  filters: searchApartmentInput,
  enabled = true
) => {
  return useQuery<ApiResponse<Apartment[]>>({
    queryKey: ["apartments", "search", filters],
    queryFn: () => searchApartments(filters),
    enabled,
  });
};

// ======================================
// CREATE APARTMENT
// ======================================
export const useCreateApartment = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Apartment>, Error, CreateApartmentInput>({
    mutationFn: (data) => createApartment(data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["apartments", "by-residence", variables.residence_id],
      });
    },
  });
};

// ======================================
// UPDATE APARTMENT
// ======================================
export const useUpdateApartment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Apartment>,
    Error,
    { id: string; residenceId: string; data: UpdateApartmentInput }
  >({
    mutationFn: ({ id, data }) => editApartment(data, id),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["apartments", "by-residence", variables.residenceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["apartment", variables.id],
      });
    },
  });
};

// ======================================
// DELETE APARTMENT
// ======================================
export const useDeleteApartment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    DeleteResponse,
    Error,
    { id: string; residenceId: string }
  >({
    mutationFn: ({ id }) => deleteApartment(id),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["apartments", "by-residence", variables.residenceId],
      });
    },
  });
};