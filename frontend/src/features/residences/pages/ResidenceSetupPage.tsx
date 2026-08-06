import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, ImagePlus, ArrowRight, Check } from "lucide-react";

import {
  useResidenceServices,
  useAddResidenceService,
  useDeleteResidenceService,
} from "../hooks/useResidenceServices";
import { AMENITIES, type AmenityOption } from "../components/amenities";

export default function ResidenceSetupPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useResidenceServices(id ?? "");
  const addMutation = useAddResidenceService();
  const deleteMutation = useDeleteResidenceService();

  const [pendingName, setPendingName] = useState<string | null>(null);

  if (!id) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-medium">Residence not found.</p>
      </div>
    );
  }

  const services = data?.data ?? [];
  const selectedNames = new Set(services.map((s) => s.service_name));

  const toggleAmenity = (amenity: AmenityOption) => {
    const existing = services.find((s) => s.service_name === amenity.name);
    setPendingName(amenity.name);

    if (existing) {
      deleteMutation.mutate(
        { id, serviceId: existing.id },
        { onSettled: () => setPendingName(null) }
      );
    } else {
      addMutation.mutate(
        {
          id,
          data: { service_name: amenity.name, icon_name: amenity.iconName },
        },
        { onSettled: () => setPendingName(null) }
      );
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="mb-8 sm:mb-10 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Complete your residence
          </h1>
          <p className="mt-2 text-sm sm:text-base">
            A couple more steps before it&apos;s ready to publish.
          </p>
        </div>

        <div className="space-y-5">
          {/* STEP 1 — CONFIRMATION */}
          <div className="flex items-center gap-3 sm:gap-4 rounded-3xl p-4 sm:p-6 shadow-sm border">
            <CheckCircle2 size={24} className="shrink-0" />
            <div>
              <h2 className="font-semibold">Residence created</h2>
              <p className="text-sm">
                Your residence has been saved successfully.
              </p>
            </div>
          </div>

          {/* STEP 2 — AMENITY PICKER */}
          <div className="rounded-3xl p-4 sm:p-6 shadow-sm border">
            <div className="mb-5">
              <h2 className="font-semibold">
                What does this residence offer?
              </h2>
              <p className="text-sm">
                Select all the amenities that apply.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {AMENITIES.map((amenity) => {
                const Icon = amenity.icon;
                const isSelected = selectedNames.has(amenity.name);
                const isPending =
                  pendingName === amenity.name &&
                  (addMutation.isPending || deleteMutation.isPending);

                return (
                  <button
                    key={amenity.name}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    disabled={isLoading || isPending}
                    className={`relative flex flex-col items-center gap-2 rounded-2xl border p-3 sm:p-4 text-center transition disabled:opacity-50 ${
                      isSelected
                        ? "border-orange-500"
                        : "border hover:border-slate-300"
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-white">
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                    <Icon
                      size={20}
                      className={isSelected ? "text-orange-600" : ""}
                    />
                    <span
                      className={`text-xs font-medium ${
                        isSelected ? "text-orange-700" : ""
                      }`}
                    >
                      {amenity.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3 — PHOTOS */}
          <div className="rounded-3xl p-4 sm:p-6 shadow-sm border">
            <div className="mb-4 flex items-center gap-4">
              <ImagePlus size={24} className="shrink-0 text-orange-500" />
              <div>
                <h2 className="font-semibold">Add photos</h2>
                <p className="text-sm">
                  Showcase the residence with a few clear photos.
                </p>
              </div>
            </div>

            <Link
              to={`/syndic/residences/${id}/photos`}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98]"
            >
              Add Photos
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <button
          onClick={() => navigate(`/syndic/residences/${id}`)}
          className="mt-8 flex w-full items-center justify-center rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 active:scale-[0.98]"
        >
          Finish Setup
        </button>
      </div>
    </div>
  );
}