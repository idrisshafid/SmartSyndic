import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import axios from "axios";
import { useCreateCharge } from "../hooks/usecharges";
import { useAuthStore } from "@/stores/auth.store";
import { useOwners } from "@/features/owners/hooks/owner.hooks";
import { useResidences } from "@/features/residences/hooks/residence.hook";
import { useApartmentsByResidence } from "@/features/apartments/hooks/Apartment.hook";

// ─── Zod schema ──────────────────────────────────────────────────────────────
const createChargeSchema = z.object({
  owner_id: z.string().min(1, "Propriétaire requis"),
  residence_id: z.string().min(1, "Résidence requise"),
  apartment_id: z.string().min(1, "Appartement requis"),
  title: z.string().min(1, "Titre requis").max(255),
  description: z.string().optional(),
  amount: z.number().positive("Le montant doit être positif"),
  due_date: z.string().min(1, "Date d'échéance requise"),
});

type CreateChargeFormData = z.infer<typeof createChargeSchema>;

const formatDateToFrench = (dateStr: string): string => {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

export default function CreateChargePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore((state) => state);
  const syndicId = user?.id || "";

  const [error, setError] = useState<string | null>(null);

  const createCharge = useCreateCharge();

  const { data: ownersData, isLoading: ownersLoading } = useOwners();
  const { data: residencesData, isLoading: residencesLoading } = useResidences();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateChargeFormData>({
    resolver: zodResolver(createChargeSchema),
  });

  const residenceId = useWatch({ control, name: "residence_id" });
  const selectedResidenceId = residenceId || "";
  const dueDateValue = useWatch({ control, name: "due_date" });

  const { data: apartmentsData, isLoading: apartmentsLoading } =
    useApartmentsByResidence(selectedResidenceId);

  const owners = ownersData?.data ?? [];
  const residences = residencesData?.data.residences ?? [];
  const apartments = apartmentsData?.data ?? [];

  const handleResidenceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setValue("residence_id", value);
    setValue("apartment_id", "");
  };

  const onSubmit = async (data: CreateChargeFormData) => {
    setError(null);

    if (!user?.id) {
      setError("Vous devez être connecté en tant que syndic.");
      return;
    }

    const payload = {
      syndic_id: syndicId,
      owner_id: data.owner_id,
      apartment_id: data.apartment_id,
      title: data.title,
      description: data.description || "",
      amount: data.amount,
      due_date: data.due_date ? new Date(data.due_date) : new Date(),
    };

    try {
      await createCharge.mutateAsync(payload);
      navigate(-1);
    } catch (err) {
     const backendMessage = axios.isAxiosError(err)
    ? err.response?.data?.message || err.message
    : err instanceof Error
      ? err.message
      : "Une erreur est survenue.";
      setError(backendMessage || "Erreur lors de la création de la charge.");
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-2xl px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium transition"
        >
          <ArrowLeft size={16} />
          Retour
        </button>

        <div className="rounded-3xl p-6 shadow-sm border">
          <h1 className="text-2xl font-bold">Créer une charge</h1>
          <p className="mt-1 text-sm">
            Ajoutez une nouvelle charge pour un propriétaire.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
            {/* Propriétaire */}
            <div>
              <label className="block text-sm font-medium">
                Propriétaire
              </label>
              <select
                {...register("owner_id")}
                disabled={ownersLoading}
                className="mt-1 w-full rounded-xl border px-4 py-2.5 outline-none text-slate-700
                 transition focus:border-orange-500 disabled:opacity-50"
              >
                <option value="">Sélectionner un propriétaire</option>
                {owners.map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.first_name} {owner.last_name} – {owner.email}
                  </option>
                ))}
              </select>
              {errors.owner_id && <p className="mt-1 text-xs">{errors.owner_id.message}</p>}
            </div>

            {/* Résidence */}
            <div>
              <label className="block text-sm font-medium ">
                Résidence
              </label>
              <select
                value={residenceId || ""}
                onChange={handleResidenceChange}
                disabled={residencesLoading}
                className="mt-1 w-full rounded-xl border px-4 py-2.5  text-slate-700
                 outline-none transition focus:border-orange-500 disabled:opacity-50"
              >
                <option value="">Sélectionner une résidence</option>
                {residences.map((res) => (
                  <option key={res.id} value={res.id}>
                    {res.name} – {res.city}
                  </option>
                ))}
              </select>
              {errors.residence_id && <p className="mt-1 text-xs">{errors.residence_id.message}</p>}
            </div>

            {/* Appartement */}
            <div>
              <label className="block text-sm font-medium">
                Appartement
              </label>
              <select
                {...register("apartment_id")}
                disabled={!selectedResidenceId || apartmentsLoading}
                className="mt-1 w-full rounded-xl border px-4 py-2.5 outline-none transition focus:border-orange-500 disabled:opacity-50"
              >
                <option value="">Sélectionner un appartement</option>
                {apartments.map((apt) => (
                  <option key={apt.id} value={apt.id}>
                    Appartement {apt.apartment_number}
                    {apt.floor !== undefined && ` – Étage ${apt.floor}`}
                  </option>
                ))}
              </select>
              {errors.apartment_id && <p className="mt-1 text-xs">{errors.apartment_id.message}</p>}
            </div>

            {/* Titre */}
            <div>
              <label className="block text-sm font-medium">
                Titre
              </label>
              <input
                type="text"
                {...register("title")}
                placeholder="Ex: Loyer de janvier 2025"
                className="mt-1 w-full rounded-xl border px-4 py-2.5 outline-none transition focus:border-orange-500"
              />
              {errors.title && <p className="mt-1 text-xs">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium">
                Description (optionnel)
              </label>
              <textarea
                {...register("description")}
                rows={3}
                placeholder="Détails supplémentaires..."
                className="mt-1 w-full rounded-xl border px-4 py-2.5 outline-none transition focus:border-orange-500"
              />
            </div>

            {/* Montant */}
            <div>
              <label className="block text-sm font-medium">
                Montant (MAD)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("amount", { valueAsNumber: true })}
                placeholder="0.00"
                className="mt-1 w-full rounded-xl border px-4 py-2.5 outline-none transition focus:border-orange-500"
              />
              {errors.amount && <p className="mt-1 text-xs">{errors.amount.message}</p>}
            </div>

            {/* Date d'échéance */}
            <div>
              <label className="block text-sm font-medium">
                Date d'échéance
              </label>
              <input
                type="date"
                {...register("due_date")}
                className="mt-1 w-full rounded-xl border px-4 py-2.5 outline-none transition focus:border-orange-500"
              />
              {dueDateValue && (
                <p className="mt-1 text-sm">
                  Format français :{" "}
                  <span className="font-mono font-medium">
                    {formatDateToFrench(dueDateValue)}
                  </span>
                </p>
              )}
              {errors.due_date && <p className="mt-1 text-xs">{errors.due_date.message}</p>}
            </div>

            {error && <p className="text-sm">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : null}
              {isSubmitting ? "Création..." : "Créer la charge"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}