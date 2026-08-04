import { useParams, Link, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Mail,
  Phone,
  MessageSquare,
  Check,
  X,
  Building2,
  Users,
  Loader2,
  AlertCircle,
  StickyNote,
  CalendarDays,
} from "lucide-react";

import { useReservation, useUpdateReservationStatus } from "../hooks/usereservations";
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

const STATUS_CONFIG: Record<
  ReservationStatus,
  { label: string; color: string; dot: string }
> = {
  pending: { label: "En attente", color: "text-orange-600", dot: "bg-orange-500" },
  confirmed: { label: "Confirmée", color: "text-emerald-600", dot: "bg-emerald-500" },
  cancelled: { label: "Annulée", color: "text-slate-400", dot: "bg-slate-400" },
};

export default function ReservationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useReservation(id ?? "");
  const reservation = data as unknown as LocalReservation | undefined;

  const { data: apartmentData } = useApartment(reservation?.apartment_id ?? "");
  const apartment = apartmentData?.data;
  const updateStatus = useUpdateReservationStatus();

  if (!id) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-medium">Réservation introuvable.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 size={32} className="animate-spin text-orange-500" />
      </div>
    );
  }

  if (isError || !reservation) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-center">
        <AlertCircle size={32} />
        <p className="mt-3 font-medium">Impossible de charger cette réservation.</p>
      </div>
    );
  }

  const status = reservation.status;
  const statusConfig = STATUS_CONFIG[status];
  const formattedDate = reservation.appointment_date
    ? format(new Date(reservation.appointment_date), "dd/MM/yyyy")
    : "Date inconnue";
  const timeSlot = reservation.time_slot || "Horaire inconnu";

  const handleConfirm = () => {
    updateStatus.mutate({ id: reservation.id, data: { status: "confirmed" } });
  };

  const handleCancel = () => {
    if (!window.confirm("Annuler cette réservation ?")) return;
    updateStatus.mutate(
      { id: reservation.id, data: { status: "cancelled" } },
      { onSuccess: () => navigate("/syndic/reservations") }
    );
  };

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* ─── Navigation ─── */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/syndic/reservations"
            className="inline-flex items-center gap-2 text-sm font-medium transition"
          >
            <ArrowLeft size={16} />
            Retour aux réservations
          </Link>
          <span className="text-xs font-mono">
            #{reservation.id.slice(0, 8)}
          </span>
        </div>

        {/* ─── Main Grid ─── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ─── Left Column ─── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Visitor Card */}
            <div className="rounded-2xl p-6 shadow-sm border">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl font-bold">
                  {reservation.visitor_name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl font-bold">
                      {reservation.visitor_name}
                    </h1>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig.color}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`} />
                      {statusConfig.label}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                    <span className="flex items-center gap-1.5">
                      <Mail size={14} />
                      <a href={`mailto:${reservation.visitor_email}`} className="hover:text-orange-600">
                        {reservation.visitor_email}
                      </a>
                    </span>
                    {reservation.visitor_phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone size={14} />
                        <a href={`tel:${reservation.visitor_phone}`} className="hover:text-orange-600">
                          {reservation.visitor_phone}
                        </a>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Visit Details Card */}
            <div className="rounded-2xl p-6 shadow-sm border">
              <h2 className="text-xs font-semibold uppercase tracking-wider">
                Détails de la visite
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-5 w-5" />
                  <div>
                    <p className="text-sm font-medium">Date</p>
                    <p className="text-sm">{formattedDate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5" />
                  <div>
                    <p className="text-sm font-medium">Horaire</p>
                    <p className="text-sm">{timeSlot}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:col-span-2">
                  <Building2 className="mt-0.5 h-5 w-5" />
                  <div>
                    <p className="text-sm font-medium">Appartement</p>
                    <p className="text-sm">
                      {apartment
                        ? `Appartement ${apartment.apartment_number}`
                        : "Chargement…"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Card */}
            {reservation.message && (
              <div className="rounded-2xl p-6 shadow-sm border">
                <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                  <MessageSquare size={14} />
                  Message du visiteur
                </h2>
                <p className="mt-2 text-sm leading-relaxed">
                  {reservation.message}
                </p>
              </div>
            )}

            {/* Stay Interest Card */}
            {(reservation.check_in_date ||
              reservation.check_out_date ||
              reservation.guests_count) && (
              <div className="rounded-2xl p-6 shadow-sm border">
                <h2 className="text-xs font-semibold uppercase tracking-wider">
                  Intérêt pour un séjour
                </h2>
                <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  {reservation.check_in_date && (
                    <span className="flex items-center gap-2">
                      <CalendarDays size={14} />
                      <span>Arrivée</span>
                      <span className="font-medium">
                        {format(parseISO(reservation.check_in_date), "d MMM yyyy", {
                          locale: fr,
                        })}
                      </span>
                    </span>
                  )}
                  {reservation.check_out_date && (
                    <span className="flex items-center gap-2">
                      <CalendarDays size={14} />
                      <span>Départ</span>
                      <span className="font-medium">
                        {format(parseISO(reservation.check_out_date), "d MMM yyyy", {
                          locale: fr,
                        })}
                      </span>
                    </span>
                  )}
                  {reservation.guests_count && (
                    <span className="flex items-center gap-2">
                      <Users size={14} />
                      <span className="font-medium">
                        {reservation.guests_count} personne
                        {reservation.guests_count > 1 ? "s" : ""}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Notes Card */}
            {reservation.notes && (
              <div className="rounded-2xl p-6 shadow-sm border">
                <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                  <StickyNote size={14} />
                  Notes internes
                </h2>
                <p className="mt-2 text-sm leading-relaxed">
                  {reservation.notes}
                </p>
              </div>
            )}
          </div>

          {/* ─── Right Column – Actions Panel ─── */}
          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-8 rounded-2xl p-6 shadow-sm border">
              <h3 className="text-sm font-semibold">Actions</h3>

              <div className="mt-4 space-y-3">
                {/* Status summary */}
                <div className="rounded-xl p-3 text-sm border">
                  <div className="flex items-center justify-between">
                    <span>Statut actuel</span>
                    <span
                      className={`inline-flex items-center gap-1.5 font-medium ${statusConfig.color}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`} />
                      {statusConfig.label}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                {status !== "cancelled" && (
                  <div className="space-y-2">
                    {status === "pending" && (
                      <button
                        onClick={handleConfirm}
                        disabled={updateStatus.isPending}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:opacity-50"
                      >
                        {updateStatus.isPending ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Check size={16} />
                        )}
                        Confirmer la réservation
                      </button>
                    )}
                    <button
                      onClick={handleCancel}
                      disabled={updateStatus.isPending}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    >
                      <X size={16} />
                      Annuler la réservation
                    </button>
                  </div>
                )}

                {status === "cancelled" && (
                  <div className="rounded-xl p-4 text-center text-sm border">
                    Cette réservation a été annulée.
                  </div>
                )}

                {/* Meta info */}
                <div className="border-t pt-3 text-xs">
                  <p>Créée le {format(new Date(reservation.created_at), "dd/MM/yyyy à HH:mm")}</p>
                  <p>Dernière mise à jour : {format(new Date(reservation.updated_at), "dd/MM/yyyy à HH:mm")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}