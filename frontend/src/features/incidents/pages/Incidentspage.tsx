import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useIncidents, useDeleteIncident } from "../hooks/useIncidents";
import IncidentStatusBadge from "../components/IncidentStatusBadge";
import type { IncidentPriority, IncidentStatus, IncidentFilters, Incident } from "../types/incident.types";
import {
  Plus,
  AlertCircle,
  Loader2,
  Calendar,
  Tag,
  ChevronRight,
  Trash2,
} from "lucide-react";

import { incidentNavigation } from "@/utils/navigationincident";
import { useAuthStore } from "@/stores/auth.store";

// ─── Statistics summary ──────────────────────────────────────────────────────
function StatsSummary({ incidents }: { incidents: Incident[] }) {
  const total = incidents.length;
  const pending = incidents.filter((i) => i.status === "pending").length;
  const inProgress = incidents.filter((i) => i.status === "in_progress").length;
  const resolved = incidents.filter((i) => i.status === "resolved").length;
  const urgent = incidents.filter((i) => i.priority === "urgent").length;

  const stats = [
    { label: "Total", value: total, bg: "bg-slate-100" },
    { label: "En attente", value: pending, bg: "bg-orange-100" },
    { label: "En cours", value: inProgress, bg: "bg-blue-100" },
    { label: "Résolus", value: resolved, bg: "bg-green-100" },
    { label: "Urgents", value: urgent, bg: "bg-red-100" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`rounded-xl px-4 py-3 text-center ring-1 ring-black/5 ${stat.bg}`}
        >
          <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-700">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── Skeleton ──────────────────────────────────────────────────────────────
function IncidentsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-2xl border p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <div className="h-5 w-3/4 animate-pulse rounded" />
                <div className="flex gap-2">
                  <div className="h-6 w-16 animate-pulse rounded-full" />
                  <div className="h-6 w-16 animate-pulse rounded-full" />
                </div>
                <div className="h-4 w-full animate-pulse rounded" />
                <div className="h-4 w-2/3 animate-pulse rounded" />
                <div className="flex gap-3">
                  <div className="h-3 w-20 animate-pulse rounded" />
                  <div className="h-3 w-20 animate-pulse rounded" />
                </div>
              </div>
              <div className="h-8 w-8 animate-pulse rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function IncidentsPage() {
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<IncidentPriority | "all">("all");
  const [residenceFilter, setResidenceFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);

  const filters = useMemo<Partial<IncidentFilters>>(() => {
    const f: Partial<IncidentFilters> = {};
    if (statusFilter !== "all") f.status = statusFilter;
    if (priorityFilter !== "all") f.priority = priorityFilter;
    if (residenceFilter !== "all") f.residence_id = residenceFilter;
    return f;
  }, [statusFilter, priorityFilter, residenceFilter]);

  const { data: incidentsData, isLoading, isError, error, refetch } = useIncidents(filters);
  const deleteIncident = useDeleteIncident();

  const incidents = incidentsData;

  const filteredIncidents = useMemo(() => {
    if (!incidents) return [];
    if (!searchQuery.trim()) return incidents;
    const q = searchQuery.trim().toLowerCase();
    return incidents.filter(
      (inc) =>
        inc.title.toLowerCase().includes(q) ||
        inc.description.toLowerCase().includes(q)
    );
  }, [incidents, searchQuery]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet incident ? Cette action est irréversible.")) return;
    setDeletingId(id);
    try {
      await deleteIncident.mutateAsync(id);
      refetch();
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen">
      {/* ─── Header ─── */}
      <div className="border-b sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Incidents</h1>
              <p className="mt-0.5 text-sm">
                {isLoading
                  ? "Chargement..."
                  : `${filteredIncidents.length} incident${
                      filteredIncidents.length > 1 ? "s" : ""
                    }`}
              </p>
            </div>
            {user?.role === "owner" && (
            <Link
              to={incidentNavigation.create(user?.role)}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-orange-200/50 transition hover:bg-orange-600 hover:shadow-orange-300/50 active:scale-95"
            >
              <Plus size={18} />
              Déclarer un incident
            </Link> )         }
          </div>  
          {/* ─── Statistics ─── */}
          {!isLoading && !isError && filteredIncidents.length > 0 && (
            <div className="mt-4">
              <StatsSummary incidents={filteredIncidents} />
            </div>
          )}
        </div>
      </div>

      {/* ─── Content ─── */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <IncidentsSkeleton />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border py-16 text-center">
            <AlertCircle size={40} />
            <h2 className="mt-3 text-lg font-semibold">
              Impossible de charger les incidents
            </h2>
            <p className="mt-1 text-sm">
              {error instanceof Error ? error.message : "Erreur inconnue"}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-4 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 active:scale-95"
            >
              Réessayer
            </button>
          </div>
        ) : filteredIncidents.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed py-20 text-center">
            <AlertCircle size={40} />
            <h2 className="mt-4 text-xl font-semibold">Aucun incident</h2>
            <p className="mt-1 max-w-sm text-sm">
              {searchQuery || statusFilter !== "all" || priorityFilter !== "all" || residenceFilter !== "all"
                ? "Aucun incident ne correspond à vos filtres."
                : "Aucun incident n'a encore été signalé."}
            </p>
            {(searchQuery || statusFilter !== "all" || priorityFilter !== "all" || residenceFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setPriorityFilter("all");
                  setResidenceFilter("all");
                }}
                className="mt-4 text-sm font-medium text-orange-600 hover:underline"
              >
                Effacer tous les filtres
              </button>
            )}
            {user?.role==="owner" && (
            <Link
              to={incidentNavigation.create(user?.role)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 
              px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600
               active:scale-95"
            >
              <Plus size={18} />
              Déclarer le premier incident
            </Link>    )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredIncidents.map((incident) => (
              <div
                key={incident.id}
                className="group rounded-2xl border p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <Link
                    to={incidentNavigation.detail(incident.id, user?.role)}
                    className="min-w-0 flex-1"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-base font-semibold transition group-hover:text-orange-600">
                        {incident.title}
                      </h3>
                      <IncidentStatusBadge status={incident.status} />
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          incident.priority === "urgent"
                            ? "bg-red-100 text-red-700"
                            : incident.priority === "high"
                            ? "bg-orange-100 text-orange-700"
                            : incident.priority === "normal"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {incident.priority}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm">
                      {incident.description}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                      {incident.type && (
                        <span className="flex items-center gap-1">
                          <Tag size={12} />
                          {incident.type}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(incident.created_at).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </Link>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(incident.id)}
                      disabled={deletingId === incident.id}
                      className="rounded-full p-1.5 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      title="Supprimer"
                    >
                      {deletingId === incident.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={22} className="text-red-500" />
                      )}
                    </button>
                    <ChevronRight
                      size={20}
                      className="transition group-hover:translate-x-0.5 group-hover:text-orange-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}