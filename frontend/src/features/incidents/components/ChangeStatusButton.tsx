import { useState } from "react";
import { useUpdateIncidentStatus } from "../hooks/useIncidents";
import type { IncidentStatus } from "../types/incident.types";
import { Check, ChevronDown, Loader2 } from "lucide-react";

interface ChangeStatusButtonProps {
  incidentId: string;
  currentStatus: IncidentStatus;
  onStatusChange?: () => void;
}

const STATUS_OPTIONS: { value: IncidentStatus; label: string }[] = [
  { value: "pending", label: "En attente" },
  { value: "in_progress", label: "En cours" },
  { value: "resolved", label: "Résolu" },
];

const STATUS_COLORS: Record<IncidentStatus, string> = {
  pending: "bg-slate-100 text-slate-900 hover:bg-slate-200",
  in_progress: "bg-blue-100 text-blue-700 hover:bg-blue-200",
  resolved: "text-xm bg-green-100 text-green-900 hover:bg-green-200",
};

export default function ChangeStatusButton({
  incidentId,
  currentStatus,
  onStatusChange,
}: ChangeStatusButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const updateStatus = useUpdateIncidentStatus();

  const handleSelect = (newStatus: IncidentStatus) => {
    if (newStatus === currentStatus) {
      setIsOpen(false);
      return;
    }
    updateStatus.mutate(
      { id: incidentId, data: { status: newStatus } },
      {
        onSuccess: () => {
          setIsOpen(false);
          if (onStatusChange) onStatusChange();
        },
      }
    );
  };

  const currentLabel = STATUS_OPTIONS.find((opt) => opt.value === currentStatus)?.label || currentStatus;
  const colorClass = STATUS_COLORS[currentStatus] ;

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={updateStatus.isPending}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 
          py-2 text-xs font-medium transition ${colorClass} disabled:opacity-50`}
      >
        {updateStatus.isPending ? (
          <Loader2 size={12} className="animate-spin" />
        ) : (
          <>
            {currentLabel}
            <ChevronDown size={12} className="opacity-60" />
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute  mt-1 w-90 rounded-xl bg-white py-1 shadow-lg ring-1  z-10">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`flex w-full items-center justify-between px-4 py-2 text-sm transition hover:bg-slate-50 ${
                opt.value === currentStatus ? "text-orange-600" : "text-slate-700"
              }`}
            >
              <span>{opt.label}</span>
              {opt.value === currentStatus && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}