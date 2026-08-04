import { useState } from "react";

import {
  useResidenceServices,
  useAddResidenceService,
  useDeleteResidenceService,
} from "../hooks/useResidenceServices";

import type { service as Service } from "../types/residence.types";

interface ResidenceServicesProps {
  residenceId: string;
}

export default function ResidenceServices({
  residenceId,
}: ResidenceServicesProps) {
  const [serviceName, setServiceName] = useState("");

  const { data, isLoading, isError } = useResidenceServices(residenceId);
  const addMutation = useAddResidenceService();
  const deleteMutation = useDeleteResidenceService();

  const handleAdd = () => {
    const name = serviceName.trim();
    if (!name) return;

    const service: Service = {
      residence_id: residenceId,
      serviceName: name,
    };

    addMutation.mutate(
      { id: residenceId, data: service },
      { onSuccess: () => setServiceName("") }
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAdd();
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-14 animate-pulse rounded-xl"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="rounded-xl p-4 text-sm">
        Couldn&apos;t load services. Please try again.
      </p>
    );
  }

  const services: Service[] = data?.data ?? [];

  return (
    <div className="space-y-6">
      {/* Add Service */}
      <div className="flex gap-3">
        <input
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Example: Parking"
          className="flex-1 rounded-xl border px-4 py-3 outline-none"
        />

        <button
          onClick={handleAdd}
          disabled={addMutation.isPending || !serviceName.trim()}
          className="rounded-xl bg-orange-500 px-5 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
        >
          {addMutation.isPending ? "Adding..." : "Add"}
        </button>
      </div>

      {/* Services List */}
      <div className="space-y-3">
        {services.length === 0 && (
          <div className="rounded-xl border border-dashed py-8 text-center">
            <p className="text-sm">No services added yet.</p>
          </div>
        )}

        {services.map((service) => (
          <div
            key={service.id}
            className="flex items-center justify-between rounded-xl p-4"
          >
            <p className="font-medium">
              {service.serviceName}
            </p>

            <button
              onClick={() =>
                deleteMutation.mutate({
                  residenceId,
                  serviceId: service.id,
                })
              }
              disabled={deleteMutation.isPending}
              className="text-sm font-medium text-red-500 transition hover:text-red-700 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}