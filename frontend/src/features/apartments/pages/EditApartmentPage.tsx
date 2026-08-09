import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Minus,
  Plus,
  Maximize,
  BedDouble,
  Bath,
  Users,
  DoorClosed,
  Building2,
  Loader2,
  Upload,
  Star,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ImageOff,
 
  type LucideIcon,
} from "lucide-react";

import { apartmentUpdateSchema, type ApartmentUpdateFormData } from "../schema/UpdateApartment.schema";
import { STEP_1_FIELDS, STEP_2_FIELDS } from "../schema/Apartment.schema";
import { APARTMENT_EQUIPMENT, getEquipmentIcon } from "../components/equipement.constants";

import { useApartment, useUpdateApartment } from "../hooks/Apartment.hook";
import type { UpdateApartmentInput } from "../types/apartments.types";
import {
  useApartmentServices,
  useAddApartmentService,
  useDeleteApartmentService,
} from "../hooks/Useapartmentservices";
import {
  useApartmentPhotos,
  useCreateApartmentPhoto,
  useDeleteApartmentPhoto,
  useSetPrimaryApartmentPhoto,
} from "../hooks/Useapartmentphotos";
import type { ApartmentStatus } from "../types/apartments.types";

// ─── Helpers ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: ApartmentStatus; label: string }[] = [
  { value: "available", label: "Available" },
  { value: "occupied", label: "Occupied" },
  { value: "maintenance", label: "Maintenance" },
];

const VIEW_OPTIONS = [
  "City View",
  "Sea View",
  "Garden View",
  "Pool View",
  "Mountain View",
  "No View",
];

const WIZARD_STEPS = [
  { number: 1, label: "Basics" },
  { number: 2, label: "Capacity" },
  { number: 3, label: "Equipment" },
  { number: 4, label: "Photos" },
];

