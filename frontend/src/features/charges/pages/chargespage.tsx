import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useChargesForSyndic, useDeleteCharge, useValidateCharge } from "../hooks/usecharges";
import { useAuthStore } from "@/stores/auth.store";
import { useOwners } from "@/features/owners/hooks/owner.hooks";
import { useAllApartments } from "@/features/apartments/hooks/Apartment.hook";
import { ChargeBadge } from "../components/ChargeBadge";
import type { Charge } from "../types/charge.type";

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

export default function ChargesPage() {
  const user = useAuthStore((state) => state.user);
  const syndicId = user?.id || "";

  const [error, setError] = useState<string | null>(null);

  // ── Fetch charges ──
  const {
    data: charges,
    isLoading: chargesLoading,
    isError: chargesIsError,
    error: chargesError,
    refetch: refetchCharges,
  } = useChargesForSyndic(syndicId);

  // ── Fetch owners and apartments for lookup ──
  const { data: ownersData, isLoading: ownersLoading } = useOwners();
  const { data: apartmentsData, isLoading: apartmentsLoading } = useAllApartments();

  // ── Mutations ──
  const validateCharge = useValidateCharge();
  const deleteCharge = useDeleteCharge();

  // ── Log errors for debugging ──
  if (chargesIsError) {
    console.error("🔴 Charges error:", chargesError);
    console.log("🔐 Syndic ID:", syndicId);
    console.log("👤 User:", user);
  }

  // ── Create lookup maps ──
  const ownerMap = useMemo(() => {
    const map = new Map<string, string>();
    const owners = ownersData?.data ?? [];
    owners.forEach((owner) => {
      map.set(owner.id, `${owner.first_name} ${owner.last_name}`);
    });
    return map;
  }, [ownersData]);

  const apartmentMap = useMemo(() => {
    const map = new Map<string, string>();
    const apartments = apartmentsData?.data ?? [];
    apartments.forEach((apt) => {
      map.set(apt.id, apt.apartment_number);
    });
    return map;
  }, [apartmentsData]);

  // ── Handlers ──
  const handleValidate = async (chargeId: string) => {
    if (!window.confirm("Valider cette charge ?")) return;
    setError(null);
    try {
      await validateCharge.mutateAsync(chargeId);
      refetchCharges();
    } catch (err) {
      setError(err.message || "Erreur lors de la validation.");
    }
  };

  const handleDelete = async (chargeId: string) => {
    if (!window.confirm("Supprimer cette charge ? Cette action est irréversible.")) return;
    setError(null);
    try {
      await deleteCharge.mutateAsync(chargeId);
      refetchCharges();
    } catch (err) {
      setError(err.message || "Erreur lors de la suppression.");
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

  // ── Error state ──
  if (chargesIsError) {
    const errorMessage =
      chargesError instanceof Error
        ? chargesError.message
        : (chargesError ) || "Erreur inconnue";

    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border py-16 text-center">
        <AlertCircle size={40} />
        <h2 className="mt-4 text-lg font-semibold">
          Impossible de charger les charges
        </h2>
        <p className="mt-2 max-w-sm text-sm">
          {errorMessage}
        </p>
        <p className="mt-1 text-xs">
          Syndic ID : {syndicId || "Non défini"}
        </p>
        <button
          onClick={() => refetchCharges()}
          className="mt-4 rounded-xl bg-orange-500 px-6 py-2 text-sm font-semibold text-white hover:bg-orange-600"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const chargesList = charges ?? [];

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4">
        {/* ─── Header ─── */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Charges
            </h1>
            <p className="mt-1 text-sm">
              Gérez toutes les charges de vos propriétaires.
            </p>
          </div>

          <Link
            to="/syndic/charges/create"
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-orange-200/50 transition hover:bg-orange-600 hover:shadow-orange-300/50"
          >
            <Plus size={18} />
            Créer une charge
          </Link>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border-2 border-orange-500 p-3 text-sm">
            {error}
          </div>
        )}

        {/* ─── Table ─── */}
        {chargesList.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed py-20 text-center">
            <AlertCircle size={40} />
            <h2 className="mt-4 text-xl font-semibold">
              Aucune charge
            </h2>
            <p className="mt-1 max-w-sm text-sm">
              Créez votre première charge pour un propriétaire.
            </p>
            <Link
              to="/syndic/charges/create"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600"
            >
              <Plus size={18} />
              Créer une charge
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl  shadow-sm ring-1">
            <div className="overflow-x-auto ">
              <table className="w-full min-w-[800px] border-collapse text-sm " >
                <thead className="text-xs font-medium uppercase  border-1 border-white-500">
                  <tr>
                    <th className="px-6 py-4 text-left">Propriétaire</th>
                    <th className="px-7 py-4 text-left">Appartement</th>
                    <th className="px-7 py-4 text-left">Titre</th>
                    <th className="px-7 py-4 text-right">Montant</th>
                    <th className="px-3 py-4 text-left">Échéance</th>
                    <th className="px-7 py-4 text-center">Statut</th>
                    <th className="px-3 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {chargesList.map((charge: Charge) => {
                    const ownerName = ownerMap.get(charge.owner_id) || "Inconnu";
                    const aptNumber = apartmentMap.get(charge.apartment_id) || "N/A";
                    return (
                      <tr key={charge.id} className="transition hover:bg-slate-50/50">
                        <td className="px-2 py-4 font-medium">
                          {ownerName}
                        </td>
                        <td className="px-4 py-4">
                          {aptNumber}
                        </td>
                        <td className="px-3 py-4">{charge.title}</td>
                        <td className="px-6 py-4 text-right font-medium">
                          {formatAmount(charge.amount)} MAD
                        </td>
                        <td className="px-3 py-4">
                          {formatDate(charge.due_date)}
                        </td>
                        <td className="px-3 py-4 text-center">
                          <ChargeBadge status={charge.status} />
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {charge.status === "pending" && (
                              <button
                                onClick={() => handleValidate(charge.id)}
                                disabled={validateCharge.isPending}
                                className="rounded-full p-1.5 text-emerald-600 transition hover:bg-emerald-50 disabled:opacity-50"
                                title="Valider"
                              >
                                {validateCharge.isPending ? (
                                  <Loader2 size={16} className="animate-spin" />
                                ) : (
                                  <CheckCircle size={16} />
                                )}
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(charge.id)}
                              disabled={deleteCharge.isPending}
                              className="rounded-full p-1.5 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                              title="Supprimer"
                            >
                              {deleteCharge.isPending ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}