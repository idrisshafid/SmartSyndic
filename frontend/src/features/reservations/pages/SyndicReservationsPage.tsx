import { Link } from "react-router-dom";
import { format, isToday, isFuture } from "date-fns";
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
    <div className="rounded-2xl border p-2">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center text-white ml-2 justify-center rounded-full bg-orange-500 font-semibold">
            {reservation.visitor_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold">{reservation.visitor_name}</p>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xm">
              <span className="mt-2 flex items-center gap-1 text-sm">
                <Mail size={12} />
                {reservation.visitor_email}
              </span>
              {reservation.visitor_phone && (
                <span className="mt-2 mx-2 flex items-center gap-1 text-sm">
                  <Phone size={12} />
                  {reservation.visitor_phone}
                </span>
              )}
            </div>
          </div>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.className}`}
        >
          {statusInfo.label}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t pt-4 text-xm">
        <span className="flex items-center gap-1.5 m-2 p-2">
          <Calendar size={14} />
          {formattedDate}
        </span>
        <span className="flex items-center gap-1.5 m-2 p-2 text-xm">
          <Clock size={14} />
          {timeSlot}
        </span>
        <span className="flex items-center gap-1.5 m-2 p-2 text-xm">
          <Building2 size={14} />
          {apartment?.data
            ? `Appartement ${apartment.data.apartment_number}`
            : "…"}
        </span>
      </div>

      {reservation.message && (
        <div className="mt-3 flex items-start gap-2 rounded-xl p-3 text-xm m-3 p-3">
          <MessageSquare size={23} className="mt-0.5 shrink-0" />
          <p className="line-clamp-2">{reservation.message}</p>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-3">
        <Link
          to={`/syndic/reservations/${reservation.id}`}
          className="flex items-center gap-1 text-sm font-semibold rounded-2xl bg-orange-500 m-3 p-3 transition text-white hover:text-slate-700"
        >
          Voir les détails
          <ChevronRight size={14} />
        </Link>

        <div className="flex items-center gap-2">
          {/* Bouton Supprimer (icône corbeille) */}
          <button
            onClick={handleDelete}
            disabled={deleteReservation.isPending}
            className="rounded-full p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
            title="Supprimer"
          >
            {deleteReservation.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Trash2 size={23} className="text-red-500" />
            )}
          </button>

          {reservation.status === "pending" && (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                disabled={updateStatus.isPending}
                className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition hover:bg-slate-50 disabled:opacity-50"
              >
                <X size={14} />
                Annuler
              </button>
              <button
                onClick={handleConfirm}
                disabled={updateStatus.isPending}
                className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
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
              className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
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
        <div key={i} className="h-40 animate-pulse rounded-2xl" />
      ))}
    </div>
  );
}

export default function SyndicReservationsPage() {
  const { data, isLoading, isError, error } = useReservations();

  const reservations = (data as unknown as LocalReservation[]) ?? [];

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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b">
        <div className="mx-auto max-w-4xl px-6 py-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Réservations
          </h1>
          <p className="mt-1 text-sm">
            {isLoading
              ? "Chargement..."
              : `${todayReservations.length} aujourd'hui · ${upcomingReservations.length} à venir`}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-10 px-6 py-8">
        {isLoading && <SectionSkeleton />}

        {isError && (
          <div className="flex flex-col items-center justify-center rounded-3xl border py-16 text-center">
            <AlertCircle size={32} />
            <h2 className="mt-3 text-lg font-semibold">
              Impossible de charger les réservations
            </h2>
            <p className="mt-1 text-sm">
              {error instanceof Error ? error.message : "Erreur inconnue"}
            </p>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            {/* TODAY */}
            <div>
              <h2 className="mb-4 text-lg font-semibold">
                Aujourd&apos;hui
              </h2>
              {todayReservations.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-10 text-center">
                  <CalendarX size={24} />
                  <p className="mt-2 text-sm">
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
              <h2 className="mb-4 text-lg font-semibold">À venir</h2>
              {upcomingReservations.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-10 text-center">
                  <CalendarX size={24} />
                  <p className="mt-2 text-sm">
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
          </>
        )}
      </div>
    </div>
  );
}