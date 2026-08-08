import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createIncidentSchema, type CreateIncidentFormData } from "../schema/incident.schema";
import { useIncident, useUpdateIncident } from "../hooks/useIncidents";
import {
  useUploadIncidentPhoto,
  useIncidentPhotos,
  useDeleteIncidentPhoto,
} from "../hooks/useIncidentPhotos";
import type { IncidentPriority } from "../types/incident.types";
import {
  ArrowLeft,
  Check,
  Loader2,
  AlertCircle,
  FileText,
  Tag,
  AlignLeft,
  CheckCircle,
  ChevronRight,
  Camera,
  X,
} from "lucide-react";

const STEPS = [
  { number: 1, label: "Détails" },
  { number: 2, label: "Description" },
  { number: 3, label: "Confirmation" },
  { number: 4, label: "Photos" },
];

const PRIORITY_OPTIONS: { value: IncidentPriority; label: string }[] = [
  { value: "low", label: "Basse" },
  { value: "normal", label: "Normale" },
  { value: "high", label: "Haute" },
  { value: "urgent", label: "Urgente" },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="mb-8 flex items-center justify-center">
      {STEPS.map((s, i) => (
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
          {i < STEPS.length - 1 && (
            <div
              className={`mx-2 mb-5 h-0.5 w-14 sm:w-20 ${
                current > s.number ? "bg-orange-500" : "border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function EditIncidentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null);

  const { data: incident, isLoading, isError } = useIncident(id ?? "");
  const updateIncident = useUpdateIncident();
  const uploadPhoto = useUploadIncidentPhoto();
  const deletePhoto = useDeleteIncidentPhoto();
  const { data: photos, refetch: refetchPhotos } = useIncidentPhotos(id ?? "");

  const {
    register,
    handleSubmit,
    control,
    trigger,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateIncidentFormData>({
    resolver: zodResolver(createIncidentSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "",
      priority: "normal",
    },
  });

  useEffect(() => {
    if (incident) {
      reset({
        title: incident.title,
        description: incident.description,
        type: incident.type || "",
        priority: incident.priority,
      });
    }
  }, [incident, reset]);

  const descriptionValue = useWatch({ control, name: "description" }) || "";
  const selectedPriority = useWatch({ control, name: "priority" });

  const goBack = () => {
    if (step === 1) {
      navigate(`/owner/incidents/${id}`);
    } else if (step === 4) {
      setStep(3);
    } else {
      setStep((s) => (s - 1) as 1 | 2);
    }
  };

  const goNext = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await trigger(["title", "type", "priority"]);
    } else if (step === 2) {
      isValid = await trigger(["description"]);
    }
    if (isValid) {
      setStep((s) => (s + 1) as 2 | 3);
    }
  };

  const onSubmit = async (data: CreateIncidentFormData) => {
    setSubmitError(null);
    try {
      await updateIncident.mutateAsync({ id: id!, data });
      setStep(4);

    }  catch (error) {
       const message = error instanceof Error
      ? error.message
      : "Erreur lors de la mise à jour de l'incident.";

      setSubmitError(message);
         }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !id) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await uploadPhoto.mutateAsync({ incidentId: id, file });
      }
      await refetchPhotos();
    } catch (error) {
      const message =  error instanceof Error
      ? error.message
      : "Erreur inconnue lors de l'upload.";
      alert(`Erreur lors de l'upload : ${message}`);

    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!window.confirm("Supprimer cette photo ?")) return;
    setDeletingPhotoId(photoId);
    try {
      await deletePhoto.mutateAsync(photoId);
      await refetchPhotos();
    } catch (error) {
       const message =   error instanceof Error
      ? error.message
      : "Erreur inconnue lors de la suppression.";

     alert(`Erreur lors de la suppression : ${message}`);

    } finally {
      setDeletingPhotoId(null);
    }
  };

  const handleFinish = () => {
    navigate(`/owner/incidents/${id}`);
  };

  const formData = getValues();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 size={32} className="animate-spin text-orange-500" />
      </div>
    );
  }

  if (isError || !incident) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-center px-4">
        <AlertCircle size={48} />
        <h2 className="mt-4 text-2xl font-bold">Incident introuvable</h2>
        <p className="mt-1 text-sm">L'incident que vous cherchez n'existe pas.</p>
        <Link
          to="/owner/incidents"
          className="mt-6 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
        >
          Retour aux incidents
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-2xl px-4">
        <button
          onClick={goBack}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium transition"
        >
          <ArrowLeft size={16} />
          Retour
        </button>

        <div className="mb-2 text-center">
          <h1 className="text-2xl font-bold">Modifier l'incident</h1>
          <p className="mt-1 text-sm">
            Mettez à jour les informations de l'incident.
          </p>
        </div>

        <StepIndicator current={step} />

        <div className="rounded-3xl p-6 shadow-sm border">
          {/* ─── STEP 1 ─── */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">Détails de l'incident</h2>

              <div>
                <label className="block text-sm font-medium">Titre *</label>
                <div className="relative mt-1">
                  <FileText size={18} className="absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    {...register("title")}
                    placeholder="Courte description du problème"
                    className="w-full rounded-xl border pl-10 pr-4 py-2.5 outline-none transition focus:border-orange-500"
                  />
                </div>
                {errors.title && (
                  <p className="mt-1 text-xs">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">Type (optionnel)</label>
                <div className="relative mt-1">
                  <Tag size={18} className="absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    {...register("type")}
                    placeholder="Ex: Plomberie, Électricité, etc."
                    className="w-full rounded-xl border pl-10 pr-4 py-2.5 outline-none transition focus:border-orange-500"
                  />
                </div>
                {errors.type && <p className="mt-1 text-xs">{errors.type.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium">Priorité *</label>
                <div className="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {PRIORITY_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={`cursor-pointer rounded-xl border-2 p-3 text-center text-sm font-medium transition ${
                        selectedPriority === opt.value
                          ? "border-orange-500 bg-orange-50 text-orange-700"
                          : "border hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        value={opt.value}
                        {...register("priority")}
                        className="sr-only"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
                {errors.priority && (
                  <p className="mt-1 text-xs">{errors.priority.message}</p>
                )}
              </div>
            </div>
          )}

          {/* ─── STEP 2 ─── */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">Description détaillée</h2>

              <div>
                <label className="block text-sm font-medium">Description *</label>
                <div className="relative mt-1">
                  <AlignLeft size={18} className="absolute left-3 top-3" />
                  <textarea
                    {...register("description")}
                    rows={6}
                    placeholder="Décrivez précisément le problème..."
                    className="w-full rounded-xl border pl-10 pr-4 py-2.5 outline-none transition focus:border-orange-500"
                  />
                </div>
                <div className="mt-1 flex justify-between text-xs">
                  <span>{errors.description?.message}</span>
                  <span className={`font-mono ${descriptionValue.length > 2000 ? "text-red-500" : ""}`}>
                    {descriptionValue.length} / 2000
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ─── STEP 3 ─── */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Vérification</h2>

              <div className="rounded-2xl border p-4 space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm">Titre</span>
                  <span className="text-sm font-medium">{formData.title}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm">Type</span>
                  <span className="text-sm font-medium">
                    {formData.type || "Non spécifié"}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm">Priorité</span>
                  <span className="text-sm font-medium">
                    {PRIORITY_OPTIONS.find((p) => p.value === formData.priority)?.label || formData.priority}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Description</span>
                  <span className="text-sm font-medium max-w-[60%] truncate">
                    {formData.description}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm font-medium text-orange-600 hover:text-orange-700"
              >
                <CheckCircle size={14} className="inline mr-1" />
                Modifier
              </button>

              {submitError && (
                <div className="rounded-xl border p-3 text-sm">
                  <AlertCircle size={16} className="inline mr-1.5" />
                  {submitError}
                </div>
              )}

              <button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                {isSubmitting ? "Mise à jour..." : "Mettre à jour l'incident"}
              </button>
            </div>
          )}

          {/* ─── STEP 4 ─── */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Ajouter des photos</h2>
              <p className="text-sm">
                Vous pouvez ajouter des photos pour illustrer l'incident (optionnel).
              </p>

              <div className="rounded-2xl border-2 border-dashed p-6 text-center transition hover:border-orange-400 hover:bg-orange-50/30">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="photo-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="photo-upload"
                  className="flex cursor-pointer flex-col items-center gap-2"
                >
                  <Camera size={32} />
                  <span className="text-sm font-medium">
                    {uploading ? "Envoi en cours..." : "Cliquez pour sélectionner des photos"}
                  </span>
                  <span className="text-xs">JPG, PNG, WEBP jusqu'à 10MB</span>
                </label>
              </div>

              {uploading && (
                <div className="flex items-center gap-2 text-sm">
                  <Loader2 size={16} className="animate-spin" />
                  Téléchargement...
                </div>
              )}

              {photos && photos.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-medium">
                    Photos téléchargées ({photos.length})
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {photos.map((photo) => (
                      <div
                        key={photo.id}
                        className="relative aspect-square overflow-hidden rounded-xl group"
                      >
                        <img
                          src={photo.photo_url}
                          alt="Incident"
                          className="h-full w-full object-cover"
                        />
                        <button
                          onClick={() => handleDeletePhoto(photo.id)}
                          disabled={deletingPhotoId === photo.id}
                          className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white transition hover:bg-black/80 disabled:opacity-50"
                          title="Supprimer"
                        >
                          {deletingPhotoId === photo.id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <X size={12} />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleFinish}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                <Check size={18} />
                Terminer
              </button>
            </div>
          )}
        </div>

        {/* ─── Navigation ─── */}
        {step < 3 && (
          <div className="mt-6 flex justify-between">
            <button
              onClick={goBack}
              className="rounded-xl border px-5 py-2 text-sm font-medium transition hover:bg-slate-50"
            >
              Retour
            </button>
            <button
              onClick={goNext}
              className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Suivant
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="mt-6 flex justify-start">
            <button
              onClick={() => setStep(2)}
              className="rounded-xl border px-5 py-2 text-sm font-medium transition hover:bg-slate-50"
            >
              Retour
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="mt-6 flex justify-start">
            <button
              onClick={() => setStep(3)}
              className="rounded-xl border px-5 py-2 text-sm font-medium transition hover:bg-slate-50"
            >
              Retour
            </button>
          </div>
        )}
      </div>
    </div>
  );
}