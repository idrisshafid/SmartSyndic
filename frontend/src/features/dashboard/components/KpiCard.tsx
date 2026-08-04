import { ArrowUp, ArrowDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ValueFormat = "number" | "currency";

interface KpiCardProps {
  icon: LucideIcon;
  label: string;
  // Accepts string too — see the note in dashboard.types.ts about
  // node-postgres returning COUNT()/SUM() as strings.
  value: number | string;
  format?: ValueFormat;
  // A secondary line under the value, e.g. "12 disponibles" — for
  // context that doesn't need its own card.
  subLabel?: string;
  // Percentage change vs a previous period. Omit entirely when there's
  // no real comparison data to back it — don't fabricate a number here.
  delta?: number;
  deltaLabel?: string;
  isLoading?: boolean;
}

function formatValue(value: number | string, format: ValueFormat): string {
  const numeric = typeof value === "string" ? Number(value) : value;

  if (Number.isNaN(numeric)) {
    // Defensive fallback — better to show the raw value than "NaN" if
    // the backend ever sends something unexpected.
    return String(value);
  }

  if (format === "currency") {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      maximumFractionDigits: 0,
    }).format(numeric);
  }

  return new Intl.NumberFormat("fr-FR").format(numeric);
}

export default function KpiCard({
  icon: Icon,
  label,
  value,
  format = "number",
  subLabel,
  delta,
  deltaLabel = "vs mois dernier",
  isLoading = false,
}: KpiCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 p-5">
        <div className="h-9 w-9 animate-pulse rounded-full " />
        <div className="mt-4 h-3 w-20 animate-pulse rounded " />
        <div className="mt-2 h-7 w-16 animate-pulse rounded " />
      </div>
    );
  }

  const hasDelta = delta != null && !Number.isNaN(delta);
  const isPositive = hasDelta && delta! >= 0;

  return (
    <div className="rounded-2xl border border-slate-200  p-5 transition hover:shadow-md">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50">
        <Icon size={17} className="text-orange-500" />
      </div>

      <p className="mt-4 text-sm font-medium ">{label}</p>
      <p className="mt-1 text-2xl font-bold ">
        {formatValue(value, format)}
      </p>

      {(subLabel || hasDelta) && (
        <div className="mt-2 flex items-center gap-2">
          {subLabel && <span className="text-xs text-slate-400">{subLabel}</span>}
          {hasDelta && (
            <span
              className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPositive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
              {Math.abs(delta!)}% {deltaLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}