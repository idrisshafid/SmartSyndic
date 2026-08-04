import { type PaymentStatus } from "../types/charge.type";

const STATUS_MAP: Record<PaymentStatus, { label: string; color: string }> = {
  pending: { label: "En attente", color: "bg-amber-100 text-amber-800" },
  validated: { label: "Payée", color: "bg-green-100 text-green-800" },
  overdue: { label: "En retard", color: "bg-red-100 text-red-800" },
};

interface ChargeBadgeProps {
  status: PaymentStatus;
  className?: string;
}

export function ChargeBadge({ status, className = "" }: ChargeBadgeProps) {
  const config = STATUS_MAP[status];
  if (!config) {
    return <span className={`px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ${className}`}>{status}</span>;
  }

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium ${config.color} ${className}`}
    >
      {config.label}
    </span>
  );
}