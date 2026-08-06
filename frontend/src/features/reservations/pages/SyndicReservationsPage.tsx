import { Link } from "react-router-dom";
import { format, isToday, isFuture, isPast } from "date-fns";
import {
  Calendar,
  Clock,
  Mail,
  Phone,
  MessageSquare,
  Check,
  X,
  Building2,
  ChevronRight,
  Loader2,
  AlertCircle,
  CalendarX,
  Trash2,
} from "lucide-react";

import {
  useReservations,
  useDeleteReservation,
  useUpdateReservationStatus,
} from "../hooks/usereservations";
import { useApartment } from "@/features/apartments/hooks/Apartment.hook";

// ─── Local type ──────────────────────────────────────────────────────────────
type ReservationStatus = "pending" | "confirmed" | "cancelled";
type TimeSlot = "09:00" | "14:00" | "17:00";

interface LocalReservation {
  id: string;
  apartment_id: string;
  syndic_id: string;
  appointment_date: string;
  time_slot: TimeSlot;
  status: ReservationStatus;
  visitor_name: string;
  visitor_email: string;
  visitor_phone?: string;
  message?: string;
  check_in_date?: string;
  check_out_date?: string;
  guests_count?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// ─── STATUS CONFIG ──────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  pending: { label: "En attente", className: "bg-orange-100 text-orange-700" },
  confirmed: { label: "Confirmée", className: "bg-green-100 text-green-700" },
  cancelled: { label: "Annulée", className: "bg-slate-200 text-slate-500" },
};

