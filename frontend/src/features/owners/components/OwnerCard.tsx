import { Link } from "react-router-dom";
import { MapPin, Phone, Building2, ChevronRight, Loader2 } from "lucide-react";
import { useOwnerApartments } from "../hooks/owner.hooks";
import type { Owner } from "../types/owner.types";

interface OwnerCardProps {
  owner: Owner;
}

export default function OwnerCard({ owner }: OwnerCardProps) {
  const { data, isLoading } = useOwnerApartments(owner.id);
  const apartments = data?.data ?? [];

  const initials = `${owner.first_name?.[0] ?? ""}${owner.last_name?.[0] ?? ""}`.toUpperCase();
  const displayName = `${owner.first_name} ${owner.last_name}`.trim();

  return (
    <div className="group rounded-2xl p-6 shadow-sm border transition-all 
    hover:-translate-y-1 hover:shadow-xl">
      {/* Avatar + Name */}
      <div className="flex items-start gap-4 p-2 rounded-2xl border-2 border-orange-500">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold">
          {initials || "?"}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold">
            {displayName || "Unnamed Owner"}
          </h3>
          <p className="truncate text-sm">{owner.email}</p>
        </div>
      </div>

      {/* Details */}
      <div className="mt-4 space-y-1.5 text-sm">
        {owner.country && (
          <div className="flex items-center gap-2">
            <MapPin size={14} />
            <span>{owner.country}</span>
          </div>
        )}
        {owner.phone && (
          <div className="flex items-center gap-2">
            <Phone size={14} />
            <span>{owner.phone}</span>
          </div>
        )}
      </div>

      {/* Apartments Section */}
      <div className="mt-4 rounded-xl border-2 border-slate-800 p-2">
        <div className="flex items-center gap-2 text-xs font-medium ">
          <Building2 size={14} />
          <span>Linked Apartments</span>
        </div>
        {isLoading ? (
          <div className="mt-2 flex items-center gap-2">
            <Loader2 size={14} className="animate-spin" />
            <span className="text-xs">Loading...</span>
          </div>
        ) : apartments.length === 0 ? (
          <span className="mt-2 inline-block text-xs">None assigned</span>
        ) : (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {apartments.slice(0, 4).map((apt) => (
              <span
                key={apt.id}
                className="rounded-full px-2.5 py-0.5 text-xs font-medium"
              >
                {apt.apartment_number}
              </span>
            ))}
            {apartments.length > 4 && (
              <span className="rounded-full px-2.5 py-0.5 text-xs font-medium">
                +{apartments.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action */}
      <Link
        to={`/syndic/owners/${owner.id}`}
        className="mt-5 flex w-full items-center justify-between rounded-xl bg-orange-500 text-white
         border px-4 py-2.5 text-sm font-medium transition hover:border-orange-200
          hover:bg-orange-50 hover:text-orange-600"
      >
        <span>View Details</span>
        <ChevronRight
          size={16}
          className="transition-transform group-hover:translate-x-0.5"
        />
      </Link>
    </div>
  );
}