import { useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCircle,
  CheckCheck,
  AlertCircle,
  Calendar,
  Megaphone,
  CreditCard,
  Loader2,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import {
  useNotifications,
  useUnreadCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
  useDeleteAllNotifications,
} from "../hooks/useNotifications";
import type { Notification } from "../types/notification.types";
import { useAuthStore } from "@/stores/auth.store";

// ─── Helper ──────────────────────────────────────────────────────────────────

const formatDate = (date: Date | string) =>
  format(new Date(date), "dd MMM yyyy 'à' HH:mm", { locale: fr });

const getTypeIcon = (type?: string) => {
  switch (type) {
    case "payment":
      return CreditCard;
    case "incident":
      return AlertCircle;
    case "reservation":
      return Calendar;
    case "announcement":
      return Megaphone;
    default:
      return Bell;
  }
};

const getTypeColor = (type?: string) => {
  switch (type) {
    case "payment":
      return "bg-emerald-100 text-emerald-700";
    case "incident":
      return "bg-red-100 text-red-700";
    case "reservation":
      return "bg-blue-100 text-blue-700";
    case "announcement":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

// ─── Composant principal ────────────────────────────────────────────────────

export default function NotificationsPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { data: notifications, isLoading, isError } = useNotifications();
  const { data: unreadCountData } = useUnreadCount();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const deleteNotification = useDeleteNotification();
  const deleteAllNotifications = useDeleteAllNotifications();

  const unreadCount = unreadCountData?.unread ?? 0;

  // ─── Base path selon le rôle ──────────────────────────────────────────────
  const basePath = user?.role === "syndic" ? "/syndic" : user?.role === "owner" ? "/owner" : "";

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleMarkRead = (id: string) => {
    markRead.mutate(id);
  };

  const handleMarkAllRead = () => {
    if (unreadCount === 0) return;
    markAllRead.mutate();
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Supprimer cette notification définitivement ?")) return;
    deleteNotification.mutate(id);
  };

  const handleDeleteAll = () => {
    if (!window.confirm("Supprimer toutes les notifications définitivement ?")) return;
    deleteAllNotifications.mutate();
  };

  const handleNotificationClick = (notification: Notification) => {
    // Marquer comme lu si pas déjà fait
    if (!notification.is_read) {
      markRead.mutate(notification.id!);
    }

    // Navigation si référence existe
    if (notification.reference_id && notification.reference_type) {
      const routes: Record<string, string> = {
        incident: `/${user.role}/incidents/${notification.reference_id}`,
        reservation: `${basePath}/reservations/${notification.reference_id}`,
        payment: `${basePath}/charges/${notification.reference_id}`,
        announcement: `${basePath}/announcements/`,
      };
      const path = routes[notification.reference_type];
      if (path) {
        navigate(path);
      }
    }
  };

  // ─── États de chargement / erreur ────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-orange-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-red-200 bg-red-50/50 p-12 text-center">
        <AlertCircle size={40} className="text-red-500" />
        <h2 className="mt-4 text-lg font-semibold text-red-700">
          Impossible de charger les notifications
        </h2>
        <p className="mt-2 text-sm text-red-600">
          Une erreur est survenue. Veuillez réessayer.
        </p>
      </div>
    );
  }

  const notificationsList = notifications?.data ?? [];

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* En‑tête */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Bell className="h-7 w-7 text-orange-500" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Notifications
              </h1>
              <p className="text-sm text-slate-500">
                {notificationsList.length} notification{notificationsList.length > 1 ? "s" : ""}
                {unreadCount > 0 && ` · ${unreadCount} non lue${unreadCount > 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Bouton Supprimer tout */}
            {notificationsList.length > 0 && (
              <button
                onClick={handleDeleteAll}
                disabled={deleteAllNotifications.isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 hover:text-red-700 disabled:opacity-50"
              >
                {deleteAllNotifications.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={23} className="text-red-500"/>
                )}
                Supprimer tout
              </button>
            )}

            {/* Bouton Tout marquer comme lu */}
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={markAllRead.isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:opacity-50"
              >
                {markAllRead.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <CheckCheck size={16} />
                )}
                Tout marquer comme lu
              </button>
            )}
          </div>
        </div>

        {/* Liste des notifications */}
        {notificationsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 py-16 text-center">
            <Bell size={48} className="text-slate-300" />
            <p className="mt-4 text-sm text-slate-500">
              Aucune notification pour le moment.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notificationsList.map((notification) => {
              const Icon = getTypeIcon(notification.type);
              const typeColor = getTypeColor(notification.type);
              const isUnread = !notification.is_read;

              return (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`group flex cursor-pointer items-start gap-4 rounded-2xl border p-4 shadow-sm transition hover:shadow-md ${
                    isUnread
                      ? "border-orange-200 bg-orange-50/30"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100">
                    <Icon
                      size={18}
                      className={
                        isUnread ? "text-orange-500" : "text-slate-400"
                      }
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-slate-900">
                        {notification.title}
                      </h3>
                      {!isUnread && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                          <CheckCircle size={12} />
                          Lu
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${typeColor}`}
                      >
                        {notification.type || "Général"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      {notification.message}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {formatDate(notification.created_at!)}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    {/* Bouton Marquer comme lu */}
                    {isUnread && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkRead(notification.id!);
                        }}
                        disabled={markRead.isPending}
                        className="rounded-full p-1.5 text-slate-400 transition hover:bg-orange-100 hover:text-orange-600 disabled:opacity-50"
                        title="Marquer comme lu"
                      >
                        {markRead.isPending && markRead.variables === notification.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <CheckCircle size={14} />
                        )}
                      </button>
                    )}

                    {/* Bouton Supprimer */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notification.id!);
                      }}
                      disabled={deleteNotification.isPending}
                      className="rounded-full p-1.5 text-slate-400
                       transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      title="Supprimer"
                    >
                      {deleteNotification.isPending &&
                      deleteNotification.variables === notification.id ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Trash2 size={18} className="text-red-500" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}