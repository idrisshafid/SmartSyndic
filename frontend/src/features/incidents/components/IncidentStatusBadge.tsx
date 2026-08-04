import type { IncidentStatus } from "../types/incident.types";

interface IncidentStatusBadgeProps {
  status: IncidentStatus;
  className?: string;
}

const STATUS_CONFIG: Record<
  IncidentStatus,
  { label: string; color: string }
> = {
  pending: {
    label: "En attente",
    color: "bg-slate-100 text-slate-700 ring-slate-300",
  },
  in_progress: {
    label: "En cours",
    color: "bg-blue-100 text-blue-700 ring-blue-300",
  },
  resolved: {
    label: "Résolu",
    color: "bg-green-100 text-green-700 ring-green-300",
  },
};

export default function IncidentStatusBadge({
  status,
  className = "",
}: IncidentStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  if (!config) {
    return (
      <span
        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 ${className}`}
      >
        {status}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${config.color} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full mr-1.5 bg-current opacity-60" />
      {config.label}
    </span>
  );
}