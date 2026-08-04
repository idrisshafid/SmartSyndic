import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as incidentService from "../services/incident.service";
import type { IncidentComment } from "../types/incident.types";

export const useIncidentComments = (incidentId: string) => {
  return useQuery<IncidentComment[]>({
    queryKey: ["incident-comments", incidentId],
    queryFn: () => incidentService.getComments(incidentId),
    enabled: !!incidentId,
  });
};

export const useAddIncidentComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ incidentId, comment }: { incidentId: string; comment: string }) =>
      incidentService.addComment(incidentId, comment),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["incident-comments", variables.incidentId],
      });
    },
  });
};