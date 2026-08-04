import { Clock, Loader2, CalendarX } from "lucide-react";
import { useSlots } from "../hooks/usereservations";
import type { TimeSlot } from "../types/reservations.types";

interface TimeSlotPickerProps {
  apartmentId: string;
  date: string;
  selectedSlot?: TimeSlot | null;
  onSelectSlot: (slot: TimeSlot) => void;
}

export default function TimeSlotPicker({
  apartmentId,
  date,
  selectedSlot,
  onSelectSlot,
}: TimeSlotPickerProps) {

  const { data: slots, isLoading, isError } = useSlots(apartmentId, date);

  const availableSlots = slots?.filter(
    (slot) => slot.is_available
  ) ?? [];


  if (isLoading) {
    return (
      <div className="rounded-2xl border p-6">
        <div className="flex items-center gap-2 text-sm ">
          <Loader2 size={16} className="animate-spin" />
          Chargement des créneaux...
        </div>
      </div>
    );
  }


  if (isError) {
    return (
      <div className="rounded-2xl border border-slate-200  p-6 text-center">
        <p className="text-sm text-red-500">
          Impossible de charger les créneaux.
        </p>
      </div>
    );
  }


  if (availableSlots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border 
      border-dashed border-slate-300  py-10 text-center">
        <CalendarX size={24} className="text-slate-300" />

        <p className="mt-2 text-sm text-slate-500">
          Aucun créneau disponible pour cette date.
        </p>
      </div>
    );
  }


  return (
    <div className="rounded-2xl border border-slate-200 p-5">

      <div className="mb-4 flex items-center gap-2 ">
        <Clock size={16} className="text-orange-500" />

        <h4 className="text-sm font-medium ">
          Créneaux disponibles pour le {date}
        </h4>
      </div>


      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 ">

        {availableSlots.map((slot) => {

          const isSelected =
            selectedSlot?.time_slot === slot.time_slot;


          return (
            <button
              key={slot.time_slot}
              type="button"

              onClick={() => onSelectSlot(slot)}

              className={`rounded-3xl border border-slate-500
                py-3 text-sm font-semibold transition ${
                isSelected
                  ? "border-orange-500 bg-orange-500 text-white shadow-sm"
                  : "border border-slate-600  hover:border-orange-300 hover:bg-orange-50"
              }`}
            >
              {slot.time_slot}
            </button>
          );

        })}

      </div>

    </div>
  );
}