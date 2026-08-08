import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  CalendarCheck,
  Building2,
  Users,
  Eye,
  PartyPopper,
  Pencil,
} from "lucide-react";

import { useApartment } from "@/features/apartments/hooks/Apartment.hook";
import { useCreateReservation } from "../hooks/usereservations";
import AvailabilityCalendar from "../components/AvailabilityCalendar";
import TimeSlotPicker from "../components/TimeSlotPicker";
import type { TimeSlot } from "../types/reservations.types";
import { getApartmentsPath, getApartmentDetailPath } from "@/utils/navigationApartment";
import { useAuthStore } from "@/stores/auth.store";

const bookingFormSchema = z.object({
  visitor_name: z.string().min(2, "Nom complet requis"),
  visitor_email: z.string().email("Email invalide"),
  visitor_phone: z.string().optional(),
  message: z.string().optional(),
  check_in_date: z.string().optional(),
  check_out_date: z.string().optional(),
 guests_count: z.coerce.number().int().optional(),
  notes: z.string().optional(),
});

type BookingFormData = z.output<typeof bookingFormSchema>;

const STEPS = [
  { number: 1, label: "Date" },
  { number: 2, label: "Créneau" },
  { number: 3, label: "Coordonnées" },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="mb-8 flex items-center justify-center">
      {STEPS.map((s, i) => (
        <div key={s.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition ${
                current > s.number
                  ? "bg-orange-500 text-white"
                  : current === s.number
                  ? "bg-orange-500 text-white ring-4 ring-orange-100"
                  : "border text-slate-400"
              }`}
            >
              {current > s.number ? <Check size={16} /> : s.number}
            </div>
            <span
              className={`mt-2 text-xs font-medium ${
                current >= s.number ? "text-slate-900" : "text-slate-400"
              }`}
            >
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`mx-2 mb-5 h-0.5 w-14 sm:w-20 ${
                current > s.number ? "bg-orange-500" : "border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function BookingPage() {
  const { apartmentId } = useParams<{ apartmentId: string }>();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);

  const {
    data: apartmentData,
    isLoading: apartmentLoading,
    isError: apartmentError,
  } = useApartment(apartmentId ?? "");
  const apartment = apartmentData?.data;

const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
} 
= useForm <
   z.input<typeof bookingFormSchema>,undefined ,
  z.output<typeof bookingFormSchema> 
  >  ({ resolver: zodResolver(bookingFormSchema),});

  const createReservation = useCreateReservation();

  const goBack = () => {
    if (step === 1) {
      if (!apartmentId) {
  navigate("/");
  return;
}
      navigate(getApartmentDetailPath(apartmentId, user?.role));
    } else {
      setStep((s) => (s - 1) as 1 | 2 | 3);
    }
  };

  const goNext = () => {
    if (step === 1 && selectedDate) setStep(2);
    else if (step === 2 && selectedSlot) setStep(3);
  };

  const onSubmit = async (data: BookingFormData) => {
    if (!apartmentId || !selectedDate || !selectedSlot) {
      setSubmitError("Veuillez sélectionner une date et un créneau.");
      return;
    }

    setSubmitError(null);

    try {
      await createReservation.mutateAsync({
        apartment_id: apartmentId,
        appointment_date: selectedDate,
        time_slot: selectedSlot.time_slot,
        visitor_name: data.visitor_name,
        visitor_email: data.visitor_email,
        visitor_phone: data.visitor_phone || undefined,
        message: data.message || undefined,
        check_in_date: data.check_in_date || undefined,
        check_out_date: data.check_out_date || undefined,
        guests_count: data.guests_count || undefined,
        notes: data.notes || undefined,
      });
      setStep(4);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "La réservation a échoué. Veuillez réessayer."
      );
    }
  };

  if (apartmentLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 size={32} className="animate-spin text-orange-500" />
      </div>
    );
  }

  if (apartmentError || !apartment) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-center">
        <p className="font-medium">
          Impossible de charger l'appartement.
        </p>
        <Link
          to={getApartmentsPath(user?.role)}
          className="mt-4 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          Retour
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10">
      <div className="mx-auto max-w-xl px-6">
        {step < 4 && (
          <button
            onClick={goBack}
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium transition"
          >
            <ArrowLeft size={16} />
            {step === 1 ? "Retour à l'appartement" : "Retour"}
          </button>
        )}

        {step < 4 && (
          <>
            {/* APARTMENT SUMMARY */}
            <div className="mb-6 flex items-center gap-4 rounded-2xl border p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                <Building2 size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">
                  Appartement {apartment.apartment_number}
                </p>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
                  <span className="flex items-center gap-1">
                    <Users size={12} />
                    {apartment.capacity} pers.
                  </span>
                  {apartment.view_type && (
                    <span className="flex items-center gap-1">
                      <Eye size={12} />
                      {apartment.view_type}
                    </span>
                  )}
                </div>
              </div>
              {apartment.price_per_night != null && (
                <div className="text-right">
                  <p className="text-sm font-bold">
                    {apartment.price_per_night} MAD
                  </p>
                  <p className="text-xs">/ nuit</p>
                </div>
              )}
            </div>

            <div className="mb-2 text-center">
              <h1 className="text-2xl font-bold">
                Réserver une visite
              </h1>
              <p className="mt-1 text-sm">
                Quelques étapes rapides pour planifier votre visite.
              </p>
            </div>

            <StepIndicator current={step} />
          </>
        )}

        <div className="rounded-3xl p-6 shadow-sm border">
          {/* STEP 1 — DATE */}
          {step === 1 && (
            <div>
              <h2 className="mb-1 text-lg font-semibold">
                Choisissez une date
              </h2>
              <p className="mb-5 text-sm">
                Sélectionnez un jour disponible pour la visite.
              </p>
              <AvailabilityCalendar
                apartmentId={apartmentId!}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            </div>
          )}

          {/* STEP 2 — TIME SLOT */}
          {step === 2 && selectedDate && (
            <div>
              <h2 className="mb-1 text-lg font-semibold">
                Choisissez un créneau
              </h2>
              <p className="mb-5 text-sm">
                Sélectionnez l'horaire qui vous convient le{" "}
                <span className="font-medium">
                  {selectedDate}
                </span>
                .
              </p>
              <TimeSlotPicker
                apartmentId={apartmentId!}
                date={selectedDate}
                selectedSlot={selectedSlot}
                onSelectSlot={setSelectedSlot}
              />
            </div>
          )}

          {/* STEP 3 — DETAILS + REVIEW */}
          {step === 3 && (
            <div>
              <h2 className="mb-5 text-lg font-semibold">
                Vos coordonnées
              </h2>

              {/* BOOKING SUMMARY */}
              <div className="mb-6 flex items-center justify-between rounded-2xl p-4 border">
                <div className="flex items-center gap-3">
                  <CalendarCheck size={18} />
                  <div>
                    <p className="text-sm font-semibold">
                      {selectedDate} à {selectedSlot?.time_slot}
                    </p>
                    <p className="text-xs">
                      Appartement {apartment.apartment_number}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700"
                >
                  <Pencil size={12} />
                  Modifier
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    {...register("visitor_name")}
                    className="mt-1 w-full rounded-xl border px-4 py-2.5 outline-none transition"
                    placeholder="Jean Dupont"
                  />
                  {errors.visitor_name && (
                    <p className="mt-1 text-xs">
                      {errors.visitor_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Email *
                  </label>
                  <input
                    type="email"
                    {...register("visitor_email")}
                    className="mt-1 w-full rounded-xl border px-4 py-2.5 outline-none transition"
                    placeholder="jean@exemple.com"
                  />
                  {errors.visitor_email && (
                    <p className="mt-1 text-xs">
                      {errors.visitor_email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Téléphone{" "}
                    <span className="font-normal">
                      (optionnel)
                    </span>
                  </label>
                  <input
                    type="tel"
                    {...register("visitor_phone")}
                    className="mt-1 w-full rounded-xl border px-4 py-2.5 outline-none transition"
                    placeholder="0612345678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Message{" "}
                    <span className="font-normal">
                      (optionnel)
                    </span>
                  </label>
                  <textarea
                    {...register("message")}
                    rows={3}
                    className="mt-1 w-full rounded-xl border px-4 py-2.5 outline-none transition"
                  />
                </div>

                <details className="rounded-xl border p-4">
                  <summary className="cursor-pointer text-sm font-medium">
                    Intéressé par un séjour ? (optionnel)
                  </summary>
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium">
                          Date d'arrivée
                        </label>
                        <input
                          type="date"
                          {...register("check_in_date")}
                          className="mt-1 w-full rounded-xl border px-4 py-2.5 outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          Date de départ
                        </label>
                        <input
                          type="date"
                          {...register("check_out_date")}
                          className="mt-1 w-full rounded-xl border px-4 py-2.5 outline-none transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        Nombre de personnes
                      </label>
                      <input
                        type="number"
                        min={1}
                        {...register("guests_count") }
                        className="mt-1 w-full rounded-xl border px-4 py-2.5 outline-none transition"
                        placeholder="2"
                      
                      />
                      {errors.guests_count && (
                        <p className="mt-1 text-xs">
                          {errors.guests_count.message}
                        </p>
                      )}
                    </div>
                  </div>
                </details>

                {submitError && (
                  <div className="rounded-xl p-3 text-sm">
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
                >
                  {isSubmitting && (
                    <Loader2 size={18} className="animate-spin text-orange" />
                  )}
                  {isSubmitting ? "En cours..." : "Confirmer la réservation"}
                </button>
              </form>
            </div>
          )}

          {/* STEP 4 — SUCCESS */}
          {step === 4 && (
            <div className="py-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border">
                <PartyPopper size={28} />
              </div>
              <h2 className="mt-5 text-2xl font-bold">
                Visite réservée !
              </h2>
              <p className="mt-2">
                Rendez-vous le{" "}
                <span className="font-medium">
                  {selectedDate}
                </span>{" "}
                à{" "}
                <span className="font-medium">
                  {selectedSlot?.time_slot}
                </span>
                . Un email de confirmation vous a été envoyé.
              </p>

              <Link
                to={getApartmentsPath(user?.role)}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600"
              >
                Retour à l'appartement
              </Link>
            </div>
          )}
        </div>

        {/* FOOTER NAV — steps 1 and 2 only */}
        {(step === 1 || step === 2) && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={goNext}
              disabled={
                (step === 1 && !selectedDate) || (step === 2 && !selectedSlot)
              }
              className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
            >
              Suivant
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}