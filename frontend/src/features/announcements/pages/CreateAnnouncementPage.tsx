import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Building2 } from "lucide-react";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useCreateAnnouncement } from "../hooks/useAnnouncements";
import { useResidences } from "@/features/residences/hooks/residence.hook";
import { useAuthStore } from "@/stores/auth.store";

// ─── Validation Schema ──────────────────────────────────────────────────────

const createAnnouncementSchema = z.object({
  residence_id: z.string().min(1, "Veuillez sélectionner une résidence"),
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères").max(100),
  content: z.string().min(10, "Le contenu doit contenir au moins 10 caractères").max(2000),
});

type CreateAnnouncementFormData = z.infer<typeof createAnnouncementSchema>;

// ─── Component ──────────────────────────────────────────────────────────────

export default function CreateAnnouncementPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  // ─── Récupération des résidences du syndic ──────────────────────────────
  const {
    data: residencesData,
    isLoading: residencesLoading,
    isError: residencesError,
  } = useResidences();

  const residences = residencesData?.data?.residences ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAnnouncementFormData>({
    resolver: zodResolver(createAnnouncementSchema),
  });

  const createMutation = useCreateAnnouncement();

const onSubmit = (data: CreateAnnouncementFormData) => {
  if (!user?.id) {
    alert("Vous devez être connecté en tant que syndic.");
    return;
  }

  createMutation.mutate(
    {
      residence_id: data.residence_id,
      syndic_id: user.id,
      title: data.title,
      content: data.content,
    },
    {
      onSuccess: () => {
        navigate("/syndic/residences");
      },
    }
  );
};

  // ─── Gestion du chargement des résidences ──────────────────────────────
  if (residencesLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 size={32} className="animate-spin text-orange-500" />
      </div>
    );
  }

  if (residencesError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <p className="text-red-500">Impossible de charger vos résidences.</p>
        <Link
          to="/syndic/dashboard"
          className="rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
        >
          Retour au tableau de bord
        </Link>
      </div>
    );
  }

  if (residences.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <Building2 size={40} className="text-slate-400" />
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
          Aucune résidence
        </h2>
        <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
          Vous ne gérez aucune résidence pour le moment. Créez-en une avant de
          publier une annonce.
        </p>
        <Link
          to="/syndic/residences/create"
          className="rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
        >
          Créer une résidence
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/80 py-12 dark:bg-slate-900/50">
      <div className="mx-auto max-w-2xl px-6">
        <Link
          to="/syndic/residences"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft size={18} />
          Retour à mes résidences
        </Link>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Créer une annonce
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Informez les propriétaires de l’une de vos résidences.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
            {/* ─── Sélection de la résidence ─── */}
            <div>
              <label
                htmlFor="residence_id"
                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Résidence *
              </label>
              <select
                id="residence_id"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                {...register("residence_id")}
              >
                <option value="">Sélectionnez une résidence</option>
                {residences.map((res) => (
                  <option key={res.id} value={res.id}>
                    {res.name} – {res.city}
                  </option>
                ))}
              </select>
              {errors.residence_id && (
                <p className="mt-1 text-sm text-red-500">{errors.residence_id.message}</p>
              )}
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
                <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
              )}
            </div>

            {createMutation.isError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                {createMutation.error instanceof Error
                  ? createMutation.error.message
                  : "Erreur lors de la création de l'annonce."}
              </div>
            )}

            <Button
              type="submit"
              loading={createMutation.isPending}
              className="w-full"
            >
              {createMutation.isPending ? "Création..." : "Publier l'annonce"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}