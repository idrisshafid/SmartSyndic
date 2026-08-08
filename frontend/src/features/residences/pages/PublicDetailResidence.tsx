import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  MapPin,
  Building2,
  ImageOff,
  ArrowLeft,
  Images,
  Share2,
  Check,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Sparkles,
  Home,
} from "lucide-react";

import { useResidence } from "../hooks/residence.hook";
import { useResidencePhotos } from "../hooks/useResidencePhotos";
import { useResidenceServices } from "../hooks/useResidenceServices";
import { getAmenityIcon } from "../components/amenities";
import PhotoLightbox from "../components/Photolightbox";
import ResidenceLocationMap from "../components/ResidenceLocationMap";
import { useApartmentsByResidence } from "@/features/apartments/hooks/Apartment.hook";
import ApartmentCard from "@/features/apartments/components/apartmentCard";
import { useAuthStore } from "@/stores/auth.store";
import { getResidencesPath } from "@/utils/ResidenceNavigation";
import { getApartmentDetailPath } from "@/utils/navigationApartment";

const AMENITIES_PREVIEW_COUNT = 6;

export default function ResidenceDetailPage() {
  const { id } = useParams();

  const { data, isLoading, isError } = useResidence(id ?? "");
  const { data: photosData, isLoading: photosLoading } = useResidencePhotos(id ?? "");
  const { data: servicesData, isLoading: servicesLoading } = useResidenceServices(id ?? "");
  const { data: apartmentsData, isLoading: apartmentsLoading } = useApartmentsByResidence(id ?? "");

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [copied, setCopied] = useState(false);

  const user = useAuthStore((state) => state.user);
  const detailPath = getResidencesPath(user?.role);

  if (!id) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-2xl border">
        <div className="flex items-center gap-2 text-base font-medium">
          <AlertCircle size={20} />
          <span>Residence ID not specified.</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-5 w-36 animate-pulse rounded" />
          <div className="h-10 w-28 animate-pulse rounded-xl" />
        </div>
        <div className="h-10 w-1/2 animate-pulse rounded-xl" />
        <div className="grid h-[420px] w-full grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-3xl">
          <div className="col-span-2 row-span-2 animate-pulse" />
          <div className="animate-pulse" />
          <div className="animate-pulse" />
          <div className="animate-pulse" />
          <div className="animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-3xl border p-6 text-center">
        <div className="space-y-2">
          <AlertCircle size={36} className="mx-auto" />
          <h2 className="text-lg font-semibold">
            Couldn&apos;t load this residence
          </h2>
          <p className="text-sm">
            Please check your connection or try again later.
          </p>
        </div>
      </div>
    );
  }

  const residence = data.data;
  const photos = photosData?.data ?? [];
  const services = servicesData?.data ?? [];
  const apartments = apartmentsData?.data ?? [];

  const heroPhoto = photos[0];
  const listedYear = new Date(residence.created_at).getFullYear();
  const visibleAmenities = showAllAmenities
    ? services
    : services.slice(0, AMENITIES_PREVIEW_COUNT);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/residences/${id}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
  <div className="w-full space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="space-y-3">
        <Link
          to={detailPath}
          className="inline-flex items-center gap-2 text-sm font-semibold transition justify-center text-center"
        >
          <ArrowLeft size={16} />
          Back to all residences
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {residence.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
              <span className="flex items-center gap-1 font-medium underline">
                <MapPin size={16} />
                {residence.address}, {residence.city}, Morocco
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-medium">
                <BadgeCheck size={16} />
                Listed in {listedYear}
              </span>
              <span>•</span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                  residence.is_active ? "border-emerald-200" : "border-slate-200"
                }`}
              >
                <Check size={13} strokeWidth={3} />
                {residence.is_active ? "Active Property" : "Inactive"}
              </span>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-xl   text-white
             bg-orange-500 border  px-4 py-2 text-sm font-semibold
              shadow-sm transition hover:bg-green-600 active:scale-95"
          >
            {copied ? (
              <Check size={16} className="text-white" />
            ) : (
              <Share2 size={18}className="text-white " />
            )}
            {copied ? "Link Copied" : "Share"}
          </button>
        </div>
      </div>

      {/* Gallery */}
      <div className="relative">
        {photosLoading ? (
          <div className="grid h-[400px] w-full grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-3xl">
            <div className="col-span-2 row-span-2 animate-pulse" />
            <div className="animate-pulse" />
            <div className="animate-pulse" />
            <div className="animate-pulse" />
            <div className="animate-pulse" />
          </div>
        ) : photos.length === 0 ? (
          <div className="flex h-64 w-full flex-col items-center justify-center rounded-3xl border border-dashed">
            <ImageOff size={32} />
            <p className="mt-2 text-sm font-medium">
              No photos available for this property yet.
            </p>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-3xl">
            {photos.length === 1 && (
              <button
                onClick={() => setLightboxIndex(0)}
                className="group relative block h-[420px] w-full overflow-hidden"
              >
                <img
                  src={heroPhoto.photo_url}
                  alt={residence.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </button>
            )}

            {photos.length === 2 && (
              <div className="grid h-[420px] grid-cols-2 gap-2 overflow-hidden">
                {photos.map((photo, index) => (
                  <button
                    key={photo.id}
                    onClick={() => setLightboxIndex(index)}
                    className="group relative overflow-hidden"
                  >
                    <img
                      src={photo.photo_url}
                      alt={residence.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            )}

            {photos.length === 3 && (
              <div className="grid h-[420px] grid-cols-2 grid-rows-2 gap-2 overflow-hidden">
                <button
                  onClick={() => setLightboxIndex(0)}
                  className="group relative row-span-2 overflow-hidden"
                >
                  <img
                    src={heroPhoto.photo_url}
                    alt={residence.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </button>
                {photos.slice(1).map((photo, index) => (
                  <button
                    key={photo.id}
                    onClick={() => setLightboxIndex(index + 1)}
                    className="group relative overflow-hidden"
                  >
                    <img
                      src={photo.photo_url}
                      alt={residence.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            )}

            {photos.length === 4 && (
              <div className="grid h-[420px] grid-cols-3 grid-rows-2 gap-2 overflow-hidden">
                <button
                  onClick={() => setLightboxIndex(0)}
                  className="group relative col-span-2 row-span-2 overflow-hidden"
                >
                  <img
                    src={heroPhoto.photo_url}
                    alt={residence.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </button>
                {photos.slice(1).map((photo, index) => (
                  <button
                    key={photo.id}
                    onClick={() => setLightboxIndex(index + 1)}
                    className="group relative overflow-hidden"
                  >
                    <img
                      src={photo.photo_url}
                      alt={residence.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            )}

            {photos.length >= 5 && (
              <div className="grid h-[420px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden">
                <button
                  onClick={() => setLightboxIndex(0)}
                  className="group relative col-span-2 row-span-2 overflow-hidden"
                >
                  <img
                    src={heroPhoto.photo_url}
                    alt={residence.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </button>
                {photos.slice(1, 5).map((photo, index) => (
                  <button
                    key={photo.id}
                    onClick={() => setLightboxIndex(index + 1)}
                    className="group relative overflow-hidden"
                  >
                    <img
                      src={photo.photo_url}
                      alt={residence.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            )}

            {photos.length > 1 && (
              <button
                onClick={() => setLightboxIndex(0)}
                className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold shadow-md transition hover:bg-slate-100 active:scale-95"
              >
                <Images size={16} />
                Show all {photos.length} photos
              </button>
            )}
          </div>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-8 lg:col-span-2">
          {/* About */}
          <div className="border-b pb-8">
            <h2 className="text-xl font-bold">About this residence</h2>
            <p className="mt-3 text-base leading-relaxed">
              {residence.description ??
                "No detailed description has been provided for this residence yet."}
            </p>
          </div>

          {/* Amenities */}
          <div className="border-b pb-8">
            <h2 className="mb-4 text-xl font-bold">What this place offers</h2>

            {servicesLoading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="h-12 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : services.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-6 text-center">
                <p className="text-sm font-medium">No amenities listed for this residence.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {visibleAmenities.map((service) => {
                    const Icon = getAmenityIcon(service.icon_name);
                    return (
                      <div
                        key={service.id}
                        className="flex items-center gap-3.5 rounded-2xl border p-4 shadow-sm"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                          <Icon size={20} />
                        </div>
                        <span className="text-base font-medium">
                          {service.service_name}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {services.length > AMENITIES_PREVIEW_COUNT && (
                  <button
                    onClick={() => setShowAllAmenities((v) => !v)}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold transition hover:bg-slate-900 hover:text-white"
                  >
                    {showAllAmenities ? (
                      <>
                        Show less amenities <ChevronUp size={16} />
                      </>
                    ) : (
                      <>
                        Show all {services.length} amenities <ChevronDown size={16} />
                      </>
                    )}
                  </button>
                )}
              </>
            )}
          </div>

          {/* Apartments */}
          <div className="border-b pb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Available Apartments</h2>
              <span className="rounded-full px-3 py-1 text-xs font-semibold">
                {apartments.length} {apartments.length === 1 ? "unit" : "units"}
              </span>
            </div>

            {apartmentsLoading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[1, 2].map((item) => (
                  <div key={item} className="h-56 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : apartments.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-8 text-center">
                <Building2 size={32} className="mx-auto" />
                <p className="mt-3 text-sm font-medium">
                  No apartments available under this residence right now.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {apartments.map((apartment) => (
                  <ApartmentCard
                    key={apartment.id}
                    apartment={apartment}
                    to={getApartmentDetailPath(apartment.id, user?.role)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Location */}
          {residence.latitude != null && residence.longitude != null && (
            <div>
              <h2 className="text-xl font-bold">Where you&apos;ll be</h2>
              <p className="mt-1 mb-4 text-sm font-medium">
                {residence.address}, {residence.city}, Morocco
              </p>
              <div className="overflow-hidden rounded-3xl border shadow-sm">
                <ResidenceLocationMap
                  latitude={residence.latitude}
                  longitude={residence.longitude}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 rounded-3xl border p-6 shadow-xl">
            <div className="border-b pb-4">
              <h3 className="text-lg font-bold">Property Overview</h3>
              <p className="mt-1 text-xs">Real-time residence details</p>
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Active Status</span>
                <span className={`font-semibold ${residence.is_active ? "" : ""}`}>
                  {residence.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium">
                  <Images size={16} /> Photos
                </span>
                <span className="font-bold">{photos.length}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium">
                  <Sparkles size={16} /> Amenities
                </span>
                <span className="font-bold">{services.length}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium">
                  <Home size={16} /> Total Apartments
                </span>
                <span className="font-bold">{apartments.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PhotoLightbox
        photos={photos}
        currentIndex={lightboxIndex ?? 0}
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
        residenceName={residence.name}
      />
    </div>
  );
}