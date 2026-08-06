import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  Pin,
  PinOff,
  Loader2,
  Building2,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useQueries } from "@tanstack/react-query";

import { useResidences } from "@/features/residences/hooks/residence.hook";
import { useOwnerResidence } from "@/features/announcements/hooks/useAnnouncements";
import { useAuthStore } from "@/stores/auth.store";
import {
  useDeleteAnnouncement,
  useToggleAnnouncementPin,
  ANNOUNCEMENT_KEYS,
} from "../hooks/useAnnouncements";
import { getAnnouncements } from "../services/announcements.service";
import type { Announcement } from "../types/announcement.types";

// ─── Helper ──────────────────────────────────────────────────────────────────

const formatDate = (date: string) =>
  format(new Date(date), "dd MMM yyyy", { locale: fr });

// ─── Composant principal ────────────────────────────────────────────────────

export default function AnnouncementsPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const isSyndic = user?.role === "syndic";
  const isOwner = user?.role === "owner";
  const canManage = isSyndic; // seul le syndic peut créer/modifier/supprimer/épingler

  // ─── 1. Récupération des résidences selon le rôle ──────────────────────

  // Syndic : liste des résidences
  const {
    data: residencesData,
    isLoading: residencesLoading,
    isError: residencesError,
  } = useResidences();

  // Propriétaire : résidence unique
  const {
    data: ownerResidence,
    isLoading: ownerResidenceLoading,
    isError: ownerResidenceError,
  } = useOwnerResidence(user?.role === "owner" ? user.id : "");

  // ─── 2. Construction de la liste des résidences ─────────────────────────

  const residences = useMemo(() => {
    if (isSyndic) {
      return residencesData?.data?.residences ?? [];
    }
    if (isOwner && ownerResidence) {
      return [
        {
          id: ownerResidence,
        },
      ];
    }
    return [];
  }, [isSyndic, isOwner, residencesData, ownerResidence]);

  // ─── 3. Récupération des annonces de chaque résidence ──────────────────

  const announcementQueries = useQueries({
    queries: residences.map((res) => ({
      queryKey: ANNOUNCEMENT_KEYS.byResidence(res.id),
      queryFn: () => getAnnouncements(res.id),
      enabled: !!res.id,
      staleTime: 60 * 1000,
    })),
  });

  // ─── 4. Combinaison et tri ──────────────────────────────────────────────

  const allAnnouncements = useMemo(() => {
    const flat: Announcement[] = [];
    for (const query of announcementQueries) {
      if (query.data?.data) {
        flat.push(...query.data.data);
      }
    }
    return flat.sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [announcementQueries]);

  // ─── 5. Résidence name map (uniquement pour le syndic) ──────────────────

  const residenceNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    // Seul le syndic a accès aux résidences complètes (avec nom)
    const residencesFull = residencesData?.data?.residences ?? [];
    for (const res of residencesFull) {
      map[res.id] = res.name;
    }
    return map;
  }, [residencesData]);

  // ─── 6. Mutations ──────────────────────────────────────────────────────────

  const deleteMutation = useDeleteAnnouncement();
  const togglePinMutation = useToggleAnnouncementPin();

  const handleDelete = (id: string) => {
    if (!window.confirm("Supprimer cette annonce définitivement ?")) return;
    deleteMutation.mutate(id);
  };

  const handleTogglePin = (id: string) => {
    togglePinMutation.mutate(id);
  };

  const handleEdit = (id: string) => {
    navigate(`/syndic/announcements/${id}/edit`);
  };

  // ─── 7. États de chargement / erreur ────────────────────────────────────

  const isLoading =
    (isSyndic && residencesLoading) ||
    (isOwner && ownerResidenceLoading) ||
    announcementQueries.some((q) => q.isLoading);

  const hasError =
    (isSyndic && residencesError) ||
    (isOwner && ownerResidenceError) ||
    announcementQueries.some((q) => q.isError);

  // ─── 8. Accès interdit (rôle inconnu) ───────────────────────────────────

  if (user && !isSyndic && !isOwner) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <AlertCircle size={48} className="text-red-500" />
        <h2 className="text-xl font-semibold">Accès refusé</h2>
        <p className="max-w-sm text-sm text-slate-500">
          Vous n'avez pas les permissions nécessaires pour consulter cette page.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <Loader2 size={32} className="animate-spin text-orange-500" />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="mx-4 flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border border-red-200 bg-red-50/50 p-6 sm:p-12 text-center">
        <AlertCircle size={40} className="text-red-500" />
        <h2 className="mt-4 text-base sm:text-lg font-semibold text-red-700">
          Impossible de charger les annonces
        </h2>
        <p className="mt-2 text-sm text-red-600">
          Une erreur est survenue. Veuillez réessayer.
        </p>
      </div>
    );
  }

  // ─── 9. États vides ──────────────────────────────────────────────────────

  if (residences.length === 0) {
    return (
      <div className="mx-4 flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border-2 border-dashed border-slate-300 py-10 sm:py-16 px-4 text-center">
        <Building2 size={48} className="text-slate-400" />
        <h2 className="mt-4 text-lg sm:text-xl font-semibold text-slate-800">
          {isSyndic ? "Aucune résidence" : "Aucune résidence associée"}
        </h2>
        <p className="mt-2 max-w-sm text-sm">
          {isSyndic
            ? "Vous ne gérez aucune résidence. Créez-en une avant de publier une annonce."
            : "Vous ne possédez pas encore d’appartement, ou aucune résidence n’est rattachée à vos biens."}
        </p>
        {isSyndic && (
          <Link
            to="/syndic/residences/create"
            className="mt-6 w-full sm:w-auto rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 text-center"
          >
            Créer une résidence
          </Link>
        )}
      </div>
    );
  }

  // ─── 10. Rendu principal ─────────────────────────────────────────────────

  return (
    <div className="min-h-screen py-4 sm:py-6 lg:py-8">
      <div className="mx-auto max-w-5xl px-3 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="mb-5 sm:mb-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Annonces
            </h1>
            <p className="mt-1 text-sm">
              {allAnnouncements.length} annonce
              {allAnnouncements.length > 1 ? "s" : ""}
            </p>
          </div>

          {canManage && (
            <Link
              to="/syndic/announcements/new"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-orange-200/50 transition hover:bg-orange-600 hover:shadow-orange-300/50"
            >
              <Plus size={18} />
              Nouvelle annonce
            </Link>
          )}
        </div>

        {allAnnouncements.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border-2 border-dashed border-slate-300 py-10 sm:py-16 px-4 text-center">
            <p className="text-sm">Aucune annonce pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {allAnnouncements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                // ✅ Affiche le nom de la résidence uniquement si l'utilisateur est syndic
                residenceName={
                  isSyndic ? residenceNameMap[announcement.residence_id] || "" : undefined
                }
                onDelete={handleDelete}
                onTogglePin={handleTogglePin}
                onEdit={handleEdit}
                isDeleting={deleteMutation.isPending && deleteMutation.variables === announcement.id}
                isToggling={togglePinMutation.isPending && togglePinMutation.variables === announcement.id}
                canManage={canManage}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Carte d’annonce ────────────────────────────────────────────────────────

interface AnnouncementCardProps {
  announcement: Announcement;
  residenceName?: string;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onEdit: (id: string) => void;
  isDeleting: boolean;
  isToggling: boolean;
  canManage: boolean;
}

function AnnouncementCard({
  announcement,
  residenceName,
  onDelete,
  onTogglePin,
  onEdit,
  isDeleting,
  isToggling,
  canManage,
}: AnnouncementCardProps) {
  const { id, title, content, is_pinned, created_at } = announcement;

  return (
    <div
      className={`group rounded-xl sm:rounded-2xl border border-slate-200 p-3.5 sm:p-5 shadow-sm transition hover:shadow-md ${
        is_pinned ? "border-orange-300" : ""
      }`}
    >
      {/* Stack on phone: content then actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-3">
        <div className="min-w-0 flex-1">
          {/* Badges + date — wrap fully visible */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {is_pinned && (
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 sm:px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-orange-700">
                <Pin size={12} className="shrink-0" />
                Épinglée
              </span>
            )}
            {residenceName && (
              <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-slate-100 px-2 sm:px-2.5 py-0.5 text-[11px] sm:text-xs font-medium text-slate-700">
                <Building2 size={12} className="shrink-0" />
                <span className="truncate">{residenceName}</span>
              </span>
            )}
            <span className="text-xs sm:text-sm text-slate-500">
              {formatDate(created_at)}
            </span>
          </div>

          <h3 className="mt-2 sm:mt-3 text-base sm:text-lg font-semibold break-words">
            {title}
          </h3>
          <p className="mt-1.5 sm:mt-2 text-sm break-words whitespace-pre-wrap sm:line-clamp-3">
            {content}
          </p>
        </div>

        {canManage && (
          <div className="flex shrink-0 items-center gap-1 border-t border-slate-100 pt-2 sm:border-0 sm:pt-0">
            <button
              onClick={() => onTogglePin(id)}
              disabled={isToggling}
              className="rounded-full p-2.5 sm:p-2 transition hover:bg-slate-100 hover:text-slate-700"
              title={is_pinned ? "Désépingler" : "Épingler"}
            >
              {isToggling ? (
                <Loader2 size={16} className="animate-spin" />
              ) : is_pinned ? (
                <PinOff size={16} />
              ) : (
                <Pin size={16} />
              )}
            </button>

            <button
              onClick={() => onEdit(id)}
              className="rounded-full p-2.5 sm:p-2 transition hover:bg-slate-100 hover:text-orange-600"
              title="Modifier"
            >
              <Pencil size={16} />
            </button>

            <button
              onClick={() => onDelete(id)}
              disabled={isDeleting}
              className="rounded-full p-2.5 sm:p-2 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              title="Supprimer"
            >
              {isDeleting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Trash2 size={18} className="text-red-500 sm:h-[22px] sm:w-[22px]" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}