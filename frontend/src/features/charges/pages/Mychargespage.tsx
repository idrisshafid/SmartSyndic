import { useMemo } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { useChargesForOwner } from "../hooks/usecharges";
import { useAuthStore } from "@/stores/auth.store";
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

export default function MyChargesPage() {
  const user = useAuthStore((state) => state.user);
  const ownerId = user?.id || "";

  // ── Fetch owner's charges ──
  const {
    data: charges,
    isLoading: chargesLoading,
    isError: chargesIsError,
    error: chargesError,
    refetch: refetchCharges,
  } = useChargesForOwner(ownerId);

  // ── Fetch apartments for lookup ──
  const { data: apartmentsData, isLoading: apartmentsLoading } = useAllApartments();

  if (chargesIsError) {
    console.error("🔴 Owner charges error:", chargesError);
    console.log("👤 Owner ID:", ownerId);
  }

  // ── Create apartment lookup map ──
  const apartmentMap = useMemo(() => {
    const map = new Map<string, string>();
    const apartments = apartmentsData?.data ?? [];
    apartments.forEach((apt) => {
      map.set(apt.id, apt.apartment_number);
    });
    return map;
  }, [apartmentsData]);

  // ── Loading states ──
  if (chargesLoading || apartmentsLoading) {
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
        : (chargesError);

    return (
      <div className="mx-3 sm:mx-4 flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border py-10 sm:py-16 px-4 text-center">
        <AlertCircle size={40} />
        <h2 className="mt-4 text-base sm:text-lg font-semibold">
          Impossible de charger vos charges
        </h2>
        <p className="mt-2 max-w-sm text-sm break-words">{errorMessage}</p>
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
    <div className="min-h-screen py-4 sm:py-6 lg:py-6">
      <div className="mx-auto max-w-5xl px-3 sm:px-4 lg:px-3">
        {/* ─── Header ─── */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Mes charges
          </h1>
          <p className="mt-1 text-sm">
            Consultez l'historique de vos charges.
          </p>
        </div>

        {/* ─── Content ─── */}
        {chargesList.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border-2 border-dashed py-12 sm:py-20 px-4 text-center">
            <AlertCircle size={40} />
            <h2 className="mt-4 text-lg sm:text-xl font-semibold">
              Aucune charge
            </h2>
            <p className="mt-1 max-w-sm text-sm">
              Vous n'avez aucune charge pour le moment.
            </p>
          </div>
        ) : (
          <>
            {/* ── Mobile: cards (all content visible) ── */}
            <div className="space-y-3 sm:hidden">
              {chargesList.map((charge: Charge) => {
                const aptNumber = apartmentMap.get(charge.apartment_id) || "N/A";
                return (
                  <div
                    key={charge.id}
                    className="rounded-xl border p-4 shadow-sm space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xm text-orange-500">Appartement</p>
                        <p className="font-medium break-words">{aptNumber}</p>
                      </div>
                      <div className="shrink-0">
                        <ChargeBadge status={charge.status} />
                      </div>
                    </div>

                    <div>
                      <p className="text-xm text-orange-500">Titre</p>
                      <p className=" break-words">{charge.title}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xm text-orange-500">Montant</p>
                        <p className="font-medium">
                          {formatAmount(charge.amount)} MAD
                        </p>
                      </div>
                      <div>
                        <p className="text-xm text-orange-500 ">Échéance</p>
                        <p className="font-medium ">
                          {formatDate(charge.due_date)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Desktop / tablet: table ── */}
            <div className="hidden sm:block overflow-hidden rounded-2xl lg:rounded-3xl shadow-sm ring-1">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse text-sm">
                  <thead className="text-xs font-medium uppercase border-b bg-slate-50 text-slate-700">
                    <tr>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left">Appartement</th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left">Titre</th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-right">Montant</th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left">Échéance</th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-center">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y border-1 border-slate-100">
                    {chargesList.map((charge: Charge) => {
                      const aptNumber = apartmentMap.get(charge.apartment_id) || "N/A";
                      return (
                        <tr key={charge.id} className="transition">
                          <td className="px-4 lg:px-6 py-3 lg:py-4 font-medium">{aptNumber}</td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4">{charge.title}</td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4 text-right font-medium">
                            {formatAmount(charge.amount)} MAD
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4">
                            {formatDate(charge.due_date)}
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4 text-center">
                            <ChargeBadge status={charge.status} />
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