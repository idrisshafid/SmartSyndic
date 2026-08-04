import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as chargeService from "../services/charge.service";
import type { CreateChargeInput, PaymentStatus } from "../types/charge.type";
import { useAuthStore } from "@/stores/auth.store";

// ─── Status badge configuration ──────────────────────────────────────────
export const STATUS_CONFIG: Record<PaymentStatus, { label: string; color: string }> = {
  pending: { label: "En attente", color: "bg-orange-100 text-orange-700" },
  validated: { label: "Payée", color: "bg-green-100 text-green-700" },
  overdue: { label: "En retard", color: "bg-red-100 text-red-700" },
};

// ─── Date formatter (French) ─────────────────────────────────────────────
export const formatDate = (date: Date | string): string => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
};

// ─── Utility: get status badge for a charge ──────────────────────────────
export const getChargeStatusBadge = (status: PaymentStatus) => {
  return STATUS_CONFIG[status] || { label: status, color: "bg-slate-100 text-slate-700" };
};

// ─── Queries ──────────────────────────────────────────────────────────────

export const useChargesForOwner = (ownerId: string) => {
  const user = useAuthStore((state) => state.user);
  const isOwner = user?.role === "owner";
  const isSyndic = user?.role === "syndic";

  return useQuery({
    queryKey: ["charges", "owner", ownerId],
    queryFn: () => chargeService.getChargesForOwner(ownerId),
    // Owner can see own charges; syndic can see any owner's charges (if needed)
    enabled: !!ownerId && (isOwner || isSyndic),
  });
};

export const useChargesForSyndic = (syndicId: string) => {
  const user = useAuthStore((state) => state.user);
  const isSyndic = user?.role === "syndic";

  return useQuery({
    queryKey: ["charges", "syndic", syndicId],
    queryFn: () => chargeService.getChargesForSyndic(syndicId),
    enabled: !!syndicId && isSyndic,
  });
};

export const useCharge = (id: string) => {
  return useQuery({
    queryKey: ["charge", id],
    queryFn: () => chargeService.getChargeById(id),
    enabled: !!id,
  });
};

// ─── Mutations (Syndic only) ─────────────────────────────────────────────

export const useCreateCharge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateChargeInput) => chargeService.createCharge(data),

    onMutate: () => {

    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["charges"] });
      if (variables.owner_id) {
        queryClient.invalidateQueries({ queryKey: ["charges", "owner", variables.owner_id] });
      }
      if (variables.syndic_id) {
        queryClient.invalidateQueries({ queryKey: ["charges", "syndic", variables.syndic_id] });
      }
    },
  });
};

export const useValidateCharge = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const isSyndic = user?.role === "syndic";

  return useMutation({
    mutationFn: (id: string) => chargeService.validateCharge(id),
    onMutate: () => {
      if (!isSyndic) {
        throw new Error("Seul un syndic peut valider une charge.");
      }
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["charge", id] });
      queryClient.invalidateQueries({ queryKey: ["charges"] });
    },
  });
};

export const useMarkOverdueCharges = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const isSyndic = user?.role === "syndic";

  return useMutation({
    mutationFn: () => chargeService.markOverdueCharges(),
    onMutate: () => {
      if (!isSyndic) {
        throw new Error("Seul un syndic peut marquer les charges en retard.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["charges"] });
    },
  });
};

export const useDeleteCharge = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const isSyndic = user?.role === "syndic";

  return useMutation({
    mutationFn: (id: string) => chargeService.deleteCharge(id),
    onMutate: () => {
      if (!isSyndic) {
        throw new Error("Seul un syndic peut supprimer une charge.");
      }
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["charges"] });
      queryClient.invalidateQueries({ queryKey: ["charge", id] });
    },
  });
};