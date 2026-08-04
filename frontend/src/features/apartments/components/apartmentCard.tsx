import { Link } from "react-router-dom";
import {
  BedDouble,
  Bath,
  Users,
  Maximize,
  ImageOff,
  MapPin,
  Star,
} from "lucide-react";

import { useApartmentPhotos } from "../hooks/Useapartmentphotos";
import type { Apartment } from "../types/apartments.types";
import { useAuthStore } from "@/stores/auth.store";
import { getApartmentDetailPath } from "@/utils/ResidenceNavigation";

interface ApartmentCardProps {
  apartment: Apartment;
  to?: string; // optional override
}

const STATUS_STYLES: Record<
  Apartment["status"],
  { dot: string; bg: string; text: string; label: string }
> = {
  available: {
    dot: "bg-emerald-500 ring-emerald-500/20",
    bg: "bg-emerald-50/90",
    text: "text-emerald-700",
    label: "Disponible",
  },
  occupied: {
    dot: "bg-slate-400 ring-slate-400/20",
    bg: "bg-slate-100/90",
    text: "text-slate-600",
    label: "Occupé",
  },
  maintenance: {
    dot: "bg-amber-500 ring-amber-500/20",
    bg: "bg-amber-50/90",
    text: "text-amber-700",
    label: "Maintenance",
  },
};

export default function ApartmentCard({ apartment, to }: ApartmentCardProps) {
  const user = useAuthStore((state) => state.user);
  const { data, isLoading } = useApartmentPhotos(apartment.id);
  const photos = data?.data ?? [];
  const coverPhoto = photos.find((p) => p.is_primary) ?? photos[0];

  const statusInfo = STATUS_STYLES[apartment.status];
  const detailPath = to ?? getApartmentDetailPath(user?.role, apartment.id);

  return (
    <Link
      to={detailPath}
      className="group flex flex-col overflow-hidden
       rounded-2xl  border-2 border-orange-500 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] transition-all duration-300
        hover:-translate-y-1 hover:shadow-[0_12px_30px_-8px_rgba(0,0,0,0.12)] hover:shadow-orange-200/20"
    >
      {/* ===== Image Container ===== */}
      <div className="relative aspect-[5/4] w-full overflow-hidden">
        {isLoading ? (
          <div className="h-full w-full animate-pulse" />
        ) : coverPhoto ? (
          <>
            <img
              src={coverPhoto.photo_url}
              alt={`Apartment ${apartment.apartment_number}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Gradient overlay – keep for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent opacity-60" />
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2">
            <ImageOff size={32} />
            <span className="text-xs font-medium">Aucune photo</span>
          </div>
        )}

        {/* ===== Status Badge (top‑left) ===== */}
        <div
          className={`absolute top-3 left-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md ${statusInfo.bg} ${statusInfo.text} shadow-sm border border-white/40`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ring-2 ${statusInfo.dot}`} />
          {statusInfo.label}
        </div>

        {/* ===== Featured Badge (top‑right) ===== */}
        {coverPhoto?.is_primary && (
          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-amber-600 shadow-sm backdrop-blur-sm border border-white/40">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            Vedette
          </div>
        )}

        {/* ===== Floor badge (bottom‑right) ===== */}
        {apartment.floor !== undefined && (
          <div className="absolute bottom-3 right-3 rounded-md text-slate-900 bg-white px-2 
           py-0.5 text-[14px] font-semibold backdrop-blur-sm shadow-sm border border-white/40">
            Étage {apartment.floor}
          </div>
        )}
      </div>

      {/* ===== Card Body ===== */}
      <div className="flex flex-1 flex-col justify-between p-4">
        {/* Header: Apartment Number + View */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-bold transition-colors group-hover:text-orange-600">
              Appartement {apartment.apartment_number}
            </h3>
          </div>
          {apartment.view_type && (
            <p className="mt-0.5 flex items-center gap-1 text-xs font-medium">
              <MapPin size={13} className="text-orange-500 shrink-0" />
              {apartment.view_type}
            </p>
          )}
        </div>

        {/* Features Row */}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-medium">
          <span className="flex items-center gap-1">
            <BedDouble size={14} className="text-slate-400" />
            {apartment.bedrooms} {apartment.bedrooms === 1 ? "ch." : "ch."}
          </span>
          <span className="flex items-center gap-1">
            <Bath size={14} className="text-slate-400" />
            {apartment.bathrooms} {apartment.bathrooms === 1 ? "sdb" : "sdb"}
          </span>
          <span className="flex items-center gap-1">
            <Users size={14} className="text-slate-400" />
            {apartment.capacity} {apartment.capacity === 1 ? "pers." : "pers."}
          </span>
          {apartment.surface && (
            <span className="flex items-center gap-1">
              <Maximize size={14} className="text-slate-400" />
              {apartment.surface} m²
            </span>
          )}
        </div>

        {/* Footer: Price per night */}
        {apartment.price_per_night != null && (
          <div className="mt-3 flex items-baseline justify-between border-t pt-3">
            <span className="text-[10px] font-medium uppercase tracking-wider">
              Prix / nuit
            </span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-lg font-extrabold">
                {apartment.price_per_night}
              </span>
              <span className="text-[11px] font-bold text-orange-600">MAD</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}