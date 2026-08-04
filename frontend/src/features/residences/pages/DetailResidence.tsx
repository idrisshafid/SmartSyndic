import { useState, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Building2,
  ImageOff,
  ArrowLeft,
  Share2,
  Check,
  BadgeCheck,
  Pencil,
  Trash2,
  ImagePlus,
  ListPlus,
  Plus,
  Home,
  Camera,
  MapPin,
  Search,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Grid,
} from "lucide-react";

import { useResidence, useDeleteResidence } from "../hooks/residence.hook";
import { useResidencePhotos } from "../hooks/useResidencePhotos";
import { useResidenceServices } from "../hooks/useResidenceServices";
import {
  useApartmentsByResidence,
  useDeleteApartment,
} from "@/features/apartments/hooks/Apartment.hook";
import { getAmenityIcon } from "../components/amenities";
import PhotoLightbox from "../components/Photolightbox";
import ResidenceLocationMap from "../components/ResidenceLocationMap";
import ApartmentCard from "@/features/apartments/components/apartmentCard";
import type { Apartment } from "@/features/apartments/types/apartments.types";
import type { Residence } from "../types/residence.types";
import type { ResidenceService } from "../types/residence.types";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface ResidenceHeaderProps {
  residence: Residence;
  onShare: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

interface ResidenceStatsProps {
  apartmentsCount: number;
  servicesCount: number;
  photosCount: number;
  city: string;
}

interface ResidenceSidebarProps {
  residenceId: string;
  onDelete: () => void;
  isDeleting: boolean;
}

interface ResidenceGalleryProps {
  photos: { id: string; photo_url: string; is_primary?: boolean }[];
  onOpenLightbox: (index: number) => void;
}

interface ResidenceAmenitiesProps {
  services: ResidenceService[];
  isLoading: boolean;
  onManage: () => void;
}

interface ResidenceApartmentsSectionProps {
  apartments: Apartment[];
  isLoading: boolean;
  onDeleteApartment: (id: string) => void;
  onAddApartment: () => void;
}

interface SyndicApartmentCardProps {
  apartment: Apartment;
  onDelete: (id: string) => void;
}

// ─── HEADER ──────────────────────────────────────────────────────────────────

function ResidenceHeader({
  residence,
  onShare,
  onEdit,
  onDelete,
  isDeleting,
}: ResidenceHeaderProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-2xl">
              {residence.name}
            </h1>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                residence.is_active
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/15 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20"
                  : "bg-slate-100 text-slate-600 ring-1 ring-slate-500/10 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              <Check size={12} strokeWidth={2.5} />
              {residence.is_active ? "Active" : "Inactive"}
            </span>
          </div>

          <p className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
            <MapPin size={14} className="shrink-0 text-orange-500" />
            <span className="truncate">
              {residence.address}, {residence.city}
            </span>
          </p>

          <div className="flex items-center gap-2 pt-0.5">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <BadgeCheck size={13} className="text-orange-500" />
              Registered since {new Date(residence.created_at).getFullYear()}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
          <button
            onClick={onShare}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Share2 size={14} className="text-slate-400" />
            Share
          </button>
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Pencil size={14} className="text-slate-400" />
            Edit
          </button>
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-medium text-rose-600 transition hover:bg-rose-100 active:scale-[0.98] disabled:opacity-50 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20"
          >
            <Trash2 size={14} />
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── STATS ───────────────────────────────────────────────────────────────────

function ResidenceStats({
  apartmentsCount,
  servicesCount,
  photosCount,
  city,
}: ResidenceStatsProps) {
  const stats = [
    { label: "Apartments", value: apartmentsCount, icon: Building2 },
    { label: "Amenities", value: servicesCount, icon: ListPlus },
    { label: "Photos", value: photosCount, icon: Camera },
    { label: "Location", value: city, icon: MapPin },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="group rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {stat.label}
            </span>
            <div className="rounded-lg bg-orange-50 p-1.5 text-orange-600 transition group-hover:bg-orange-500 group-hover:text-white dark:bg-orange-500/10 dark:text-orange-400">
              <stat.icon size={14} />
            </div>
          </div>
          <p className="mt-2 truncate text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────

function ResidenceSidebar({
  residenceId,
  onDelete,
  isDeleting,
}: ResidenceSidebarProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Management
        </h3>
        <nav className="space-y-1">
          <Link
            to={`/syndic/residences/${residenceId}/edit`}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <Pencil size={15} className="text-slate-400" />
            Edit Residence
          </Link>
          <Link
            to={`/syndic/residences/${residenceId}/photos`}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <ImagePlus size={15} className="text-slate-400" />
            Manage Photos
          </Link>
          <Link
            to={`/syndic/residences/${residenceId}/setup`}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <ListPlus size={15} className="text-slate-400" />
            Manage Amenities
          </Link>
          <Link
            to={`/syndic/residences/${residenceId}/apartments/new`}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-orange-500 px-3 py-2.5 text-sm font-semibold text-white shadow-sm shadow-orange-500/20 transition hover:bg-orange-600 active:scale-[0.98]"
          >
            <Plus size={15} />
            Add Apartment
          </Link>
        </nav>
      </div>

      <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-5 dark:border-rose-500/15 dark:bg-rose-500/5">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-400">
          Danger Zone
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-rose-600/90 dark:text-rose-400/80">
          Deleting this residence permanently removes all associated units and media.
        </p>
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-600 shadow-sm transition hover:bg-rose-50 disabled:opacity-50 dark:border-rose-500/20 dark:bg-slate-900 dark:text-rose-400 dark:hover:bg-rose-500/10"
        >
          <Trash2 size={14} />
          {isDeleting ? "Deleting..." : "Delete Residence"}
        </button>
      </div>
    </div>
  );
}

// ─── GALLERY ─────────────────────────────────────────────────────────────────

function ResidenceGallery({ photos, onOpenLightbox }: ResidenceGalleryProps) {
  if (photos.length === 0) {
    return (
      <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-6 text-center dark:border-slate-700 dark:bg-slate-900/50">
        <div className="rounded-full bg-slate-100 p-3 text-slate-400 dark:bg-slate-800">
          <ImageOff size={22} />
        </div>
        <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-200">
          No photos available
        </p>
        <p className="mt-1 max-w-xs text-xs text-slate-400 dark:text-slate-500">
          Upload media to showcase this residence on the platform.
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-900 shadow-sm dark:border-slate-800">
      <div className="grid grid-cols-1 gap-1 sm:h-[320px] sm:grid-cols-4 sm:grid-rows-2">
        <button
          onClick={() => onOpenLightbox(0)}
          className="group relative h-[220px] overflow-hidden bg-slate-200 sm:col-span-2 sm:row-span-2 sm:h-auto dark:bg-slate-800"
        >
          <img
            src={photos[0].photo_url}
            alt="Main property view"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-slate-900/10 opacity-0 transition group-hover:opacity-100" />
        </button>

        {photos.slice(1, 5).map((photo, index) => {
          const actualIndex = index + 1;
          const isLastVisible = index === 3;
          const remainingCount = photos.length - 5;

          return (
            <button
              key={photo.id}
              onClick={() => onOpenLightbox(actualIndex)}
              className="group relative hidden h-[158px] overflow-hidden bg-slate-200 sm:block dark:bg-slate-800"
            >
              <img
                src={photo.photo_url}
                alt={`Property photo ${actualIndex + 1}`}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-slate-900/10 opacity-0 transition group-hover:opacity-100" />
              {isLastVisible && remainingCount > 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/55 text-sm font-semibold text-white backdrop-blur-[2px]">
                  +{remainingCount} photos
                </div>
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onOpenLightbox(0)}
        className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-lg backdrop-blur-md transition hover:bg-white"
      >
        <Grid size={13} />
        Show all photos ({photos.length})
      </button>
    </div>
  );
}

// ─── AMENITIES ───────────────────────────────────────────────────────────────

function ResidenceAmenities({
  services,
  isLoading,
  onManage,
}: ResidenceAmenitiesProps) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? services : services.slice(0, 8);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-11 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800"
          />
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center dark:border-slate-700">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No amenities registered yet
        </p>
        <button
          onClick={onManage}
          className="mt-2 text-sm font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400"
        >
          Add amenities
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
        {visible.map((service) => {
          const Icon = getAmenityIcon(service.icon_name);
          return (
            <div
              key={service.id}
              className="flex items-center gap-2.5 rounded-xl border border-slate-200/70 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-orange-200 hover:bg-orange-50/40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-orange-500/20 dark:hover:bg-orange-500/5"
            >
              <Icon size={15} className="shrink-0 text-orange-500" />
              <span className="truncate">{service.service_name}</span>
            </div>
          );
        })}
      </div>
      {services.length > 8 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400"
        >
          {showAll ? "Show less" : `Show all ${services.length} amenities`}
          {showAll ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      )}
    </div>
  );
}

// ─── APARTMENTS SECTION ──────────────────────────────────────────────────────

function ResidenceApartmentsSection({
  apartments,
  isLoading,
  onDeleteApartment,
  onAddApartment,
}: ResidenceApartmentsSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return apartments.filter((apt) => {
      const matchesSearch = apt.apartment_number
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || apt.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [apartments, searchTerm, statusFilter]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-56 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800"
          />
        ))}
      </div>
    );
  }

  if (apartments.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-orange-500 dark:bg-orange-500/10">
          <Home size={20} />
        </div>
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          No apartments registered
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Add units to this property to start tracking occupancy.
        </p>
        <button
          onClick={onAddApartment}
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-orange-500/20 transition hover:bg-orange-600"
        >
          <Plus size={14} />
          Add Apartment
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="relative min-w-[200px] flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search apartment unit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border-0 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 outline-none ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-orange-500 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700 dark:placeholder:text-slate-500 dark:focus:bg-slate-800"
          />
        </div>
        <div className="flex items-center gap-2.5">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border-0 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 outline-none ring-1 ring-slate-200 transition focus:bg-white focus:ring-2 focus:ring-orange-500 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
            {filtered.length} / {apartments.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filtered.map((apt) => (
          <SyndicApartmentCard
            key={apt.id}
            apartment={apt}
            onDelete={onDeleteApartment}
          />
        ))}
      </div>
    </div>
  );
}

// ─── APARTMENT CARD WRAPPER ──────────────────────────────────────────────────

function SyndicApartmentCard({
  apartment,
  onDelete,
}: SyndicApartmentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    if (
      !window.confirm(
        `Delete apartment ${apartment.apartment_number}? This cannot be undone.`
      )
    )
      return;
    setIsDeleting(true);
    onDelete(apartment.id);
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-200 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <div className="absolute right-2.5 top-2.5 z-20 flex items-center gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <Link
          to={`/syndic/apartments/${apartment.id}/edit`}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/95 text-slate-700 shadow-sm backdrop-blur-md transition hover:bg-orange-500 hover:text-white dark:bg-slate-800/95 dark:text-slate-200"
          title="Edit Apartment"
        >
          <Pencil size={14} />
        </Link>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/95 text-slate-700 shadow-sm backdrop-blur-md transition hover:bg-rose-500 hover:text-white disabled:opacity-50 dark:bg-slate-800/95 dark:text-slate-200"
          title="Delete Apartment"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <ApartmentCard apartment={apartment} />
    </div>
  );
}

// ─── SKELETON ────────────────────────────────────────────────────────────────

function ResidenceDetailSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50/50 px-4 py-5 dark:bg-slate-950 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="h-4 w-32 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <div className="h-32 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-[320px] animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-20 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
                />
              ))}
            </div>
          </div>
          <div className="h-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────

