import { useQuery , useMutation , useQueryClient ,} from "@tanstack/react-query";

import * as ownerService from "../services/owner.service";

// ======================================
// Owners
// ======================================

export const useOwners = () => {
  return useQuery({
    queryKey: ["owners"],
    queryFn: ownerService.getOwners,
  });
};

export const useOwner = (id: string) => {
  return useQuery({
    queryKey: ["owner", id],
    queryFn: () => ownerService.getOwnerById(id),
    enabled: !!id,
  });
};

export const useCreateOwner = () => {
  const queryClient = useQueryClient();

  return useMutation({ mutationFn: ownerService.createOwner,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["owners"],
      });
    },
  });
};

// ======================================
// Owner Apartments
// ======================================

export const useOwnerApartments = (ownerId: string) => {
  return useQuery({
    queryKey: ["owner-apartments", ownerId],
    queryFn: () => ownerService.getOwnerApartments(ownerId),
    enabled: !!ownerId,
  });
};

export const useAssignApartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ownerId,
      apartmentId,
    }: {
      ownerId: string;
      apartmentId: string;
    }) =>
      ownerService.assignApartment(ownerId, apartmentId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["owner-apartments", variables.ownerId],
      });

      queryClient.invalidateQueries({
        queryKey: ["owners"],
      });
    },
  });
};

export const useUnassignApartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ownerId, apartmentId }: { ownerId: string; apartmentId: string }) =>
      ownerService.unassignApartment(ownerId, apartmentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["owner-apartments", variables.ownerId] });
      queryClient.invalidateQueries({ queryKey: ["owners"] });
    },
  });
};