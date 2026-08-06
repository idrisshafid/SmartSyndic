import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2, MapPin, Pencil } from "lucide-react";

import { residenceSchema, type ResidenceFormData } from "../schema/residence.schema";
import { useCreateResidence } from "../hooks/residence.hook";
import LocationModal from "../components/locationmodal";
import type { PickedLocation } from "../components/LocationPicker";
import z from "zod";

export default function CreateResidencePage() {
  const navigate = useNavigate();
  const createMutation = useCreateResidence();

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [location, setLocation] = useState<PickedLocation | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<
    z.input<typeof residenceSchema>,
    z.output<typeof residenceSchema>
  >({
    resolver: zodResolver(residenceSchema),
  });

  const handleLocationConfirm = (picked: PickedLocation) => {
    setLocation(picked);

    setValue("latitude", picked.latitude, { shouldValidate: true });
    setValue("longitude", picked.longitude, { shouldValidate: true });

    if (picked.city && !getValues("city").trim()) {
      setValue("city", picked.city, { shouldValidate: true });
    }
    if (picked.postalCode && !getValues("postal_code")?.trim()) {
      setValue("postal_code", picked.postalCode, { shouldValidate: true });
    }
    if (picked.address && !getValues("address").trim()) {
      setValue("address", picked.address, { shouldValidate: true });
    }
  };

  const onSubmit = (data: ResidenceFormData) => {
    createMutation.mutate(data, {
      onSuccess: (response) => {
        navigate(`/syndic/residences/${response.data.id}/setup`);
      },
    });
  };

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <Link
          to="/syndic/my-residences"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium transition hover:text-orange-600"
        >
          <ArrowLeft size={30} />
          Back to residences
        </Link>

        <div className="rounded-3xl p-6 sm:p-8 shadow-sm border">
          <h2 className="text-2xl sm:text-3xl font-bold">Create a residence</h2>
          <p className="mt-1 text-sm">
            Fill in the basics — you&apos;ll add photos and services next.
          </p>

          {createMutation.isError && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {createMutation.error instanceof Error
                ? createMutation.error.message
                : "Something went wrong. Please try again."}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block font-medium">Residence name</label>
              <input
                {...register("name")}
                placeholder="Atlas Residence"
                className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                  errors.name ? "border-red-400" : "border"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="mb-2 block font-medium">Location</label>

              {!location ? (
                <button
                  type="button"
                  onClick={() => setIsLocationModalOpen(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-orange-500 py-4 text-sm font-medium text-orange-500 transition hover:border-orange-400 hover:text-orange-600 active:scale-[0.98]"
                >
                  <MapPin size={22} /> Choose on Map
                </button>
              ) : (
                <div className="flex items-center justify-between rounded-xl border p-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                      <MapPin size={22} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {location.address ?? "Location selected"}
                      </p>
                      <p className="mt-0.5 font-mono text-xs">
                        {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsLocationModalOpen(true)}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-orange-600 transition hover:bg-orange-50 active:scale-[0.98]"
                  >
                    <Pencil size={22} />
                    Change
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="mb-2 block font-medium">Address</label>
              <textarea
                {...register("address")}
                placeholder="123 Main Street"
                className={`w-full h-19 rounded-xl border p-3 outline-none transition ${
                  errors.address ? "border-red-400" : "border"
                }`}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block font-medium">City</label>
                <input
                  {...register("city")}
                  placeholder="Fes"
                  className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                    errors.city ? "border-red-400" : "border"
                  }`}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block font-medium">Postal code</label>
                <input
                  {...register("postal_code")}
                  placeholder="30000"
                  className="w-full rounded-xl border px-4 py-3 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block font-medium">Description</label>
              <textarea
                {...register("description")}
                rows={4}
                placeholder="Describe the residence..."
                className="w-full h-64 rounded-xl border p-3 outline-none transition"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600 active:scale-[0.98] disabled:opacity-50"
            >
              {createMutation.isPending && (
                <Loader2 size={18} className="animate-spin" />
              )}
              {createMutation.isPending ? "Creating..." : "Create Residence"}
            </button>
          </form>
        </div>
      </div>

      <LocationModal
        isOpen={isLocationModalOpen}
        initialLocation={
          location
            ? { latitude: location.latitude, longitude: location.longitude }
            : undefined
        }
        onClose={() => setIsLocationModalOpen(false)}
        onConfirm={handleLocationConfirm}
      />
    </div>
  );
}