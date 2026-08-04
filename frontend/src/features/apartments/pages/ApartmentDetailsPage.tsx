import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useApartment } from "../hooks/Apartment.hook";
import { useApartmentPhotos } from "../hooks/Useapartmentphotos";
import { useApartmentServices } from "../hooks/Useapartmentservices";
import { getBookingPath, getApartmentsPath } from "@/utils/navigationApartment";
import { useAuthStore } from "@/stores/auth.store";
import {
  ArrowLeft,
  Camera,
  BedDouble,
  Bath,
  Users,
  DoorClosed,
  Maximize,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Home,
  Calendar,
  Share2,
  Heart,
  Sparkles,
  ShieldCheck,
  BadgeCheck,
  Clock,
} from "lucide-react";
import { getEquipmentIcon } from "../components/equipement.constants";

// ============================================================
// Lightbox (inchangé – sans couleurs structurelles)
// ============================================================

interface LightboxProps {
  photos: { id: string; photo_url: string }[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

function Lightbox({ photos, initialIndex, isOpen, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  if (!isOpen || photos.length === 0) return null;
  const current = photos[index];

  const goPrev = () => setIndex((i) => (i - 1 + photos.length) % photos.length);
  const goNext = () => setIndex((i) => (i + 1) % photos.length);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col bg-slate-950/95 
      text-white backdrop-blur-xl select-none"
      onClick={onClose}
    >
      <div
        className="relative flex items-center justify-between border-b border-white/10 px-6 py-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 active:scale-90"
        >
          <X size={20} className="stroke-[2.5]" />
        </button>
        <span className="text-sm font-semibold tracking-wide text-slate-200">
      
          {index + 1} / {photos.length}
        </span>
        <div className="w-10" />
      </div>

      <div
        className="relative flex flex-1 items-center justify-center overflow-hidden px-4 sm:px-20"
        onClick={(e) => e.stopPropagation()}
      >
        {photos.length > 1 && (
          <button
            onClick={goPrev}
            className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-slate-900/80 text-white shadow-2xl backdrop-blur-md transition hover:scale-110 hover:bg-slate-800 active:scale-95 sm:left-8"
          >
            <ChevronLeft size={24} className="stroke-[2.5]" />
          </button>
        )}

        <div className="flex h-full w-full items-center justify-center p-2">
          <img
            key={current.id || index}
            src={current.photo_url}
            alt=""
            className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
          />
        </div>

        {photos.length > 1 && (
          <button
            onClick={goNext}
            className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-slate-900/80 text-white shadow-2xl backdrop-blur-md transition hover:scale-110 hover:bg-slate-800 active:scale-95 sm:right-8"
          >
            <ChevronRight size={24} className="stroke-[2.5]" />
          </button>
        )}
      </div>

      {photos.length > 1 && (
        <div
          className="flex justify-center border-t border-white/10 px-6 py-4 backdrop-blur-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="no-scrollbar flex max-w-4xl gap-3 overflow-x-auto py-1">
            {photos.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setIndex(i)}
                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl transition-all duration-300 ${
                  i === index
                    ? "scale-105 opacity-100 ring-2 ring-orange-500 ring-offset-2 ring-offset-slate-950"
                    : "opacity-40 hover:scale-105 hover:opacity-100"
                }`}
              >
                <img src={p.photo_url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// FactCard (sans couleurs)
// ============================================================

interface FactCardProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  unit?: string;
}

function FactCard({ icon, value, label, unit }: FactCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="group flex items-center gap-4 rounded-2xl border p-4 shadow-sm transition-all duration-300 hover:border-orange-200 hover:shadow-md hover:shadow-orange-500/5"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium">{label}</p>
        <p className="text-lg font-semibold tracking-tight">
          {value}
          {unit && <span className="ml-1 text-sm font-medium">{unit}</span>}
        </p>
      </div>
    </motion.div>
  );
}

// ============================================================
// Main Page
// ============================================================

export default function ApartmentDetailsPage() {
  const { apartmentId } = useParams<{ apartmentId: string }>();
  const user = useAuthStore((state) => state.user);
  const role = user?.role;

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const { data: aptData, isLoading, isError } = useApartment(apartmentId ?? "");
  const apartment = aptData?.data;

  const { data: photosData } = useApartmentPhotos(apartmentId ?? "");
  const photos = photosData?.data ?? [];

  const { data: servicesData } = useApartmentServices(apartmentId ?? "");
  const services = servicesData?.data ?? [];

  const primaryPhoto = photos.find((p) => p.is_primary) || photos[0];
  const secondaryPhotos = photos.filter((p) => p.id !== primaryPhoto?.id).slice(0, 4);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="mx-auto max-w-6xl animate-pulse space-y-8 px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="h-10 w-28 rounded-full" />
            <div className="flex gap-2">
              <div className="h-10 w-10 rounded-full" />
              <div className="h-10 w-10 rounded-full" />
            </div>
          </div>
          <div className="h-8 w-64 rounded-lg" />
       <div className="h-[320px] w-full rounded-[24px]" />
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="h-8 w-1/2 rounded-xl" />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-20 rounded-2xl" />
                ))}
              </div>
              <div className="h-40 rounded-2xl" />
            </div>
            <div className="h-96 rounded-[24px]" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !apartment) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="max-w-md rounded-[24px] border p-10 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl">
            <AlertCircle size={32} />
          </div>
          <h2 className="mt-5 text-2xl font-bold">Apartment not found</h2>
          <p className="mt-2 text-sm">
            The apartment listing you are looking for does not exist or has been removed.
          </p>
          <Link
            to={getApartmentsPath(role)}
            className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-orange-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 active:scale-[0.98]"
          >
            Browse apartments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans antialiased selection:bg-orange-100 selection:text-orange-900">
      {/* Sticky top bar */}
<header className="sticky top-0 z-40 border-b backdrop-blur-xl">
  <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
    <Link
      to={getApartmentsPath(role)}
      className="group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
    >
      <ArrowLeft
        size={16}
        className="transition-transform group-hover:-translate-x-0.5"
      />
      Back
    </Link>

    <div className="flex items-center gap-2">
      <button
        onClick={() => setIsLiked(!isLiked)}
        className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
          isLiked
            ? "border-rose-200 bg-rose-50 text-rose-500"
            : "border-slate-200 text-slate-600 hover:bg-slate-50"
        }`}
      >
        <Heart size={18} className={isLiked ? "fill-current" : ""} />
      </button>

      <button className="flex h-10 w-10 items-center justify-center rounded-full border text-slate-600 transition hover:bg-slate-50">
        <Share2 size={18} />
      </button>
    </div>
  </div>
</header>

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Apartment {apartment.apartment_number}
          </h1>
          <div className="mt-2.5 flex justify-between flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            {apartment.view_type && (
              <span className="inline-flex items-center gap-1.5 font-medium">
                <MapPin size={15} className="text-orange-500" />
                {apartment.view_type}
              </span>
            )}
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${
                apartment.status === "available"
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                  : apartment.status === "occupied"
                  ? "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
                  : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
              }`}
            >
              {apartment.status}
            </span>
          </div>
        </motion.div>

        {/* Hero gallery */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="relative mb-12 overflow-hidden rounded-[24px]"
        >
          {primaryPhoto ? (
            <div className="grid grid-cols-1 gap-1.5 md:h-[460px] md:grid-cols-4 md:grid-rows-2">
              <div
                className={`relative cursor-pointer overflow-hidden ${
                  secondaryPhotos.length > 0
                    ? "h-[280px] md:col-span-2 md:row-span-2 md:h-full"
                    : "h-[360px] md:col-span-4 md:row-span-2 md:h-full"
                }`}
                onClick={() => {
                  setLightboxIndex(0);
                  setLightboxOpen(true);
                }}
              >
                <img
                  src={primaryPhoto.photo_url}
                  alt={apartment.apartment_number}
                  className="h-full w-full object-cover transition duration-700 hover:scale-[1.03]"
                />
              </div>

              {secondaryPhotos.map((photo, i) => (
                <div
                  key={photo.id}
                  className="relative hidden cursor-pointer overflow-hidden md:block"
                  onClick={() => {
                    const originalIndex = photos.findIndex((p) => p.id === photo.id);
                    setLightboxIndex(originalIndex !== -1 ? originalIndex : i + 1);
                    setLightboxOpen(true);
                  }}
                >
                  <img
                    src={photo.photo_url}
                    alt=""
                    className="h-full w-full object-cover transition duration-700 hover:scale-105"
                  />
                  {i === secondaryPhotos.length - 1 && photos.length > 5 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/45">
                      <span className="text-sm font-semibold text-white">
                        +{photos.length - 5} photos
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-72 w-full flex-col items-center justify-center gap-3 rounded-[24px]">
              <Camera size={40} />
              <span className="text-sm font-medium">No photos available</span>
            </div>
          )}

          {photos.length > 0 && (
            <button
              onClick={() => {
                setLightboxIndex(0);
                setLightboxOpen(true);
              }}
              className="absolute bottom-4 right-4 flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold shadow-lg backdrop-blur-sm transition hover:bg-white active:scale-[0.98]"
            >
              <Camera size={16} className="text-orange-500" />
              Show all photos
            </button>
          )}
        </motion.div>

        {/* Content + booking card */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16">
          {/* Left */}
          <div className="space-y-12 lg:col-span-2">
            {/* Specs */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold">What this place offers</h2>
                <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold">
                  <Sparkles size={13} />
                  Premium
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FactCard icon={<Maximize size={18} />} value={apartment.surface || 0} label="Surface" unit="m²" />
                <FactCard icon={<BedDouble size={18} />} value={apartment.bedrooms} label="Bedrooms" />
                <FactCard icon={<Bath size={18} />} value={apartment.bathrooms} label="Bathrooms" />
                <FactCard icon={<DoorClosed size={18} />} value={apartment.rooms} label="Rooms" />
                <FactCard icon={<Users size={18} />} value={apartment.capacity} label="Guests" />
                <FactCard icon={<Home size={18} />} value={apartment.floor ?? 0} label="Floor" />
              </div>
            </motion.section>

            {/* Description */}
            {apartment.description && (
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="border-t pt-12"
              >
                <h2 className="mb-4 text-xl font-bold">About this space</h2>
                <p className="whitespace-pre-wrap text-[15px] leading-relaxed">
                  {apartment.description}
                </p>
              </motion.section>
            )}

            {/* Amenities */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="border-t pt-12"
            >
              <h2 className="mb-5 text-xl font-bold">Amenities</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {services.map((service) => {
                  const Icon = getEquipmentIcon(service.equipment) || Home;
                  return (
                    <div
                      key={service.id}
                      className="flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm font-medium transition hover:border-orange-100"
                    >
                      <Icon size={18} className="shrink-0 text-orange-500" />
                      {service.equipment}
                    </div>
                  );
                })}
                {services.length === 0 && (
                  <p className="text-sm">No amenities listed for this apartment.</p>
                )}
              </div>
            </motion.section>

            {/* Gallery preview */}
            {photos.length > 1 && (
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="border-t pt-12"
              >
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-xl font-bold">Photo gallery</h2>
                  <button
                    onClick={() => {
                      setLightboxIndex(0);
                      setLightboxOpen(true);
                    }}
                    className="text-sm font-semibold text-orange-600 hover:text-orange-700"
                  >
                    View all
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
                  {photos.slice(0, 8).map((photo, index) => (
                    <div
                      key={photo.id}
                      className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl"
                      onClick={() => {
                        setLightboxIndex(index);
                        setLightboxOpen(true);
                      }}
                    >
                      <img
                        src={photo.photo_url}
                        alt=""
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      {photo.is_primary && (
                        <span className="absolute left-2.5 top-2.5 rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide backdrop-blur">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Sticky booking card */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="rounded-[24px] border p-6 shadow-xl shadow-slate-200/60"
            >
              {/* Price */}
              <div className="mb-1 flex items-end gap-1.5">
                <span className="text-3xl font-bold tracking-tight">
                  {apartment.price_per_night}
                </span>
                <span className="mb-1 text-sm font-semibold text-orange-600">MAD</span>
                <span className="mb-1 text-sm">/ night</span>
              </div>

              {/* Trust badges */}
              <div className="mb-5 mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold">
                  <BadgeCheck size={12} />
                  Instant confirmation
                </span>
                <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold">
                  <Clock size={12} />
                  Free cancellation
                </span>
              </div>

              {/* Quick facts */}
              <div className="mb-6 space-y-3 rounded-2xl p-4 text-sm">
                <div className="flex items-center justify-between">
                  <span>Status</span>
                  <span
                    className={`font-semibold capitalize ${
                      apartment.status === "available"
                        ? "text-emerald-600"
                        : apartment.status === "occupied"
                        ? "text-slate-600"
                        : "text-amber-600"
                    }`}
                  >
                    {apartment.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Capacity</span>
                  <span className="font-semibold">{apartment.capacity} guests</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Surface</span>
                  <span className="font-semibold">{apartment.surface || 0} m²</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Floor</span>
                  <span className="font-semibold">{apartment.floor ?? 0}</span>
                </div>
              </div>

              {/* Reserve CTA */}
              <Link
                to={getBookingPath(apartmentId!, role)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 active:scale-[0.98]"
              >
                <Calendar size={16} />
                Reserve
              </Link>

              <p className="mt-3 text-center text-xs">You won’t be charged yet</p>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-xs">
                <ShieldCheck size={13} className="text-emerald-500" />
                Secure booking
              </div>

              <div className="mt-5 border-t pt-5">
                <Link
                  to={getApartmentsPath(role)}
                  className="block w-full rounded-2xl border py-3 text-center text-sm font-medium transition hover:bg-slate-50"
                >
                  Explore other units
                </Link>
              </div>
            </motion.div>
          </aside>
        </div>
      </main>

      <Lightbox
        photos={photos}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}