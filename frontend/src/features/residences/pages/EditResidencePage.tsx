import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, MapPin, Pencil } from "lucide-react";

import {
  residenceSchema,
  type ResidenceFormData,
} from "../schema/residence.schema";
import { useResidence, useUpdateResidence } from "../hooks/residence.hook";
import LocationModal from "../components/locationmodal";
import type { PickedLocation } from "../components/LocationPicker";

export default function EditResidencePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useResidence(id ?? "");
  const updateMutation = useUpdateResidence();
  const residence = data?.data;

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [pickedLocation, setPickedLocation] = useState<PickedLocation | null>(null);

  // Affichage : le lieu choisi par l'utilisateur, sinon les coordonnées de la résidence
  const displayLocation: PickedLocation | null =
    pickedLocation ??
    (residence?.latitude != null && residence?.longitude != null
      ? {
          latitude: residence.latitude,
          longitude: residence.longitude,
          address: residence.address,
        }
      : null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,

    formState: { errors },
  } = useForm<ResidenceFormData>({
    resolver: zodResolver(residenceSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      postal_code: "",
      description: "",
      latitude: undefined,
      longitude: undefined,
    },
  });

  // ─── Pré‑remplir le formulaire UNE SEULE FOIS ──────────────────────────
  useEffect(() => {
    if (!residence) return;

    reset({
      name: residence.name ?? "",
      address: residence.address ?? "",
      city: residence.city ?? "",
      postal_code: residence.postal_code ?? "",
      description: residence.description ?? "",
      latitude: residence.latitude ?? undefined,
      longitude: residence.longitude ?? undefined,
    });

    // Ne pas réinitialiser `pickedLocation` pour garder la préférence utilisateur
  }, [residence?.id, reset]);

  // ─── Gestion du lieu ─────────────────────────────────────────────────────
  const handleLocationConfirm = (picked: PickedLocation) => {
    setPickedLocation(picked);

    // Toujours mettre à jour les coordonnées
    setValue("latitude", picked.latitude, { shouldValidate: true, shouldDirty: true });
    setValue("longitude", picked.longitude, { shouldValidate: true, shouldDirty: true });

    // ✅ TOUJOURS mettre à jour l'adresse, la ville et le code postal
    // (même s'ils ne sont pas vides)
    setValue("address", picked.address ?? "", { shouldValidate: true, shouldDirty: true });
    setValue("city", picked.city ?? "", { shouldValidate: true, shouldDirty: true });
    setValue("postal_code", picked.postalCode ?? "", { shouldValidate: true, shouldDirty: true });
  };

  // ─── Soumission ──────────────────────────────────────────────────────────
  const onSubmit = (formData: ResidenceFormData) => {
    if (!id) return;

    // Priorité au lieu choisi par l'utilisateur, sinon les valeurs du formulaire
    const payload: ResidenceFormData = {
      ...formData,
      latitude: pickedLocation?.latitude ?? formData.latitude,
      longitude: pickedLocation?.longitude ?? formData.longitude,
    };

    updateMutation.mutate(
      { id, data: payload },
      {
        onSuccess: () => navigate(`/syndic/residences/${id}/setup`),
      }
    );
  };
  

  // ─── États de chargement / erreur ──────────────────────────────────────
  if (!id) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-medium">Residence not found.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 size={32} className="animate-spin text-orange-500" />
      </div>
    );
  }

  if (isError || !residence) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-medium text-red-500">Couldn't load residence.</p>
      </div>
    );
  }

  // ─── Rendu ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-2xl px-6">
        <Link
          to={`/syndic/residences/${id}/detail`}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium transition hover:text-orange-600"
        >
          <ArrowLeft size={16} />
          Back to residence
        </Link>

        <div className="rounded-3xl border p-8 shadow-sm">
          <h2 className="text-2xl font-bold">Edit residence</h2>
          <p className="mt-1 text-sm">Update the residence details below.</p>

          {updateMutation.isError && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {updateMutation.error instanceof Error
                ? updateMutation.error.message
                : "Something went wrong. Please try again."}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Residence name
              </label>
              <input
                {...register("name")}
                className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                  errors.name ? "border-red-400" : "border"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Localisation */}
            <div>
              <label className="mb-2 block text-sm font-medium">Location</label>

              {!displayLocation ? (
                <button
                  type="button"
                  onClick={() => setIsLocationModalOpen(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed py-4 text-sm font-medium transition hover:border-orange-400 hover:text-orange-600"
                >
                  <MapPin size={16} />
                  Choose on Map
                </button>
              ) : (
                <div className="flex items-center justify-between rounded-xl border p-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                      <MapPin size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {displayLocation.address ?? "Location set"}
                      </p>
                      <p className="mt-0.5 font-mono text-xs">
                        {Number(displayLocation.latitude).toFixed(5)},{" "}
                        {Number(displayLocation.longitude).toFixed(5)}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsLocationModalOpen(true)}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-orange-600 transition hover:bg-orange-50"
                  >
                    <Pencil size={13} />
                    Change
                  </button>
                </div>
              )}

              {(errors.latitude || errors.longitude) && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.latitude?.message || errors.longitude?.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Address</label>
              <input
                {...register("address")}
                className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                  errors.address ? "border-red-400" : "border"
                }`}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium">City</label>
                <input
                  {...register("city")}
                  className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                    errors.city ? "border-red-400" : "border"
                  }`}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Postal code
                </label>
                <input
                  {...register("postal_code")}
                  className="w-full rounded-xl border px-4 py-3 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Description</label>
              <textarea
                {...register("description")}
                rows={4}
                className="w-full rounded-xl border p-3 outline-none transition"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
            >
              {updateMutation.isPending && (
                <Loader2 size={18} className="animate-spin" />
              )}
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>

      <LocationModal
        isOpen={isLocationModalOpen}
        initialLocation={
          displayLocation
            ? {
                latitude: displayLocation.latitude,
                longitude: displayLocation.longitude,
              }
            : undefined
        }
        onClose={() => setIsLocationModalOpen(false)}
        onConfirm={handleLocationConfirm}
      />
    </div>
  );
}