// ─── StepIndicator ───────────────────────────────────────────────────────────

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
              className={`mt-2 mb-1 text-xs font-medium ${
                current >= s.number ? "text-slate-900" : "text-slate-500"
              }`}
            >
              {s.label}
            </span>
          </div>
          {i < WIZARD_STEPS.length - 1 && (
            <div
              className={`mx-2 mb-5 h-0.5 w-10 sm:w-16 ${
                current > s.number ? "bg-orange-500" : "border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Counter ─────────────────────────────────────────────────────────────────

interface CounterProps {
  label: string;
  icon?: LucideIcon;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}

function Counter({
  label,
  icon: Icon,
  value,
  onChange,
  min = 0,
  max = 20,
  step = 1,
  suffix = "",
}: CounterProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border p-4">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-full border">
            <Icon size={18} />
          </div>
        )}
        <span className="font-medium">{label}</span>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - step))}
          disabled={value <= min}
          className="flex h-9 w-9 items-center justify-center rounded-full border transition hover:border-orange-400 hover:text-orange-600 disabled:opacity-30"
        >
          <Minus size={16} />
        </button>
        <span className="w-14 text-center font-semibold">
          {value}
          {suffix}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + step))}
          disabled={value >= max}
          className="flex h-9 w-9 items-center justify-center rounded-full border transition hover:border-orange-400 hover:text-orange-600 disabled:opacity-30"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function EditApartmentWizardPage() {
  const { apartmentId } = useParams<{ apartmentId: string }>();

  const { data: apartmentData, isLoading: isLoadingApartment, isError: apartmentError } =
    useApartment(apartmentId ?? "");
  const apartment = apartmentData?.data;

  const [step, setStep] = useState(1);
  const [customEquipment, setCustomEquipment] = useState("");
  const [showCustomEquipmentInput, setShowCustomEquipmentInput] = useState(false);
  const [photoOrder, setPhotoOrder] = useState<string[]>([]);

  const updateMutation = useUpdateApartment();

  const {
    register,
    trigger,
    reset,
    getValues,
    setValue,
    control,
    formState: { errors },
  } = useForm<ApartmentUpdateFormData>({
    resolver: zodResolver(apartmentUpdateSchema),
    defaultValues: {
      apartment_number: "",
      floor: 0,
      surface: 40,
      status: "available",
      price_per_night: 0,
      view_type: "",
      description: "",
      rooms: 1,
      bedrooms: 1,
      bathrooms: 1,
      capacity: 2,
    },
  });

  useEffect(() => {
    if (!apartment) return;
    reset({
      apartment_number: apartment.apartment_number,
      floor: apartment.floor ?? 0,
      surface: apartment.surface != null ? Number(apartment.surface) : 40,
      status: apartment.status,
      price_per_night: apartment.price_per_night != null ? Number(apartment.price_per_night) : 0,
      view_type: apartment.view_type ?? "",
      description: apartment.description ?? "",
      rooms: apartment.rooms ?? 1,
      bedrooms: apartment.bedrooms ?? 1,
      bathrooms: apartment.bathrooms ?? 1,
      capacity: apartment.capacity ?? 2,
    });
  }, [apartment, reset]);

  const values = useWatch({ control });
  const isOtherView = !!values.view_type && !VIEW_OPTIONS.includes(values.view_type);

  const { data: servicesData } = useApartmentServices(apartmentId ?? "");
  const addServiceMutation = useAddApartmentService();
  const deleteServiceMutation = useDeleteApartmentService();
  const currentEquipment = servicesData?.data ?? [];

  const { data: photosData } = useApartmentPhotos(apartmentId ?? "");
  const uploadPhotoMutation = useCreateApartmentPhoto();
  const deletePhotoMutation = useDeleteApartmentPhoto();
  const setPrimaryMutation = useSetPrimaryApartmentPhoto();
  const photos = photosData?.data ?? [];

  const orderedPhotos = [
    ...photoOrder
      .map((id) => photos.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => !!p),
    ...photos.filter((p) => !photoOrder.includes(p.id)),
  ];

  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const goNext = async () => {
    if (step === 1) {
      const isValid = await trigger(STEP_1_FIELDS);
      if (isValid) setStep(2);
      return;
    }
    if (step === 2) {
      const isValid = await trigger([...STEP_1_FIELDS, ...STEP_2_FIELDS]);
      if (!isValid) return;

      const data = getValues() as UpdateApartmentInput;
      if (!apartmentId || !apartment?.residence_id) {
        console.error("Missing apartment ID or residence ID");
        return;
      }

      updateMutation.mutate(
        { id: apartmentId, residenceId: apartment.residence_id, data },
        {
          onSuccess: () => setStep(3),
          onError: (error) => console.error("Update failed:", error),
        }
      );
      return;
    }
    if (step === 3) {
      setStep(4);
      return;
    }
    if (step === 4) {
      setStep(5);
    }
  };

  const toggleEquipment = (name: string) => {
    if (!apartmentId) return;
    const existing = currentEquipment.find(
      (e) => e.equipment.toLowerCase() === name.toLowerCase()
    );
    if (existing?.id) {
      deleteServiceMutation.mutate({ apartmentId, equipmentId: existing.id });
    } else {
      addServiceMutation.mutate({
        apartmentId,
        data: { apartment_id: apartmentId, equipment: name },
      });
    }
  };

  const addCustomEquipment = () => {
    const name = customEquipment.trim();
    if (!name || !apartmentId) return;
    addServiceMutation.mutate(
      { apartmentId, data: { apartment_id: apartmentId, equipment: name } },
      {
        onSuccess: () => {
          setCustomEquipment("");
          setShowCustomEquipmentInput(false);
        },
      }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !apartmentId) {
      alert("Please create the apartment first (step 2) before uploading photos.");
      e.target.value = "";
      return;
    }
    Array.from(files).forEach((file) => {
      const formData = new FormData();
      formData.append("photo", file);
      uploadPhotoMutation.mutate({ apartmentId, formData });
    });
    e.target.value = "";
  };

  const handleDeletePhoto = (photoId: string) => {
    if (!apartmentId) return;
    if (!window.confirm("Are you sure you want to delete this photo?")) return;
    deletePhotoMutation.mutate(
      { apartmentId, photoId },
      {
        onSuccess: () => setPhotoOrder((prev) => prev.filter((id) => id !== photoId)),
        onError: (error) => {
          console.error("Delete failed:", error);
          alert(`Failed to delete photo: ${error.message || "Unknown error"}`);
        },
      }
    );
  };

  const movePhoto = (id: string, direction: "left" | "right") => {
    const order = orderedPhotos.map((p) => p.id);
    const index = order.indexOf(id);
    const swapWith = direction === "left" ? index - 1 : index + 1;
    if (swapWith < 0 || swapWith >= order.length) return;
    [order[index], order[swapWith]] = [order[swapWith], order[index]];
    setPhotoOrder(order);
  };

  if (isLoadingApartment) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 size={32} className="animate-spin text-orange-500" />
      </div>
    );
  }

  if (apartmentError || !apartment) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-medium">Apartment not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6">
      <div className="mx-auto max-w-2xl px-6">
        {step < 5 && (
          <>
            <Link
              to={`/syndic/residences/${apartment.residence_id}/detail`}
              className="mb-3 inline-flex items-center gap-1.3 text-xm font-medium transition hover:text-orange-500"
            >
              <ArrowLeft size={20} />
              Back to residence
            </Link>

            <div className="mb-2 text-center p-3">
              <div className="text-5xl font-bold pb-5">Edit Apartment</div>
              <p className="mt-2">Update the details – changes are saved immediately.</p>
            </div>

            <StepIndicator current={step} />
          </>
        )}

        <div className="rounded-3xl p-6 shadow-sm border">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold pb-4">Basic information</h2>

              <div>
                <label className="mb-2 block text-xm font-medium">
                  Apartment number
                </label>
                <input
                  {...register("apartment_number")}
                  placeholder="A-101"
                  className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                    errors.apartment_number ? "border" : "border"
                  }`}
                />
                {errors.apartment_number && (
                  <p className="mt-1 text-sm">{errors.apartment_number.message}</p>
                )}
              </div>

              <Counter
                label="Floor"
                icon={Building2}
                value={values.floor ?? 0}
                onChange={(v) => setValue("floor", v, { shouldValidate: true })}
                min={-2}
                max={200}
              />

              <div className="rounded-2xl border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border">
                      <Maximize size={18} />
                    </div>
                    <span className="font-medium">Surface area</span>
                  </div>
                  <span className="font-semibold">{values.surface} m²</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={300}
                  value={values.surface}
                  onChange={(e) =>
                    setValue("surface", Number(e.target.value), {
                      shouldValidate: true,
                    })
                  }
                  className="w-full accent-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-xl font-medium">Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        setValue("status", opt.value, { shouldValidate: true })
                      }
                      className={`rounded-xl border py-2.5 text-sm font-medium transition ${
                        values.status === opt.value
                          ? "border-orange-500 bg-orange-50 text-orange-700"
                          : "border hover:border-slate-700"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xl font-medium">Price per night (MAD)</label>
                <input
                  type="number"
                  {...register("price_per_night", { valueAsNumber: true })}
                  className="w-full rounded-xl border px-4 py-3 outline-none transition"
                  placeholder="0"
                />
                {errors.price_per_night && (
                  <p className="mt-1 text-sm">{errors.price_per_night.message}</p>
                )}
              </div>

              <div>
                <label className="mb-4 block text-xl font-medium">View type</label>
                <div className="p-3 flex flex-wrap gap-3 rounded-xl border">
                  {VIEW_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        setValue("view_type", option, { shouldValidate: true })
                      }
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                        values.view_type === option
                          ? "border-orange-500 bg-orange-50 text-orange-700"
                          : "border hover:border-slate-300"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setValue("view_type", "", { shouldValidate: true })
                    }
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      isOtherView
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border hover:border-slate-600"
                    }`}
                  >
                    Other
                  </button>
                </div>
                {isOtherView && (
                  <input
                    {...register("view_type")}
                    placeholder="Describe the view..."
                    className="mt-3 w-full rounded-xl border px-4 py-3 outline-none transition"
                  />
                )}
              </div>

              <div>
                <label className="mb-3 block text-xl font-medium">
                  Description <span className="font-normal">(optional)</span>
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  placeholder="Please Describe What guests should know..."
                  className="w-full h-55 rounded-xl border p-3 outline-none transition"
                />
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Capacity and structure</h2>

              <Counter
                label="Rooms"
                icon={DoorClosed}
                value={values.rooms ?? 0}
                onChange={(v) => setValue("rooms", v, { shouldValidate: true })}
                min={1}
                max={20}
              />
              <Counter
                label="Bedrooms"
                icon={BedDouble}
                value={values.bedrooms ?? 0}
                onChange={(v) =>
                  setValue("bedrooms", v, { shouldValidate: true })
                }
                min={0}
                max={20}
              />
              <Counter
                label="Bathrooms"
                icon={Bath}
                value={values.bathrooms ?? 0}
                onChange={(v) =>
                  setValue("bathrooms", v, { shouldValidate: true })
                }
                min={0}
                max={10}
              />
              <Counter
                label="Guest capacity"
                icon={Users}
                value={values.capacity ?? 0}
                onChange={(v) =>
                  setValue("capacity", v, { shouldValidate: true })
                }
                min={1}
                max={50}
              />
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>
              <h2 className="mb-1 text-xl font-semibold">Equipment</h2>
              <p className="mb-5 text-sm">Select everything this apartment offers.</p>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {APARTMENT_EQUIPMENT.map((item) => {
                  const Icon = item.icon;
                  const isSelected = currentEquipment.some(
                    (e) => e.equipment.toLowerCase() === item.name.toLowerCase()
                  );
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => toggleEquipment(item.name)}
                      className={`relative flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition ${
                        isSelected
                          ? "border-orange-500 bg-orange-50"
                          : "border hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-white">
                          <Check size={12} strokeWidth={3} />
                        </span>
                      )}
                      <Icon
                        size={22}
                        className={isSelected ? "text-orange-600" : ""}
                      />
                      <span
                        className={`text-xs font-medium ${
                          isSelected ? "text-orange-700" : ""
                        }`}
                      >
                        {item.name}
                      </span>
                    </button>
                  );
                })}

                {currentEquipment
                  .filter(
                    (e) =>
                      !APARTMENT_EQUIPMENT.some(
                        (item) =>
                          item.name.toLowerCase() === e.equipment.toLowerCase()
                      )
                  )
                  .map((custom) => {
                    const CustomIcon = getEquipmentIcon(custom.equipment);
                    return (
                      <button
                        key={custom.id}
                        type="button"
                        onClick={() =>
                          custom.id &&
                          apartmentId &&
                          deleteServiceMutation.mutate({
                            apartmentId,
                            equipmentId: custom.id,
                          })
                        }
                        className="relative flex flex-col items-center gap-2 rounded-2xl border border-orange-500 bg-orange-50 p-4 text-center"
                      >
                        <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-white">
                          <Check size={12} strokeWidth={3} />
                        </span>
                        <CustomIcon size={22} className="text-orange-600" />
                        <span className="text-xs font-medium text-orange-700">
                          {custom.equipment}
                        </span>
                      </button>
                    );
                  })}
              </div>

              {showCustomEquipmentInput ? (
                <div className="mt-4 flex gap-2">
                  <input
                    value={customEquipment}
                    onChange={(e) => setCustomEquipment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomEquipment();
                      }
                    }}
                    placeholder="Custom equipment..."
                    autoFocus
                    className="flex-1 rounded-xl border px-4 py-2.5 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={addCustomEquipment}
                    className="rounded-xl bg-orange-500 px-5 font-semibold text-white transition hover:bg-orange-600"
                  >
                    Add
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowCustomEquipmentInput(true)}
                  className="mt-4 text-sm font-semibold text-orange-600 hover:text-orange-700"
                >
                  + Other
                </button>
              )}
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div>
              <h2 className="mb-1 text-xl font-semibold">Photos</h2>
              <p className="mb-5 text-sm">Add a few clear photos. Tap the star to set the cover photo.</p>

              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-10 text-center transition hover:border-orange-400 hover:bg-orange-50/50">
                <Upload size={28} />
                <span className="text-sm font-medium">Click to upload photos</span>
                <span className="text-xs">PNG, JPG up to 10MB each</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {uploadPhotoMutation.isPending && (
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <Loader2 size={16} className="animate-spin" />
                  Uploading...
                </div>
              )}

              {orderedPhotos.length === 0 ? (
                <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed py-8 text-center">
                  <ImageOff size={24} />
                  <p className="mt-2 text-sm">No photos yet — you can add these later too.</p>
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {orderedPhotos.map((photo, index) => {
                    const isDeleting = deletePhotoMutation.isPending && deletePhotoMutation.variables?.photoId === photo.id;
                    return (
                      <div
                        key={photo.id}
                        className="group relative overflow-hidden rounded-2xl"
                      >
                        <img
                          src={photo.photo_url}
                          alt=""
                          className="h-32 w-full object-cover"
                        />

                        {photo.is_primary && (
                          <span className="absolute left-2 top-2 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                            Cover
                          </span>
                        )}

                        <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() =>
                              apartmentId &&
                              setPrimaryMutation.mutate({
                                apartmentId,
                                photoId: photo.id,
                              })
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 transition hover:bg-white"
                            aria-label="Set as cover photo"
                          >
                            <Star
                              size={14}
                              className={
                                photo.is_primary
                                  ? "fill-orange-500 text-orange-500"
                                  : ""
                              }
                            />
                          </button>
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => movePhoto(photo.id, "left")}
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 transition hover:bg-white"
                              aria-label="Move left"
                            >
                              <ChevronLeft size={14} />
                            </button>
                          )}
                          {index < orderedPhotos.length - 1 && (
                            <button
                              type="button"
                              onClick={() => movePhoto(photo.id, "right")}
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 transition hover:bg-white"
                              aria-label="Move right"
                            >
                              <ChevronRight size={14} />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeletePhoto(photo.id)}
                            disabled={isDeleting}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 transition hover:bg-white disabled:opacity-50"
                            aria-label="Delete photo"
                          >
                            {isDeleting ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 5 SUCCESS */}
          {step === 5 && (
            <div className="py-6 text-center ">
             <h1 className="text-6xl">🎉</h1>
              <h2 className="mt-5 text-2xl font-bold">Apartment updated!</h2>
              <p className="mt-2">Apartment {values.apartment_number} has been updated.</p>

              <div className="mt-8 space-y-2">
                <Link
                  to={`/syndic/residences/${apartment.residence_id}/detail`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600"
                >
                  Back to residence
                </Link>
              </div>
            </div>
          )}

          {/* FOOTER NAV */}
          {step < 5 && (
            <div className="mt-8 flex items-center justify-between border-t pt-6">
              <button
                type="button"
                onClick={goBack}
                disabled={step === 1}
                className="text-sm font-semibold transition hover:text-slate-800 disabled:opacity-0"
              >
                Back
              </button>

              <button
                type="button"
                onClick={goNext}
                disabled={updateMutation.isPending}
                className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
              >
                {updateMutation.isPending && <Loader2 size={16} className="animate-spin" />}
                {step === 2 ? "Update Apartment" : step === 4 ? "Finish" : "Next"}
                {!updateMutation.isPending && <ArrowRight size={16} />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}