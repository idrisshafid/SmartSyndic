import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import {
  useAnnouncement,
  useUpdateAnnouncement,
} from "../hooks/useAnnouncements";
import { useResidences } from "@/features/residences/hooks/residence.hook";
import { useAuthStore } from "@/stores/auth.store";

// ─── Validation Schema ──────────────────────────────────────────────────────

const editAnnouncementSchema = z.object({
  residence_id: z.string().optional(),
  title: z
    .string()
    .min(3, "Le titre doit contenir au moins 3 caractères")
    .max(100),
  content: z
    .string()
    .min(10, "Le contenu doit contenir au moins 10 caractères")
    .max(2000),
});

type EditAnnouncementFormData = z.infer<typeof editAnnouncementSchema>;

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Normalize both `{ data: Announcement }` and bare `Announcement` shapes */
function unwrapAnnouncement(payload: unknown) {
  if (!payload || typeof payload !== "object") return null;

  const root = payload as Record<string, unknown>;

  // Shape A: { data: Announcement }
  if (root.data && typeof root.data === "object") {
    return root.data as {
      id: string;
      residence_id: string;
      title: string;
      content: string;
    };
  }

  // Shape B: Announcement directly
  if ("title" in root && "content" in root) {
    return root as {
      id: string;
      residence_id: string;
      title: string;
      content: string;
    };
  }

  return null;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function EditAnnouncementPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  // ─── Queries ─────────────────────────────────────────────────────────────
  const {
    data: announcementData,
    isLoading: announcementLoading,
    isError: announcementError,
    isSuccess: announcementSuccess,
  } = useAnnouncement(id ?? "");

  const announcement = unwrapAnnouncement(announcementData);

  const {
    data: residencesData,
    isLoading: residencesLoading,
    isError: residencesError,
  } = useResidences();

  const residences = residencesData?.data?.residences ?? [];

  // ─── Form ────────────────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<EditAnnouncementFormData>({
    resolver: zodResolver(editAnnouncementSchema),
    defaultValues: {
      residence_id: "",
      title: "",
      content: "",
    },
  });

  // Hydrate once when the entity is available. Depend on id only so refetches
  // do not wipe what the user already typed.
  useEffect(() => {
    if (!announcementSuccess || !announcement) return;

    reset({
      residence_id: announcement.residence_id ?? "",
      title: announcement.title ?? "",
      content: announcement.content ?? "",
    });
  }, [announcementSuccess, announcement?.id, reset]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateMutation = useUpdateAnnouncement();

  // ─── Submit ──────────────────────────────────────────────────────────────
  const onSubmit = (data: EditAnnouncementFormData) => {
    if (!id) return;
    if (!user?.id) {
      alert("Vous devez être connecté en tant que syndic.");
      return;
    }

    const payload: { title?: string; content?: string } = {};

    if (data.title !== announcement?.title) {
      payload.title = data.title;
    }
    if (data.content !== announcement?.content) {
      payload.content = data.content;
    }

    // Nothing changed
    if (Object.keys(payload).length === 0) return;

    updateMutation.mutate(
      { id, payload },
      {
        onSuccess: () => {
          navigate("/syndic/announcements");
        },
      }
    );
  };

  // ─── Loading / error gates ───────────────────────────────────────────────
  if (announcementLoading || residencesLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 size={32} className="animate-spin text-orange-500" />
      </div>
    );
  }

  if (announcementError || !announcement) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <AlertCircle size={40} className="text-red-500" />
        <p className="text-red-500">Annonce introuvable.</p>
        <Link
          to="/syndic/announcements"
          className="rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
        >
          Retour aux annonces
        </Link>
      </div>
    );
  }

  if (residencesError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <p className="text-red-500">Impossible de charger vos résidences.</p>
        <Link
          to="/syndic/announcements"
          className="rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
        >
          Retour aux annonces
        </Link>
      </div>
    );
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50/80 py-12 dark:bg-slate-900/50">
      <div className="mx-auto max-w-2xl px-6">
        <Link
          to="/syndic/announcements"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft size={18} />
          Retour aux annonces
        </Link>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Modifier l'annonce
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Mettez à jour les informations de l'annonce.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
            {/* Résidence (read-only) */}
            <div>
              <label
                htmlFor="residence_id"
                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Résidence *
              </label>
              <select
                id="residence_id"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white disabled:opacity-60"
                {...register("residence_id")}
                disabled
              >
                {residences.map((res) => (
                  <option key={res.id} value={res.id}>
                    {res.name} – {res.city}
                  </option>
                ))}
              </select>
              {errors.residence_id && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.residence_id.message}
                </p>
              )}
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                La résidence ne peut pas être modifiée.
              </p>
            </div>

            <Input
              label="Titre"
              placeholder="Ex: Réunion annuelle des copropriétaires"
              {...register("title")}
              error={errors.title?.message}
            />

            <div>
              <label
                htmlFor="content"
                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Contenu
              </label>
              <textarea
                id="content"
                rows={6}
                placeholder="Décrivez l'annonce en détail..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                {...register("content")}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.content.message}
                </p>
              )}
            </div>

            {updateMutation.isError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                {updateMutation.error instanceof Error
                  ? updateMutation.error.message
                  : "Erreur lors de la mise à jour de l'annonce."}
              </div>
            )}

            <Button
              type="submit"
              loading={isSubmitting || updateMutation.isPending}
              disabled={!isDirty || updateMutation.isPending}
              className="w-full"
            >
              {updateMutation.isPending
                ? "Mise à jour..."
                : "Enregistrer les modifications"}
            </Button>

            {!isDirty && !updateMutation.isPending && (
              <p className="text-center text-sm text-slate-400 dark:text-slate-500">
                Aucune modification détectée.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}