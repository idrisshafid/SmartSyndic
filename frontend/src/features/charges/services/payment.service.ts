import api from "@/config/api";
import type { payment , createpaymentinput} from "../types/payment.type";

// ─── POST /payments/ ──────────────────────────────────────────────────────
// Validates a payment and updates the associated charge status
export const validatePayment = async (
  data: createpaymentinput): Promise<{ payment: payment; chargeUpdated: boolean }> => {
  const response = await api.post("/payment", data);
  return response.data.data;
};

// ─── GET /payments/charge/:chargeId ──────────────────────────────────────
export const getPaymentByCharge = async (chargeId: string): Promise<payment> => {
  const response = await api.get(`/payment/charge/${chargeId}`);
  return response.data.data;
};

// ─── GET /payments/owner/:ownerId ────────────────────────────────────────
export const getPaymentHistoryForOwner = async (
  ownerId: string
): Promise<payment[]> => {
  const response = await api.get(`/payment/owner/${ownerId}`);
  return response.data.data;
};