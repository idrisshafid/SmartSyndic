import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  User,
  Users,
  Tag,
  AlertCircle,
  Loader2,
  Edit,
  Camera,
  Image,
  X,
  ChevronLeft,
  ChevronRight,
  Building2,
  Home,
  Clock,
  FileText,
  MessageSquare,
  Activity,
  Hash,
  AlertTriangle,
  Flame,
  Shield,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useIncident } from "../hooks/useIncidents";
import { useIncidentPhotos, useUploadIncidentPhoto } from "../hooks/useIncidentPhotos";
import { useIncidentComments } from "../hooks/useIncidentComments";
import { useIncidentHistory } from "../hooks/useIncidentHistory";
import IncidentStatusBadge from "../components/IncidentStatusBadge";
import ChangeStatusButton from "../components/ChangeStatusButton";
import IncidentTimeline from "../components/IncidentTimeline";
import CommentThread from "../components/CommentThread";
import { useResidence } from "@/features/residences/hooks/residence.hook";
import { useApartment } from "@/features/apartments/hooks/Apartment.hook";
import { useUser } from "@/features/auth/hooks/useAuth";
import { incidentNavigation } from "@/utils/navigationincident";
import { useAuthStore } from "@/stores/auth.store";

// ─── Lightbox ──────────────────────────────────────────────────────────────

function PhotoLightbox({
  photos,
  initialIndex,
  isOpen,
  onClose,
}: {
  photos: { id: string; photo_url: string }[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  if (!isOpen || photos.length === 0) return null;
  const current = photos[index];
  const goPrev = () => setIndex((i) => (i - 1 + photos.length) % photos.length);
  const goNext = () => setIndex((i) => (i + 1) % photos.length);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col bg-[#0F172A]/96 backdrop-blur-xl"
      onClick={onClose}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <span className="text-sm font-medium text-white/60">
          {index + 1} / {photos.length}
        </span>
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <X size={22} />
        </button>
      </div>

      <div
        className="relative flex flex-1 items-center justify-center px-4"
        onClick={(e) => e.stopPropagation()}
      >
        {photos.length > 1 && (
          <button
            onClick={goPrev}
            className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:scale-105 hover:bg-white/20"
          >
            <ChevronLeft size={22} />
          </button>
        )}
        <img
          src={current.photo_url}
          alt=""
          className="max-h-[78vh] max-w-full rounded-2xl object-contain shadow-2xl"
        />
        {photos.length > 1 && (
          <button
            onClick={goNext}
            className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:scale-105 hover:bg-white/20"
          >
            <ChevronRight size={22} />
          </button>
        )}
      </div>

      <div className="flex justify-center gap-2.5 overflow-x-auto border-t border-white/10 px-6 py-4">
        {photos.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setIndex(i)}
            className={`h-14 w-14 shrink-0 overflow-hidden rounded-xl transition ${
              i === index
                ? "ring-2 ring-[#F97316] ring-offset-2 ring-offset-[#0F172A]"
                : "opacity-40 hover:opacity-100"
            }`}
          >
            <img src={p.photo_url} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Skeleton ──────────────────────────────────────────────────────────────

function DetailsSkeleton() {
  return (
    <div className="min-h-screen pb-24">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 h-4 w-40 animate-pulse rounded-lg" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-3xl border p-8 shadow-sm">
              <div className="h-9 w-3/4 animate-pulse rounded-xl" />
              <div className="mt-5 flex gap-2">
                <div className="h-7 w-24 animate-pulse rounded-full" />
                <div className="h-7 w-20 animate-pulse rounded-full" />
              </div>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-[72px] animate-pulse rounded-2xl" />
                ))}
              </div>
            </div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-44 animate-pulse rounded-3xl border"
              />
            ))}
          </div>
          <div className="h-80 animate-pulse rounded-3xl border" />
        </div>
      </div>
    </div>
  );
}

// ─── Priority badge ────────────────────────────────────────────────────────

