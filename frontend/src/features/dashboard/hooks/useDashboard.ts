import { useQuery } from "@tanstack/react-query";

import {
  getAdminDashboard,
  getSyndicDashboard,
} from "../services/dashboard.service";

import { useAuthStore } from "@/stores/auth.store";

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: getAdminDashboard,
  });
};

export const useSyndicDashboard = () => {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ["syndic-dashboard", user?.id],
    queryFn: () => getSyndicDashboard(user!.id),
    enabled: !!user?.id,
  });
};