export default function SyndicResidenceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useResidence(id ?? "");
  const { data: photosData } = useResidencePhotos(id ?? "");
  const { data: servicesData, isLoading: servicesLoading } =
    useResidenceServices(id ?? "");
  const {
    data: apartmentsData,
    isLoading: apartmentsLoading,
    refetch: refetchApartments,
  } = useApartmentsByResidence(id ?? "");

  const deleteResidence = useDeleteResidence();
  const deleteApartment = useDeleteApartment();

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!id) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <p className="text-sm font-medium text-rose-500">
          Residence identity not provided.
        </p>
      </div>
    );
  }

  if (isLoading) return <ResidenceDetailSkeleton />;

  if (isError || !data?.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <AlertCircle size={36} className="mx-auto text-rose-500" />
          <h2 className="mt-3 text-base font-semibold text-slate-800 dark:text-slate-200">
            Couldn&apos;t load residence details
          </h2>
        </div>
      </div>
    );
  }

  const residence = data.data;
  const photos = photosData?.data ?? [];
  const services = servicesData?.data ?? [];
  const apartments = apartmentsData?.data ?? [];

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/residences/${id}`
      );
      alert("Link copied to clipboard!");
    } catch {
      // ignore
    }
  };

  const handleDeleteResidence = () => {
    if (
      !window.confirm(
        "Delete this residence and all its data? This cannot be undone."
      )
    )
      return;
    deleteResidence.mutate(id, {
      onSuccess: () => navigate("/syndic/my-residences"),
    });
  };

  const handleDeleteApartment = (apartmentId: string) => {
    deleteApartment.mutate(
      { id: apartmentId, residenceId: id! },
      { onSuccess: () => refetchApartments() }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-10 transition-colors dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
        {/* Back */}
        <Link
          to="/syndic/my-residences"
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <ArrowLeft size={15} />
          Back to residences
        </Link>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main */}
          <div className="space-y-6 lg:col-span-2">
            <ResidenceHeader
              residence={residence}
              onShare={handleShare}
              onEdit={() => navigate(`/syndic/residences/${id}/edit`)}
              onDelete={handleDeleteResidence}
              isDeleting={deleteResidence.isPending}
            />

            {/* Gallery */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                  Property Media
                </h2>
                <Link
                  to={`/syndic/residences/${id}/photos`}
                  className="text-sm font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400"
                >
                  Manage Gallery
                </Link>
              </div>
              <ResidenceGallery
                photos={photos}
                onOpenLightbox={(index: number) => setLightboxIndex(index)}
              />
            </section>

            <ResidenceStats
              apartmentsCount={apartments.length}
              servicesCount={services.length}
              photosCount={photos.length}
              city={residence.city}
            />

            {/* Apartments */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                  Apartment Units
                </h2>
                <Link
                  to={`/syndic/residences/${id}/apartments/new`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm shadow-orange-500/20 transition hover:bg-orange-600"
                >
                  <Plus size={13} />
                  Add Unit
                </Link>
              </div>
              <ResidenceApartmentsSection
                apartments={apartments}
                isLoading={apartmentsLoading}
                onDeleteApartment={handleDeleteApartment}
                onAddApartment={() =>
                  navigate(`/syndic/residences/${id}/apartments/new`)
                }
              />
            </section>

            {/* Amenities */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                  Services & Amenities
                </h2>
                <Link
                  to={`/syndic/residences/${id}/setup`}
                  className="text-sm font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400"
                >
                  Manage Amenities
                </Link>
              </div>
              <ResidenceAmenities
                services={services}
                isLoading={servicesLoading}
                onManage={() => navigate(`/syndic/residences/${id}/setup`)}
              />
            </section>

            {/* Description */}
            {residence.description && (
              <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
                <h2 className="mb-2 text-base font-semibold text-slate-900 dark:text-slate-50">
                  About this Property
                </h2>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {residence.description}
                </p>
              </section>
            )}

            {/* Map */}
            {residence.latitude != null && residence.longitude != null && (
              <section className="space-y-3">
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                  Map Location
                </h2>
                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <ResidenceLocationMap
                    latitude={residence.latitude}
                    longitude={residence.longitude}
                    className="h-60 w-full"
                  />
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-20">
              <ResidenceSidebar
                residenceId={id}
                onDelete={handleDeleteResidence}
                isDeleting={deleteResidence.isPending}
              />
            </div>
          </aside>
        </div>
      </div>

      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={photos}
          currentIndex={lightboxIndex}
          isOpen={true}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
          residenceName={residence.name}
        />
      )}
    </div>
  );
}