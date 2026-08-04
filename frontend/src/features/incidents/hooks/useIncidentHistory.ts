import { useQuery } from "@tanstack/react-query";
import * as incidentService from "../services/incident.service";
import type { IncidentHistory } from "../types/incident.types";

export const useIncidentHistory = (incidentId: string) => {
  return useQuery<IncidentHistory[]>({
    queryKey: ["incident-history", incidentId],
    queryFn: () => incidentService.getIncidentHistory(incidentId),
    enabled: !!incidentId,
  });
};