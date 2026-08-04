import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as incidentService from "../services/incident.service";
import type {
  Incident,
  CreateIncidentInput,
  UpdateIncidentStatusInput,
  IncidentFilters,
} from "../types/incident.types";

// ─── Queries ──────────────────────────────────────────────────────────────

export const useIncidents = (filters?: IncidentFilters) => {
  return useQuery<Incident[]>({
    queryKey: ["incidents", filters],
    queryFn: () => incidentService.getIncidents(filters),
  });
};

export const useIncident = (id: string) => {
  return useQuery<Incident>({
    queryKey: ["incident", id],
    queryFn: () => incidentService.getIncidentById(id),
    enabled: !!id,
  });
};

// ─── Mutations ─────────────────────────────────────────────────────────────

// ─── Delete incident ──────────────────────────────────────────────────────
export const useDeleteIncident = () => {
  const queryClient = useQueryClient();
  return useMutation<Incident, Error, string>({
    mutationFn: (id: string) => incidentService.deleteIncident(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
    },
  });
};

export const useCreateIncident = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateIncidentInput) =>
      incidentService.createIncident(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
    },
  });
};

// ✅ NEW: Update incident
export const useUpdateIncident = () => {
  const queryClient = useQueryClient();
  return useMutation<Incident, Error, { id: string; data: CreateIncidentInput }>({
    mutationFn: ({ id, data }) => incidentService.updateIncident(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["incident", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
    },
  });
};

export const useUpdateIncidentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateIncidentStatusInput }) =>
      incidentService.updateIncidentStatus(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["incident", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
      queryClient.invalidateQueries({ queryKey: ["incident-history", variables.id] });
    },
  });
};