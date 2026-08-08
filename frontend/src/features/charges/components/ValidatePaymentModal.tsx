import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Loader2 } from "lucide-react";
import { useValidatePayment } from "../hooks/usepayments";

// ─── Validation schema ──────────────────────────────────────────────────
const paymentValidationSchema = z.object({
  payment_date: z.string().min(1, "La date de paiement est requise"),
  payment_method: z.string().min(1, "Le moyen de paiement est requis"),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentValidationSchema>;

interface ValidatePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  chargeId: string;
  ownerId: string;
  validatedBy: string; // syndic ID
}

export function ValidatePaymentModal({
  isOpen,
  onClose,
  chargeId,
  validatedBy,
}: ValidatePaymentModalProps) {
  const [error, setError] = useState<string | null>(null);
  const validatePayment = useValidatePayment();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentValidationSchema),
    defaultValues: {
      payment_date: new Date().toISOString().split("T")[0], // today's date
      payment_method: "",
      reference: "",
      notes: "",
    },
  });

  const onSubmit = async (data: PaymentFormData) => {
    setError(null);
    try {
      await validatePayment.mutateAsync({
        charge_id: chargeId,
        validated_by: validatedBy,
        payment_date: data.payment_date ? new Date(data.payment_date) : undefined,
        payment_method: data.payment_method,
        reference: data.reference,
        notes: data.notes,
      });
      reset();
      onClose();
    } catch (err) {
  setError(   err instanceof Error  ? err.message
    
    : "Une erreur est survenue lors de la validation du paiement.");
}
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-slate-900">Valider un paiement</h3>
          <button
            onClick={() => {
              reset();
              onClose();
            }}
            className="rounded-full p-1 hover:bg-slate-100"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Payment Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Date de paiement</label>
            <input
              type="date"
              {...register("payment_date")}
              className={`mt-1 w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition ${
                errors.payment_date
                  ? "border-red-300 focus:border-red-400"
                  : "border-slate-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              }`}
            />
            {errors.payment_date && (
              <p className="mt-1 text-xs text-red-500">{errors.payment_date.message}</p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Moyen de paiement</label>
            <select
              {...register("payment_method")}
              className={`mt-1 w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition ${
                errors.payment_method
                  ? "border-red-300 focus:border-red-400"
                  : "border-slate-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              }`}
            >
              <option value="">Sélectionner un moyen</option>
              <option value="cash">Espèces</option>
              <option value="bank_transfer">Virement bancaire</option>
              <option value="check">Chèque</option>
              <option value="card">Carte bancaire</option>
              <option value="other">Autre</option>
            </select>
            {errors.payment_method && (
              <p className="mt-1 text-xs text-red-500">{errors.payment_method.message}</p>
            )}
          </div>

          {/* Reference */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Référence</label>
            <input
              type="text"
              {...register("reference")}
              placeholder="Référence (optionnelle)"
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Notes</label>
            <textarea
              {...register("notes")}
              rows={3}
              placeholder="Notes (optionnelles)"
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              Valider
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}