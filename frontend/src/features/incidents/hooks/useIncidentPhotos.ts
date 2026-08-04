import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as incidentService from "../services/incident.service";
import type { IncidentPhoto } from "../types/incident.types";

export const useIncidentPhotos = (incidentId: string) => {
  return useQuery<IncidentPhoto[]>({
    queryKey: ["incident-photos", incidentId],
    queryFn: () => incidentService.getIncidentPhotos(incidentId),
    enabled: !!incidentId,
  });
};

export const useUploadIncidentPhoto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ incidentId, file }: { incidentId: string; file: File }) =>
      incidentService.uploadIncidentPhoto(incidentId, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["incident-photos", variables.incidentId],
        
      });
    },
  });
};

export const useUpdateIncidentPhoto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ photoId, file }: { photoId: string; file: File }) =>
      incidentService.updateIncidentPhoto(photoId, file),
    onSuccess: () => {
      // Invalidate all incident photo lists (we don't know which incident ID)
      queryClient.invalidateQueries({ queryKey: ["incident-photos"] });
    },
  });
};

export const useDeleteIncidentPhoto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (photoId: string) => incidentService.deleteIncidentPhoto(photoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incident-photos"] });
    },
  });
};