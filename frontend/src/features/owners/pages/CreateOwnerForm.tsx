import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  PartyPopper,
  Search,
  Building2,
  BedDouble,
  Users,
} from "lucide-react";

import {
  createOwnerSchema,
  type CreateOwnerFormData,
} from "../schema/owner.schema";
import {
  useCreateOwner,
  useOwnerApartments,
  useAssignApartment,
  useUnassignApartment,
} from "../hooks/owner.hooks";
import { getAllApartment } from "@/features/apartments/services/apartments.service";

const WIZARD_STEPS = [
  { number: 1, label: "Owner Info" },
  { number: 2, label: "Assign Apartments" },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="mb-10 flex items-center justify-center">
      {WIZARD_STEPS.map((s, i) => (
        <div key={s.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition ${
                current > s.number
                  ? "bg-orange-500 text-white"
                  : current === s.number
                  ? "bg-orange-500 text-white ring-4 ring-orange-100"
                  : "border text-slate-400"
              }`}
            >
              {current > s.number ? <Check size={16} /> : s.number}
            </div>
            <span
              className={`mt-2 text-xs font-medium ${
                current >= s.number ? "text-slate-900" : "text-slate-400"
              }`}
            >
              {s.label}
            </span>
          </div>
          {i < WIZARD_STEPS.length - 1 && (
            <div
              className={`mx-2 mb-5 h-0.5 w-16 sm:w-24 ${
                current > s.number ? "bg-orange-500" : "border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export default function CreateOwnerWizardPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [ownerName, setOwnerName] = useState("");
  const [apartmentSearch, setApartmentSearch] = useState("");

  const createOwnerMutation = useCreateOwner();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateOwnerFormData>({
    resolver: zodResolver(createOwnerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      country: "",
    },
  });

  const { data: allApartmentsData, isLoading: apartmentsLoading } = useQuery({
    queryKey: ["apartments", "all"],
    queryFn: getAllApartment,
  });

  const { data: ownerApartmentsData, isLoading: ownerApartmentsLoading } =
    useOwnerApartments(ownerId ?? "");
  const assignMutation = useAssignApartment();
  const unassignMutation = useUnassignApartment();

  const allApartments = Array.isArray(allApartmentsData?.data)
    ? allApartmentsData.data
    : [];
  const assignedApartments = Array.isArray(ownerApartmentsData?.data)
    ? ownerApartmentsData.data
    : [];
  const assignedIds = new Set(assignedApartments.map((a) => a.id));

  const visibleApartments = allApartments.filter((apt) =>
    apt.apartment_number
      .toLowerCase()
      .includes(apartmentSearch.trim().toLowerCase())
  );

  const onSubmitStep1 = (data: CreateOwnerFormData) => {
    createOwnerMutation.mutate(data, {
      onSuccess: (response) => {
        setOwnerId(response.data.id);
        setOwnerName(`${response.data.first_name} ${response.data.last_name}`);
        setStep(2);
      },
    });
  };

  const toggleApartment = (apartmentId: string) => {
    if (!ownerId) return;
    if (assignedIds.has(apartmentId)) {
      unassignMutation.mutate({ ownerId, apartmentId });
    } else {
      assignMutation.mutate({ ownerId, apartmentId });
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-2xl px-6">
        {step < 3 && (
          <>
            <Link
              to="/syndic/owners"
              className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium transition"
            >
              <ArrowLeft size={16} />
              Back to owners
            </Link>

            <div className="mb-2 text-center">
              <h1 className="text-3xl font-bold">Add an owner</h1>
              <p className="mt-2">Create the owner, then link the apartments they own.</p>
            </div>

            <StepIndicator current={step} />
          </>
        )}

        <div className="rounded-3xl p-8 shadow-sm border">
          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={handleSubmit(onSubmitStep1)} className="space-y-5">
              <h2 className="text-xl font-semibold">Owner information</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    First name
                  </label>
                  <input
                    {...register("first_name")}
                    placeholder="John"
                    className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:border-orange-500 ${
                      errors.first_name ? "border" : "border"
                    }`}
                  />
                  {errors.first_name && (
                    <p className="mt-1 text-sm">{errors.first_name.message}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Last name
                  </label>
                  <input
                    {...register("last_name")}
                    placeholder="Doe"
                    className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:border-orange-500 ${
                      errors.last_name ? "border" : "border"
                    }`}
                  />
                  {errors.last_name && (
                    <p className="mt-1 text-sm">{errors.last_name.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email
                </label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="john.doe@example.com"
                  className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:border-orange-500 ${
                    errors.email ? "border" : "border"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Phone{" "}
                    <span className="font-normal">(optional)</span>
                  </label>
                  <input
                    {...register("phone")}
                    placeholder="+212 6XX XXX XXX"
                    className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Country{" "}
                    <span className="font-normal">(optional)</span>
                  </label>
                  <input
                    {...register("country")}
                    placeholder="Morocco"
                    className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-orange-500"
                  />
                </div>
              </div>

              {createOwnerMutation.isError && (
                <div className="rounded-xl border p-3 text-sm">
                  {createOwnerMutation.error instanceof Error
                    ? createOwnerMutation.error.message
                    : "Something went wrong. Please try again."}
                </div>
              )}

              <button
                type="submit"
                disabled={createOwnerMutation.isPending}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
              >
                {createOwnerMutation.isPending && (
                  <Loader2 size={18} className="animate-spin" />
                )}
                {createOwnerMutation.isPending
                  ? "Creating..."
                  : "Create Owner & Continue"}
                {!createOwnerMutation.isPending && <ArrowRight size={16} />}
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <h2 className="mb-1 text-xl font-semibold">Assign apartments</h2>
              <p className="mb-5 text-sm">
                Select the apartments {ownerName} owns. You can change this
                anytime later.
              </p>

              <div className="relative mb-4">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
                />
                <input
                  value={apartmentSearch}
                  onChange={(e) => setApartmentSearch(e.target.value)}
                  placeholder="Search by apartment number..."
                  className="w-full rounded-xl border py-3 pl-11 pr-4 outline-none transition focus:border-orange-500"
                />
              </div>

              {(apartmentsLoading || ownerApartmentsLoading) && (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 animate-pulse rounded-2xl" />
                  ))}
                </div>
              )}

              {!apartmentsLoading &&
                !ownerApartmentsLoading &&
                visibleApartments.length === 0 && (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-10 text-center">
                    <Building2 size={24} />
                    <p className="mt-2 text-sm">
                      {apartmentSearch
                        ? "No apartments match that search."
                        : "No apartments available to assign. Create an apartment first."}
                    </p>
                    <Link
                      to={`/residences/your-residence-id/apartments/new`}
                      className="mt-3 text-sm font-medium text-orange-500 hover:underline"
                    >
                      + Add Apartment
                    </Link>
                  </div>
                )}

              {!apartmentsLoading && !ownerApartmentsLoading && (
                <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
                  {visibleApartments.map((apartment) => {
                    const isAssigned = assignedIds.has(apartment.id);
                    return (
                      <button
                        key={apartment.id}
                        type="button"
                        onClick={() => toggleApartment(apartment.id)}
                        className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                          isAssigned
                            ? "border-orange-500 bg-orange-50"
                            : "border hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div>
                          <p className="font-medium">
                            Apartment {apartment.apartment_number}
                          </p>
                          <div className="mt-1 flex items-center gap-3 text-xs">
                            <span className="flex items-center gap-1">
                              <BedDouble size={12} />
                              {apartment.bedrooms}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users size={12} />
                              {apartment.capacity}
                            </span>
                            <span className="capitalize">
                              {apartment.status}
                            </span>
                          </div>
                        </div>

                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
                            isAssigned
                              ? "border-orange-500 bg-orange-500 text-white"
                              : "border-slate-300"
                          }`}
                        >
                          {isAssigned && <Check size={14} strokeWidth={3} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="mt-8 flex items-center justify-between border-t pt-6">
                <span className="text-sm">
                  {assignedApartments.length} apartment
                  {assignedApartments.length === 1 ? "" : "s"} assigned
                </span>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  Finish
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS */}
          {step === 3 && (
            <div className="py-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                {ownerName ? (
                  <span className="text-lg font-bold text-orange-600">
                    {getInitials(
                      ownerName.split(" ")[0] ?? "",
                      ownerName.split(" ")[1] ?? ""
                    )}
                  </span>
                ) : (
                  <PartyPopper size={28} className="text-orange-600" />
                )}
              </div>
              <h2 className="mt-5 text-2xl font-bold">Owner added!</h2>
              <p className="mt-2">
                {ownerName} is now linked to {assignedApartments.length}{" "}
                apartment{assignedApartments.length === 1 ? "" : "s"}.
              </p>

              <div className="mt-8 space-y-2">
                <Link
                  to={`/owners/${ownerId}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600"
                >
                  View Owner
                </Link>
                <Link
                  to="/owners"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border py-3 font-semibold transition hover:bg-slate-50"
                >
                  Back to Owners
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}