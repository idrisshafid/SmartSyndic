import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";

import { useValidatePayment } from "../hooks/usepayments";
import { useChargesForSyndic } from "@/features/charges/hooks/usecharges";
import { useAuthStore } from "@/stores/auth.store";
import { useOwners } from "@/features/owners/hooks/owner.hooks";
import { useAllApartments } from "@/features/apartments/hooks/Apartment.hook";

// ─── Zod schema ────────────────────────────────────────────────────────────
const createPaymentSchema = z.object({
  charge_id: z.string().min(1, "Veuillez sélectionner une charge"),
  payment_date: z.string().min(1, "Date de paiement requise"),
  payment_method: z.string().min(1, "Méthode de paiement requise"),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

type CreatePaymentFormData = z.infer<typeof createPaymentSchema>;

// ─── Helpers ────────────────────────────────────────────────────────────────
const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
};

const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export default function CreatePaymentPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const syndicId = user?.id || "";

  const [error, setError] = useState<string | null>(null);

  // ── Fetch pending charges ──
  const {
    data: charges,
    isLoading: chargesLoading,
    isError: chargesIsError,
    refetch: refetchCharges,
  } = useChargesForSyndic(syndicId);

  const pendingCharges = useMemo(() => {
    return (charges ?? []).filter((c) => c.status === "pending");
  }, [charges]);

  // ── Fetch owners and apartments for lookup ──
  const { data: ownersData, isLoading: ownersLoading } = useOwners();
  const { data: apartmentsData, isLoading: apartmentsLoading } = useAllApartments();

  const ownerMap = useMemo(() => {
    const map = new Map<string, string>();
    (ownersData?.data ?? []).forEach((owner) => {
      map.set(owner.id, `${owner.first_name} ${owner.last_name}`);
    });
    return map;
  }, [ownersData]);

  const apartmentMap = useMemo(() => {
    const map = new Map<string, string>();
    (apartmentsData?.data ?? []).forEach((apt) => {
      map.set(apt.id, apt.apartment_number);
    });
    return map;
  }, [apartmentsData]);

  // ── Form ──
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreatePaymentFormData>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: {
      payment_date: new Date().toISOString().split("T")[0],
      payment_method: "",
    },
  });

  const selectedChargeId = useWatch({
    control,
    name: "charge_id",
  });

  const selectedCharge = pendingCharges.find((c) => c.id === selectedChargeId);

  // ── Mutation ──
  const validatePayment = useValidatePayment();

  const onSubmit = async (data: CreatePaymentFormData) => {
    setError(null);
    try {
      await validatePayment.mutateAsync({
        charge_id: data.charge_id,
        validated_by: syndicId,
        payment_date: data.payment_date ? new Date(data.payment_date) : new Date(),
        payment_method: data.payment_method,
        reference: data.reference || undefined,
        notes: data.notes || undefined,
      });
      navigate(-1);
    }
     catch (err) {
      setError(
      err instanceof Error
      ? err.message
      : "Erreur lors de la validation du paiement."
     );
   }
  };

  // ── Loading states ──
  if (chargesLoading || ownersLoading || apartmentsLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-orange-500" />
      </div>
    );
  }

  if (chargesIsError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border py-16 text-center">
        <p>Erreur lors du chargement des charges.</p>
        <button
          onClick={() => refetchCharges()}
          className="mt-4 rounded-xl bg-orange-500 px-6 py-2 text-sm font-semibold text-white hover:bg-orange-600"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-2xl px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium transition"
        >
          <ArrowLeft size={16} />
          Retour
        </button>

        <div className="rounded-3xl p-6 shadow-sm border">
          <h1 className="text-2xl font-bold">Valider un paiement</h1>
          <p className="mt-1 text-sm">
            Sélectionnez une charge en attente et validez le paiement.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
            {/* ─── Charge selector ─── */}
            <div>
              <label className="block text-sm font-medium">Charge</label>
              <select
                {...register("charge_id")}
                className="mt-1 w-full rounded-xl border px-4 py-2.5 outline-none transition  text-slate-700
                 focus:border-orange-500 disabled:opacity-50"
                disabled={pendingCharges.length === 0}
              >
                <option value="">Sélectionner une charge</option>
                {pendingCharges.map((charge) => {
                  const ownerName = ownerMap.get(charge.owner_id) || "Inconnu";
                  const aptNumber = apartmentMap.get(charge.apartment_id) || "N/A";
                  return (
                    <option key={charge.id} value={charge.id}>
                      {ownerName} – {aptNumber} – {charge.title} ({formatAmount(charge.amount)} MAD)
                    </option>
                  );
                })}
              </select>
              {errors.charge_id && (
                <p className="mt-1 text-xs">{errors.charge_id.message}</p>
              )}
              {pendingCharges.length === 0 && (
                <p className="mt-2 text-sm">Aucune charge en attente de paiement.</p>
              )}
            </div>

            {/* ─── Selected charge preview ─── */}
            {selectedCharge && (
              <div className="rounded-xl border p-4">
                <p className="text-sm">Détails de la charge</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm  text-slate-700">
                  <span>Propriétaire</span>
                  <span className="font-medium">
                    {ownerMap.get(selectedCharge.owner_id) || "Inconnu"}
                  </span>
                  <span>Appartement</span>
                  <span className="font-medium">
                    {apartmentMap.get(selectedCharge.apartment_id) || "N/A"}
                  </span>
                  <span>Montant</span>
                  <span className="font-medium">
                    {formatAmount(selectedCharge.amount)} MAD
                  </span>
                  <span>Échéance</span>
                  <span className="font-medium">
                    {formatDate(selectedCharge.due_date)}
                  </span>
                </div>
              </div>
            )}

            {/* ─── Payment date ─── */}
            <div>
              <label className="block text-sm font-medium">Date de paiement</label>
              <input
                type="date"
                {...register("payment_date")}
                className="mt-1 w-full rounded-xl border px-4 py-2.5 bg-white text-slate-700
                outline-none transition focus:border-orange-500  "
              />
              {errors.payment_date && (
                <p className="mt-1 text-xs">{errors.payment_date.message}</p>
              )}
            </div>

            {/* ─── Payment method ─── */}
            <div>
              <label className="block text-sm font-medium">Méthode</label>
              <select
                {...register("payment_method")}
                className="mt-1 w-full rounded-xl border px-4 py-2.5  text-slate-700
                outline-none transition focus:border-orange-500"
              >
                <option value="">Sélectionner une méthode</option>
                <option value="virement">Virement bancaire</option>
                <option value="especes">Espèces</option>
                <option value="cheque">Chèque</option>
                <option value="carte">Carte bancaire</option>
                <option value="autre">Autre</option>
              </select>
              {errors.payment_method && (
                <p className="mt-1 text-xs">{errors.payment_method.message}</p>
              )}
            </div>

            {/* ─── Reference ─── */}
            <div>
              <label className="block text-sm font-medium">Référence (optionnel)</label>
              <input
                type="text"
                {...register("reference")}
                placeholder="Référence transaction"
                className="mt-1 w-full rounded-xl border px-4 py-2.5 outline-none transition focus:border-orange-500"
              />
            </div>

            {/* ─── Notes ─── */}
            <div>
              <label className="block text-sm font-medium">Notes (optionnel)</label>
              <textarea
                {...register("notes")}
                rows={3}
                placeholder="Informations complémentaires..."
                className="mt-1 w-full rounded-xl border px-4 py-2.5 outline-none transition focus:border-orange-500"
              />
            </div>

            {error && <p className="text-sm">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting || !selectedCharge}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : null}
              {isSubmitting ? "Validation..." : "Valider le paiement"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}