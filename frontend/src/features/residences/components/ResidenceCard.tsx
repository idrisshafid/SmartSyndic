import { Link } from "react-router-dom";
import { MapPin, ImageOff } from "lucide-react";

import { useResidencePhotos } from "../hooks/useResidencePhotos";
import type { Residence } from "../types/residence.types";
import { useAuthStore } from "@/stores/auth.store";
import { getResidenceDetailPath } from "@/utils/ResidenceNavigation";

interface ResidenceCardProps {
  residence: Residence;
  to?: string; // optional override
}

export default function ResidenceCard({ residence, to }: ResidenceCardProps) {
  const user = useAuthStore((state) => state.user);
  const { data, isLoading } = useResidencePhotos(residence.id);
  const coverPhoto = data?.data?.[0];

  // If `to` prop is provided, use it; otherwise build path based on user role
  const detailPath = to ?? getResidenceDetailPath(user?.role, residence.id);

  return (
    <Link to={detailPath} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
        {isLoading ? (
          <div className="h-full w-full animate-pulse bg-slate-200" />
        ) : coverPhoto ? (
          <img
            src={coverPhoto.photo_url}
            alt={residence.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageOff size={26} className="text-slate-300" />
          </div>
        )}

        <span
          className={`absolute top-3 right-3 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-md ${
            residence.is_active
              ? "bg-white/90 text-green-700"
              : "bg-white/90 text-slate-500"
          }`}
        >
          {residence.is_active ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="mt-3 mx-1">
        <h2 className="truncate font-semibold text-slate-900">
          {residence.name}
        </h2>
        <div className="mt-1.5 flex items-center gap-1 justify-center text-slate-650 mb-1">
          <MapPin size={13} />
          <span className="truncate">{residence.city}</span>
        </div>
        <p className="mt-0.9 truncate text-sm text-slate-600">
          {residence.address}
        </p>
      </div>
    </Link>
  );
}