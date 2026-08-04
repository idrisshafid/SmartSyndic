import { useState, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isToday,
  isPast,
  isSameDay,
  addMonths,
  subMonths,
  isAfter,
} from "date-fns";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { useCalendar } from "../hooks/usereservations";

interface AvailabilityCalendarProps {
  apartmentId: string;
  selectedDate?: string | null;
  onSelectDate: (date: string) => void;
}

export default function AvailabilityCalendar({
  apartmentId,
  selectedDate,
  onSelectDate,
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const {
    data: availabilityData,
    isLoading,
    isError,
    error,
    refetch,
  } = useCalendar(apartmentId);

  // ─── Build map of available dates ───
  const availableMap = useMemo(() => {
  const map = new Map<string, boolean>();

  if (!availabilityData) return map;

  availabilityData.forEach((day) => {
    const key = format(new Date(day.appointment_date), "yyyy-MM-dd");

    map.set(key, Number(day.slots_remaining) > 0);
  });

  return map;
}, [availabilityData]);

  // ─── Generate days for the month grid ───
  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const allDays = eachDayOfInterval({ start, end });
    const firstDayOfWeek = getDay(start);
    const emptyCells = Array.from({ length: firstDayOfWeek }, () => null);
    return [...emptyCells, ...allDays];
  }, [currentMonth]);

  const goToPrevMonth = () => setCurrentMonth((prev) => subMonths(prev, 1));
  const goToNextMonth = () => {
    const maxMonth = addMonths(new Date(), 12);
    if (isAfter(addMonths(currentMonth, 1), maxMonth)) return;
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  const isPastDate = (date: Date) => isPast(date) && !isToday(date);

  const handleDayClick = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
  const isAvailable = availableMap.get(dateStr) === true;
    if (isAvailable && !isPastDate(date)) {
      onSelectDate(dateStr);
    }
  };

  const isSelectable = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const isAvail = availableMap.get(dateStr) ?? false;
    return isAvail && !isPastDate(date);
  };

  // ─── Loading ───
  if (isLoading) {
    return (
      <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200/60">
        <div className="mb-2 flex items-center justify-between">
          <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
          <div className="flex gap-1">
            <div className="h-6 w-6 animate-pulse rounded bg-slate-200" />
            <div className="h-6 w-6 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
            <div key={d} className="py-1 text-center text-[10px] font-medium text-slate-500">
              {d}
            </div>
          ))}
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  // ─── Error ───
  if (isError) {
    return (
      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200/60">
        <div className="flex flex-col items-center justify-center py-4 text-center">
          <AlertCircle size={24} className="text-red-400" />
          <p className="mt-1 text-xs text-slate-600">
            {error instanceof Error ? error.message : "Impossible de charger les disponibilités"}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-2 rounded-lg bg-orange-500 px-4 py-1 text-xs font-semibold text-white hover:bg-orange-600"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w1/2 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200/60">
      {/* ─── Header ─── */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-900">
          {format(currentMonth, "MMMM yyyy")}
        </span>
        <div className="flex items-center gap-0.5">
          <button
            onClick={goToPrevMonth}
            className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={goToNextMonth}
            className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* ─── Day names ─── */}
      <div className="grid grid-cols-7 gap-0.5">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
          <div key={day} className="py-1 text-center text-[14px] font-medium text-slate-500">
            {day}
          </div>
        ))}
      </div>

      {/* ─── Days ─── */}
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((day, index) => {
          if (!day) return <div key={`empty-${index}`} className="aspect-square" />;

          const dateStr = format(day, "yyyy-MM-dd");
          const isAvailable = availableMap.get(dateStr) ?? false;
          const isSelected = selectedDate ? isSameDay(day, new Date(selectedDate)) : false;
          const isTodayDate = isToday(day);
          const isPastDay = isPastDate(day);
          const selectable = isSelectable(day);

          let classes =
            "aspect-square w-1/2 flex items-center justify-center rounded text-xs font-medium transition-all";

          if (isPastDay) {
            classes += " bg-slate-100 text-slate-400 cursor-not-allowed";
          } else if (!isAvailable) {
            classes += " bg-slate-200 text-slate-500 cursor-not-allowed";
          } else if (isSelected) {
            classes += " bg-orange-500 text-white ring-2 ring-orange-300 shadow-sm";
          } else {
            classes += " bg-emerald-500 text-white hover:bg-emerald-600 cursor-pointer";
          }

          if (isTodayDate && !isSelected && !isPastDay && isAvailable) {
            classes += " ring-2 ring-orange-400";
          }

          return (
            <button
              key={dateStr}
              onClick={() => handleDayClick(day)}
              disabled={!selectable}
              className={classes}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>

      {/* ─── Mini legend ─── */}
      <div className="mt-2 flex items-center justify-center gap-3 border-t border-slate-100 pt-2 text-[10px] text-slate-500">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
          Free
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-slate-200" />
          Full
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-slate-100" />
          Past
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-orange-500" />
          Selected
        </span>
      </div>
    </div>
  );
}