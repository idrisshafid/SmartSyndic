import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getResidences,
  getPublicResidences,
  getResidence,
  createResidence,
  updateResidence,
  deleteResidence,
} from "../services/residence.service";

import type {
  ApiResponse,
  PaginatedResidences,
  Residence,
  ResidenceFormValues,
  UpdateResidenceInput,
} from "../types/residence.types";

import { useAuthStore } from "@/stores/auth.store";

// ======================================
// GET ALL RESIDENCES (syndic dashboard)
// Response shape: { success, message, data: { residences, total, page, limit } }
// ======================================
export const useResidences = () => {
  return useQuery<ApiResponse<PaginatedResidences>>({
    queryKey: ["residences"],
    queryFn: getResidences,
  });
};

// ======================================
// GET ALL RESIDENCES (public listing)
// Assumed to follow the same paginated shape as GET /residence —
// confirm with Postman and adjust if /residence/public differs.
// ======================================
export const usePublicResidences = () => {
  return useQuery<ApiResponse<PaginatedResidences>>({
    queryKey: ["residences-public"],
    queryFn: getPublicResidences,
  });
};

// ======================================
// GET ONE RESIDENCE
// ======================================
export const useResidence = (id: string) => {
  return useQuery<ApiResponse<Residence>>({
    queryKey: ["residence", id],
    queryFn: () => getResidence(id),
    enabled: !!id,
  });
};

// ======================================
// CREATE RESIDENCE
// syndic_id is pulled from the authenticated user, never from the form.
// ======================================
export const useCreateResidence = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation<ApiResponse<Residence>, Error, ResidenceFormValues>({
    mutationFn: (data) => {
      if (!user) {
        return Promise.reject(
          new Error("You must be signed in to create a residence.")
        );
      }

      return createResidence({ ...data, syndic_id: user.id });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["residences"] });
      queryClient.invalidateQueries({ queryKey: ["residences-public"] });
    },
  });
};

// ======================================
// UPDATE RESIDENCE
// ======================================
export const useUpdateResidence = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Residence>,
    Error,
    { id: string; data: UpdateResidenceInput }
  >({
    mutationFn: ({ id, data }) => updateResidence(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["residences"] });
      queryClient.invalidateQueries({ queryKey: ["residences-public"] });
      queryClient.invalidateQueries({
        queryKey: ["residence", variables.id],
      });
    },
  });
};

// ======================================
// DELETE RESIDENCE
// ======================================
export const useDeleteResidence = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, Error, string>({
    mutationFn: (id) => deleteResidence(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["residences"] });
      queryClient.invalidateQueries({ queryKey: ["residences-public"] });
    },
  });
};