function PriorityBadge({ priority }: { priority?: string }) {
  const config = useMemo(() => {
    switch (priority) {
      case "urgent":
        return {
          label: "Urgent",
          icon: Flame,
          className: "bg-red-50 text-[#EF4444] ring-red-100",
        };
      case "high":
        return {
          label: "High",
          icon: AlertTriangle,
          className: "bg-orange-50 text-[#F97316] ring-orange-100",
        };
      case "normal":
        return {
          label: "Normal",
          icon: Shield,
          className: "bg-blue-50 text-[#3B82F6] ring-blue-100",
        };
      case "low":
        return {
          label: "Low",
          icon: Shield,
          className: "bg-slate-100 text-[#64748B] ring-slate-200",
        };
      default:
        return {
          label: priority ?? "—",
          icon: Tag,
          className: "bg-slate-100 text-[#64748B] ring-slate-200",
        };
    }
  }, [priority]);

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize shadow-sm ring-1 ring-inset ${config.className}`}
    >
      <Icon size={12} />
      {config.label}
    </span>
  );
}

// ─── Meta tile ──────────────────────────────────────────────────────────────

function MetaTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="group flex items-start gap-3.5 rounded-2xl border p-4 transition hover:border-orange-200">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-sm ring-1 transition group-hover:bg-[#F97316] group-hover:text-white group-hover:ring-[#F97316]">
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider">
          {label}
        </p>
        <p className="mt-1 truncate text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

// ─── Section ───────────────────────────────────────────────────────────────

function SectionCard({
  icon: Icon,
  title,
  action,
  children,
}: {
  icon: React.ElementType;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-3xl border p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)] sm:p-7"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2.5 text-[15px] font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-50 text-[#F97316]">
            <Icon size={15} />
          </span>
          {title}
        </h2>
        {action}
      </div>
      {children}
    </motion.section>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────

export default function IncidentDetailPage() {
  const user = useAuthStore((state) => state.user);
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: incident, isLoading, isError } = useIncident(id ?? "");
  const { data: photos, isLoading: photosLoading } = useIncidentPhotos(id ?? "");
  const { data: comments } = useIncidentComments(id ?? "");
  const { data: history, isLoading: historyLoading } = useIncidentHistory(id ?? "");
  const uploadPhoto = useUploadIncidentPhoto();

  const { data: residence, isLoading: residenceLoading } = useResidence(
    incident?.residence_id ?? ""
  );
  const { data: apartment, isLoading: apartmentLoading } = useApartment(
    incident?.apartment_id ?? ""
  );
  const { data: declaredByUser, isLoading: declaredByLoading } = useUser(
    incident?.declared_by ?? ""
  );
  const { data: assignedToUser, isLoading: assignedToLoading } = useUser(
    incident?.assigned_to ?? ""
  );

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;
    setIsUploading(true);
    try {
      await uploadPhoto.mutateAsync({ incidentId: id, file });
      queryClient.invalidateQueries({ queryKey: ["incident-photos", id] });
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleStatusChange = () => {
    queryClient.invalidateQueries({ queryKey: ["incident", id] });
  };

  if (isLoading) return <DetailsSkeleton />;

  if (isError || !incident) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-[#EF4444]">
          <AlertCircle size={32} />
        </div>
        <h2 className="mt-5 text-2xl font-bold">Incident introuvable</h2>
        <p className="mt-2 max-w-sm text-sm">
          L&apos;incident que vous recherchez n&apos;existe pas ou a été supprimé.
        </p>
        <Link
          to={incidentNavigation.list(user?.role)}
          className="mt-7 rounded-2xl bg-[#F97316] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-[#EA580C]"
        >
          Retour aux incidents
        </Link>
      </div>
    );
  }

  const formattedDate = (date: Date) =>
    format(new Date(date), "dd/MM/yyyy 'à' HH:mm", { locale: fr });

  const residenceName = residence?.data?.name || "Résidence inconnue";
  const apartmentNumber = apartment?.data?.apartment_number || "N/A";
  const declaredByName = declaredByUser
    ? `${declaredByUser.first_name} ${declaredByUser.last_name}`
    : declaredByLoading
    ? "Chargement…"
    : "Inconnu";
  const assignedToName = assignedToUser
    ? `${assignedToUser.first_name} ${assignedToUser.last_name}`
    : assignedToLoading
    ? "Chargement…"
    : incident.assigned_to
    ? "Inconnu"
    : "Non assigné";

  return (
    <div className="min-h-screen pb-24">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            to={incidentNavigation.list(user?.role)}
            className="group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-sm transition hover:border-[#CBD5E1]"
          >
            <ArrowLeft
              size={15}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Retour aux incidents
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-mono text-xs shadow-sm">
            <Hash size={12} className="text-[#F97316]" />
            {incident.id.slice(0, 8)}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-3xl border p-7 shadow-[0_1px_3px_rgba(15,23,42,0.04)] sm:p-8"
            >
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div className="min-w-0 max-w-2xl space-y-4">
                  <h1 className="text-3xl font-bold tracking-tight sm:text-[2rem] sm:leading-tight">
                    {incident.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <IncidentStatusBadge status={incident.status} />
                    <PriorityBadge priority={incident.priority} />
                    {incident.type && (
                      <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset">
                        <Tag size={12} />
                        {incident.type}
                      </span>
                    )}
                  </div>
                </div>
             {user?.role === "owner" && (
                <Link
                  to={incidentNavigation.edit(incident.id, user?.role)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#F97316] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-[#EA580C] active:scale-[0.98]"
                >
                  <Edit size={15} />
                  Modifier
                </Link>)}
              </div>

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <MetaTile icon={User} label="Déclaré par" value={declaredByName} />
                <MetaTile icon={Users} label="Assigné à" value={assignedToName} />
                <MetaTile
                  icon={Building2}
                  label="Résidence"
                  value={residenceLoading ? "Chargement…" : residenceName}
                />
                {incident.apartment_id && (
                  <MetaTile
                    icon={Home}
                    label="Appartement"
                    value={
                      apartmentLoading
                        ? "Chargement…"
                        : `Appartement ${apartmentNumber}`
                    }
                  />
                )}
                <MetaTile
                  icon={Calendar}
                  label="Créé le"
                  value={formattedDate(incident.created_at)}
                />
                {incident.resolved_at && (
                  <MetaTile
                    icon={Clock}
                    label="Résolu le"
                    value={formattedDate(incident.resolved_at)}
                  />
                )}
              </div>
            </motion.div>

            {/* Description */}
            <SectionCard icon={FileText} title="Description">
              <p className="whitespace-pre-wrap text-[15px] leading-[1.75]">
                {incident.description}
              </p>
            </SectionCard>

            {/* Photos */}
            <SectionCard
              icon={Image}
              title={`Photos (${photos?.length || 0})`}
              action={
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-orange-50 px-3.5 py-2 text-xs font-semibold text-[#F97316] transition hover:bg-orange-100">
                  <Camera size={13} />
                  Ajouter
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  {isUploading && <Loader2 size={12} className="animate-spin" />}
                </label>
              }
            >
              {photosLoading ? (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="aspect-square animate-pulse rounded-2xl"
                    />
                  ))}
                </div>
              ) : !photos || photos.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-12 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm ring-1">
                    <Image size={22} />
                  </div>
                  <p className="mt-3 text-sm font-semibold">Aucune photo</p>
                  <p className="mt-1 max-w-xs text-xs">
                    Ajoutez des images pour documenter l&apos;incident
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {photos.map((photo, index) => (
                    <motion.button
                      key={photo.id}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      className="group relative aspect-square overflow-hidden rounded-2xl shadow-sm ring-1"
                      onClick={() => {
                        setLightboxIndex(index);
                        setLightboxOpen(true);
                      }}
                    >
                      <img
                        src={photo.photo_url}
                        alt=""
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-[#0F172A]/0 transition group-hover:bg-[#0F172A]/15" />
                    </motion.button>
                  ))}
                </div>
              )}
            </SectionCard>

            {/* Activity */}
            <SectionCard icon={Activity} title="Activité">
              {historyLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 animate-pulse rounded-2xl" />
                  ))}
                </div>
              ) : (
                <IncidentTimeline history={history ?? []} />
              )}
            </SectionCard>

            {/* Comments */}
            <SectionCard
              icon={MessageSquare}
              title={`Commentaires (${comments?.length || 0})`}
            >
              <CommentThread
                comments={comments ?? []}
                incidentId={incident.id}
                currentUserId=""
              />
            </SectionCard>
          </div>

          {/* Sticky sidebar */}
          <aside className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="sticky top-8 space-y-5"
            >
              
              <div className="rounded-3xl border p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.08em]">
                  Actions rapides
                </h3>
                  
                <div className="mt-5 space-y-2.5">
                  {user?.role === "syndic" && (

                  <ChangeStatusButton
                    incidentId={incident.id}
                    currentStatus={incident.status}
                    onStatusChange={handleStatusChange} 
                  /> 
                  )}

                    {user?.role === "owner" && (
                  <Link
                    to={incidentNavigation.edit(incident.id, user?.role)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#F97316] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-[#EA580C] active:scale-[0.98]"
                  >
                    <Edit size={15} />
                    Modifier l&apos;incident
                  </Link> )}
                  {user?.role === "owner" && (
                  <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition hover:border-orange-200">
                    <Camera size={15} className="text-[#F97316]" />
                    Ajouter une photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>  )}

                  <Link
                    to={incidentNavigation.list(user?.role)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition hover:bg-[#F8FAFC]"
                  >
                    <ArrowLeft size={15} />
                    Retour à la liste
                  </Link>
                </div>

                <div className="mt-6 space-y-2 border-t pt-5 text-xs">
                  <p className="flex items-center gap-1.5 font-mono">
                    <Hash size={12} className="text-[#F97316]" />
                    {incident.id}
                  </p>
                  <p>Créé : {formattedDate(incident.created_at)}</p>
                  {incident.updated_at && (
                    <p>Mis à jour : {formattedDate(incident.updated_at)}</p>
                  )}
                </div>
              </div>
            </motion.div>
          </aside>
        </div>

        <PhotoLightbox
          photos={photos ?? []}
          initialIndex={lightboxIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      </div>
    </div>
  );
}