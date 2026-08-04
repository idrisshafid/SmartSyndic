import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  residenceSchema,
  type ResidenceFormData,
} from "../schema/residence.schema";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import {
  useCreateResidence,
  useUpdateResidence,
} from "../hooks/residence.hook";

import type { Residence } from "../types/residence.types";

interface ResidenceFormProps {
  residence?: Residence;
  onSuccess?: (residence?: Residence) => void;
}

// Converts an empty input value to `undefined` instead of NaN,
// so optional numeric fields validate correctly.
const toOptionalNumber = (value: string) =>
  value === "" ? undefined : Number(value);

export default function ResidenceForm({
  residence,onSuccess,}: ResidenceFormProps) {
  const isEdit = !!residence;

  const createMutation = useCreateResidence();
  const updateMutation = useUpdateResidence();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResidenceFormData>({
    resolver: zodResolver(residenceSchema),
defaultValues: {
  name: residence?.name ?? "",
  address: residence?.address ?? "",
  city: residence?.city ?? "",
  description: residence?.description ?? "",
  latitude: residence?.latitude,
  longitude: residence?.longitude,
},
  });

  const onSubmit = (data: ResidenceFormData) => {
    if (isEdit) {
      updateMutation.mutate(
        { id: residence.id, data },
        { onSuccess: () => onSuccess?.(residence) }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: (response) => {
          const created = response?.data ?? response;
          onSuccess?.(created);
        },
      });
    }
  };

  const loading = createMutation.isPending || updateMutation.isPending;
  const mutationError = createMutation.error ?? updateMutation.error;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-3xl bg-white p-8 shadow"
    >
      <h2 className="text-2xl font-bold text-slate-900">
        {isEdit ? "Update Residence" : "Create Residence"}
      </h2>

      {mutationError && (
        <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {mutationError instanceof Error
            ? mutationError.message
            : "Something went wrong. Please try again."}
        </p>
      )}

      <Input
        label="Residence Name"
        placeholder="Atlas Residence"
        {...register("name")}
        error={errors.name?.message}
      />

      <Input
        label="Address"
        placeholder="123 Main Street"
        {...register("address")}
        error={errors.address?.message}
      />

      <Input
        label="City"
        placeholder="Fes"
        {...register("city")}
        error={errors.city?.message}
      />

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Description
        </label>

        <textarea
          {...register("description")}
          rows={4}
          className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-orange-500"
          placeholder="Describe residence..."
        />

        {errors.description && (
          <p className="mt-1 text-sm text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Latitude"
          type="number"
          step="any"
          {...register("latitude", { setValueAs: toOptionalNumber })}
          error={errors.latitude?.message}
        />

        <Input
          label="Longitude"
          type="number"
          step="any"
          {...register("longitude", { setValueAs: toOptionalNumber })}
          error={errors.longitude?.message}
        />
      </div>

      <Button type="submit" loading={loading}>
        {isEdit ? "Save Changes" : "Create Residence"}
      </Button>
    </form>
  );
}