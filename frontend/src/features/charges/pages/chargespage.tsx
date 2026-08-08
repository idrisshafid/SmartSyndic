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
      setError( err instanceof Error
      ? err.message
      : "Erreur lors de la validation." );
       }
  };

  const handleDelete = async (chargeId: string) => {
    if (!window.confirm("Supprimer cette charge ? Cette action est irréversible.")) return;
    setError(null);
    try {
      await deleteCharge.mutateAsync(chargeId);
      refetchCharges();
    } catch (err) {
    
      setError(  err instanceof Error   ? err.message
      : "Erreur lors de la suppression."
          );}
  };

  // ── Loading states ──
  if (chargesLoading || ownersLoading || apartmentsLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <Loader2 size={32} className="animate-spin text-orange-500" />
      </div>
    );
  }

  // ── Error state ──
  if (chargesIsError) {
    const errorMessage =
      chargesError instanceof Error
        ? chargesError.message
        : (chargesError) || "Erreur inconnue";

    return (
      <div className="mx-3 sm:mx-4 flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border py-10 sm:py-16 px-4 text-center">
        <AlertCircle size={40} />
        <h2 className="mt-4 text-base sm:text-lg font-semibold">
          Impossible de charger les charges
        </h2>
        <p className="mt-2 max-w-sm text-sm break-words">{errorMessage}</p>
        <p className="mt-1 text-xs break-all">
          Syndic ID : {syndicId || "Non défini"}
        </p>
        <button
          onClick={() => refetchCharges()}
          className="mt-4 w-full sm:w-auto rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const chargesList = charges ?? [];

  return (
    <div className="min-h-screen py-4 sm:py-6 lg:py-8">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        {/* ─── Header ─── */}
        <div className="mb-5 sm:mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Charges
            </h1>
            <p className="mt-1 text-sm">
              Gérez toutes les charges de vos propriétaires.
            </p>
          </div>

          <Link
            to="/syndic/charges/create"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-orange-200/50 transition hover:bg-orange-600 hover:shadow-orange-300/50"
          >
            <Plus size={18} />
            Créer une charge
          </Link>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border-2 border-orange-500 p-3 text-sm break-words">
            {error}
          </div>
        )}

        {/* ─── Empty ─── */}
        {chargesList.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border-2 border-dashed py-12 sm:py-20 px-4 text-center">
            <AlertCircle size={40} />
            <h2 className="mt-4 text-lg sm:text-xl font-semibold">Aucune charge</h2>
            <p className="mt-1 max-w-sm text-sm">
              Créez votre première charge pour un propriétaire.
            </p>
            <Link
              to="/syndic/charges/create"
              className="mt-6 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600"
            >
              <Plus size={18} />
              Créer une charge
            </Link>
          </div>
        ) : (
          <>
            {/* ─── Mobile cards (phone) ─── */}
            <div className="space-y-3 md:hidden">
              {chargesList.map((charge: Charge) => {
                const ownerName = ownerMap.get(charge.owner_id) || "Inconnu";
                const aptNumber = apartmentMap.get(charge.apartment_id) || "N/A";
                return (
                  <div
                    key={charge.id}
                    className="rounded-2xl border p-4 shadow-sm ring-1 ring-black/5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold break-words">{ownerName}</p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          Apt {aptNumber}
                        </p>
                      </div>
                      <ChargeBadge status={charge.status} />
                    </div>

                    <p className="mt-3 text-sm font-medium break-words">
                      {charge.title}
                    </p>

                    <div className="mt-3 flex flex-wrap items-end justify-between gap-2 border-t pt-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-slate-500">
                          Montant
                        </p>
                        <p className="text-sm font-semibold">
                          {formatAmount(charge.amount)} MAD
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] uppercase tracking-wide text-slate-500">
                          Échéance
                        </p>
                        <p className="text-sm">{formatDate(charge.due_date)}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-end gap-1 border-t pt-2">
                      {charge.status === "pending" && (
                        <button
                          onClick={() => handleValidate(charge.id)}
                          disabled={validateCharge.isPending}
                          className="rounded-full p-2.5 text-emerald-600 transition hover:bg-emerald-50 disabled:opacity-50"
                          title="Valider"
                        >
                          {validateCharge.isPending ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <CheckCircle size={18} />
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(charge.id)}
                        disabled={deleteCharge.isPending}
                        className="rounded-full p-2.5 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                        title="Supprimer"
                      >
                        {deleteCharge.isPending ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ─── Desktop table ─── */}
            <div className="hidden overflow-hidden rounded-3xl shadow-sm ring-1 md:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] border-collapse text-sm">
                  <thead className="text-xs font-medium uppercase border-1 border-white-500">
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
                          <td className="px-2 py-4 font-medium">{ownerName}</td>
                          <td className="px-4 py-4">{aptNumber}</td>
                          <td className="px-3 py-4">{charge.title}</td>
                          <td className="px-6 py-4 text-right font-medium">
                            {formatAmount(charge.amount)} MAD
                          </td>
                          <td className="px-3 py-4">{formatDate(charge.due_date)}</td>
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
          </>
        )}
      </div>
    </div>
  );
}