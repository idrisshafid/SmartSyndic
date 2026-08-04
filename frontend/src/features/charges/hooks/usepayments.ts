import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as paymentService from "../services/payment.service";
import type { createpaymentinput } from "../types/payment.type";
import { useAuthStore } from "@/stores/auth.store";

// ─── Queries ──────────────────────────────────────────────────────────────

export const usePaymentByCharge = (chargeId: string) => {
  const user = useAuthStore((state) => state.user);
  const isSyndic = user?.role === "syndic";

  return useQuery({
    queryKey: ["payment", "charge", chargeId],
    queryFn: () => paymentService.getPaymentByCharge(chargeId),
    // Only syndic can view payment details (or admin)
    enabled: !!chargeId && isSyndic,
  });
};

export const usePaymentHistoryForOwner = (ownerId: string) => {
  const user = useAuthStore((state) => state.user);
  const isOwner = user?.role === "owner";
  const isSyndic = user?.role === "syndic";

  return useQuery({
    queryKey: ["payments", "owner", ownerId],
    queryFn: () => paymentService.getPaymentHistoryForOwner(ownerId),
    enabled: !!ownerId && (isOwner || isSyndic),
  });
};

// ─── Mutations (Syndic only) ─────────────────────────────────────────────

export const useValidatePayment = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const isSyndic = user?.role === "syndic";

  return useMutation({
    mutationFn: (data: createpaymentinput) => paymentService.validatePayment(data),
    onMutate: () => {
      if (!isSyndic) {
        throw new Error("Seul un syndic peut valider un paiement.");
      }
    },
    onSuccess: (_, variables) => {
      if (variables.charge_id) {
        queryClient.invalidateQueries({
          queryKey: ["payment", "charge", variables.charge_id],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["charges"] });
      queryClient.invalidateQueries({ queryKey: ["payments", "owner"] });
    },
  });
};