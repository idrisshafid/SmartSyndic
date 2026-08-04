import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getApartmentServices,
  createApartmentService,
  deleteApartmentService,
} from "../services/apartments.service";

import type {
  ApiResponse,
  DeleteResponse,
  Service_Equipment,
} from "../types/apartments.types";

// =====================================
// GET EQUIPMENT OF AN APARTMENT
// =====================================
export const useApartmentServices = (apartmentId: string) => {
  return useQuery<ApiResponse<Service_Equipment[]>>({
    queryKey: ["apartment-services", apartmentId],
    queryFn: () => getApartmentServices(apartmentId),
    enabled: !!apartmentId,
  });
};

// =====================================
// ADD EQUIPMENT
// =====================================
export const useAddApartmentService = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Service_Equipment>,
    Error,
    { apartmentId: string; data: Service_Equipment }
  >({
    mutationFn: ({ apartmentId, data }) =>
      createApartmentService(apartmentId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["apartment-services", variables.apartmentId],
      });
    },
  });
};

// =====================================
// DELETE EQUIPMENT
// Same shape as residence services: the API only takes the equipment's
// own id, so `apartmentId` is passed through purely for invalidation.
// =====================================
export const useDeleteApartmentService = () => {
  const queryClient = useQueryClient();

  return useMutation<
    DeleteResponse,
    Error,
    { apartmentId: string; equipmentId: string }
  >({
    mutationFn: ({ equipmentId }) => deleteApartmentService(equipmentId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["apartment-services", variables.apartmentId],
      });
    },
  });
};