function ReservationCard({ reservation }: { reservation: LocalReservation }) {
  const { data: apartment } = useApartment(reservation.apartment_id);
  const updateStatus = useUpdateReservationStatus();
  const deleteReservation = useDeleteReservation();

  const statusInfo =
    STATUS_CONFIG[reservation.status] ?? {
      label: reservation.status,
      className: "bg-slate-100 text-slate-600",
    };

  const formattedDate = reservation.appointment_date
    ? format(new Date(reservation.appointment_date), "dd/MM/yyyy")
    : "Date inconnue";

  const timeSlot = reservation.time_slot || "Horaire inconnu";

  const handleConfirm = () => {
    updateStatus.mutate({
      id: reservation.id,
      data: { status: "confirmed" },
    });
  };

  const handleCancel = () => {
    if (!window.confirm("Annuler cette réservation ?")) return;
    updateStatus.mutate({
      id: reservation.id,
      data: { status: "cancelled" },
    });
  };

  // ─── Suppression ──────────────────────────────────────────────────────────
  const handleDelete = () => {
    if (!window.confirm("Supprimer définitivement cette réservation ?")) return;
    deleteReservation.mutate(reservation.id);
  };

  return (
    <div className="rounded-2xl border p-3 sm:p-4">
      <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center
           rounded-full bg-orange-500 font-semibold text-white sm:h-11 sm:w-11">
            {reservation.visitor_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold sm:text-base">{reservation.visitor_name}</p>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs sm:gap-x-3 sm:text-sm">
              <span className="flex items-center gap-1">
                <Mail size={12} className="shrink-0" />
                <span className="truncate max-w-[120px] sm:max-w-[200px]">{reservation.visitor_email}</span>
              </span>
              {reservation.visitor_phone && (
                <span className="flex items-center gap-1">
                  <Phone size={12} className="shrink-0" />
                  <span className="truncate max-w-[100px] sm:max-w-[150px]">{reservation.visitor_phone}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold sm:px-3 sm:py-1 ${statusInfo.className}`}
        >
          {statusInfo.label}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t pt-3 text-xs sm:mt-4 sm:gap-x-5 sm:pt-4 sm:text-sm">
        <span className="flex items-center gap-1.5">
          <Calendar size={14} className="shrink-0" />
          {formattedDate}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={14} className="shrink-0" />
          {timeSlot}
        </span>
        <span className="flex items-center gap-1.5">
          <Building2 size={14} className="shrink-0" />
          {apartment?.data
            ? `Appartement ${apartment.data.apartment_number}`
            : "…"}
        </span>
      </div>

      {reservation.message && (
        <div className="mt-3 flex items-start gap-2 rounded-xl 
         p-2 text-xs sm:mt-4 sm:p-3 sm:text-sm">
          <MessageSquare size={18} className="mt-0.5 shrink-0  sm:size-[23px]" />
          <p className="line-clamp-2">{reservation.message}</p>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 sm:mt-4 sm:gap-3">
        <Link
          to={`/syndic/reservations/${reservation.id}`}
          className="flex items-center gap-1 rounded-2xl bg-orange-500 px-3 py-2 text-xs font-semibold text-white transition hover:text-slate-700 sm:px-4 sm:py-2.5 sm:text-sm"
        >
          Voir les détails
          <ChevronRight size={14} />
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={handleDelete}
            disabled={deleteReservation.isPending}
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50 sm:p-2"
            title="Supprimer"
          >
            {deleteReservation.isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Trash2 size={18} className="text-red-500 sm:size-[23px]" />
            )}
          </button>

          {reservation.status === "pending" && (
            <div className="flex gap-1 sm:gap-2">
              <button
                onClick={handleCancel}
                disabled={updateStatus.isPending}
                className="flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-medium transition hover:bg-slate-50 disabled:opacity-50 sm:px-3 sm:py-1.5 sm:text-sm"
              >
                <X size={14} />
                Annuler
              </button>
              <button
                onClick={handleConfirm}
                disabled={updateStatus.isPending}
                className="flex items-center gap-1 rounded-lg bg-orange-500 px-2 py-1 text-xs font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50 sm:px-3 sm:py-1.5 sm:text-sm"
              >
                {updateStatus.isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Check size={14} />
                )}
                Confirmer
              </button>
            </div>
          )}

          {reservation.status === "confirmed" && (
            <button
              onClick={handleCancel}
              disabled={updateStatus.isPending}
              className="flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 sm:px-3 sm:py-1.5 sm:text-sm"
            >
              <X size={14} />
              Annuler
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2].map((i) => (
        <div key={i} className="h-40 animate-pulse rounded-2xl bg-slate-200" />
      ))}
    </div>
  );
}

export default function SyndicReservationsPage() {
  const { data, isLoading, isError, error } = useReservations();

  const reservations = (data as unknown as LocalReservation[]) ?? [];

  // We need to define today for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0); // reset time to midnight for accurate comparison

  const todayReservations = reservations.filter((r) =>
    isToday(new Date(r.appointment_date))
  );

  const upcomingReservations = reservations
    .filter(
      (r) =>
        isFuture(new Date(r.appointment_date)) &&
        !isToday(new Date(r.appointment_date))
    )
    .sort(
      (a, b) =>
        new Date(a.appointment_date).getTime() -
        new Date(b.appointment_date).getTime()
    );

  // ─── Past reservations ────────────────────────────────────────────────────
  const pastReservations = reservations
    .filter((r) => isPast(new Date(r.appointment_date)))
    .sort(
      (a, b) =>
        new Date(b.appointment_date).getTime() -
        new Date(a.appointment_date).getTime() // most recent first
    );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b">
        <div className="mx-auto max-w-4xl px-4 py-3 sm:px-6 sm:py-4">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            Réservations
          </h1>
          <p className="mt-1 text-xs  sm:text-sm">
            {isLoading
              ? "Chargement..."
              : `${todayReservations.length} aujourd'hui · ${upcomingReservations.length} à venir · ${pastReservations.length} passées`}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-8 px-4 py-6 sm:space-y-10 sm:px-6 sm:py-8">
        {isLoading && <SectionSkeleton />}

        {isError && (
          <div className="flex flex-col items-center justify-center rounded-3xl border py-12 text-center sm:py-16">
            <AlertCircle size={32} />
            <h2 className="mt-3 text-base font-semibold sm:text-lg">
              Impossible de charger les réservations
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {error instanceof Error ? error.message : "Erreur inconnue"}
            </p>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            {/* TODAY */}
            <div>
              <h2 className="mb-3 text-base font-semibold sm:mb-4 sm:text-lg">
                Aujourd&apos;hui
              </h2>
              {todayReservations.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-8 text-center sm:py-10">
                  <CalendarX size={24} />
                  <p className="mt-2 text-sm ">
                    Aucune visite prévue aujourd&apos;hui.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayReservations.map((r) => (
                    <ReservationCard key={r.id} reservation={r} />
                  ))}
                </div>
              )}
            </div>

            {/* UPCOMING */}
            <div>
              <h2 className="mb-3 text-base font-semibold sm:mb-4 sm:text-lg">
                À venir
              </h2>
              {upcomingReservations.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl 
                border border-dashed py-8 text-center sm:py-10">
                  <CalendarX size={24} />
                  <p className="mt-2 text-sm ">
                    Aucune réservation à venir.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingReservations.map((r) => (
                    <ReservationCard key={r.id} reservation={r} />
                  ))}
                </div>
              )}
            </div>

            {/* PAST */}
            <div>
              <h2 className="mb-3 text-base font-semibold sm:mb-4 sm:text-lg">
                Passées
              </h2>
              {pastReservations.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-8 text-center sm:py-10">
                  <CalendarX size={24} />
                  <p className="mt-2 text-sm text-slate-500">
                    Aucune réservation passée.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pastReservations.map((r) => (
                    <ReservationCard key={r.id} reservation={r} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}