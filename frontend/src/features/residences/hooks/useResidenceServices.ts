import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getResidenceServices,
  addResidenceService,
  deleteResidenceService,
} from "../services/residence.service";

import type {
  ApiResponse,
  CreateResidenceServiceInput,
  ResidenceService,
} from "../types/residence.types";

// =====================================
// GET SERVICES OF A RESIDENCE
// =====================================
export const useResidenceServices = (id: string) => {
  return useQuery<ApiResponse<ResidenceService[]>>({
    queryKey: ["residence-services", id],
    queryFn: () => getResidenceServices(id),
    enabled: !!id,
  });
};

// =====================================
// ADD SERVICE
// =====================================
export const useAddResidenceService = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<ResidenceService>,
    Error,
    { id: string; data: CreateResidenceServiceInput }
  >({
    mutationFn: ({ id, data }) => addResidenceService(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["residence-services", variables.id],
      });
    },
  });
};

// =====================================
// DELETE SERVICE
// =====================================
export const useDeleteResidenceService = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<null>,
    Error,
    { id: string; serviceId: string }
  >({
    mutationFn: ({ serviceId }) => deleteResidenceService( serviceId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["residence-services", variables.id],
      });
    },
  });
};