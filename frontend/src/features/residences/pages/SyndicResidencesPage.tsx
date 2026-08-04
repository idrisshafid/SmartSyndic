import { Link } from "react-router-dom";
import { Plus, Building2 } from "lucide-react";

import { useResidences } from "../hooks/residence.hook";
import ResidenceCard from "../components/ResidenceCard";

export default function SyndicResidencesPage() {
  const { data, isLoading, isError, error } = useResidences();

  const residences = data?.data.residences ?? [];
  const total = residences.length;

  return (
    <div className="w-full min-h-screen">
      {/* HEADER */}
      <div className="border-b backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-10 py-6">
          <div>
            <p className="text-4xl font-bold tracking-tight">
              Residences
            </p>
          </div>

          {/* ✅ Bouton principal – couleurs conservées */}
          <Link
            to="/syndic/residences/create"
            className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 
            px-5 py-3 text-sm font-semibold text-white shadow-sm transition 
            hover:bg-orange-600 hover:shadow-md"
          >
            <Plus size={18} />
            New Residence
          </Link>
        </div>
        <p className="pb-3 text-xl items-center rounded-2xl tracking-tight px-10">
          {isLoading
            ? "Loading..."
            : `Manage, Edit, and Add Apartments to your ${total} Residence${total === 1 ? "" : "s"}`}
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* LOADING */}
        {isLoading && (
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item}>
                <div className="aspect-[4/3] animate-pulse rounded-2xl" />
                <div className="mt-3 space-y-2">
                  <div className="h-4 w-2/3 animate-pulse rounded" />
                  <div className="h-3 w-1/2 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ERROR */}
        {isError && (
          <div className="flex flex-col items-center justify-center rounded-3xl border py-16 text-center">
            <h2 className="text-lg font-semibold">
              Couldn&apos;t load residences
            </h2>
            <p className="mt-2 text-sm mx-2">
              {error instanceof Error ? error.message : "something wrong"}
            </p>
          </div>
        )}

        {/* EMPTY */}
        {!isLoading && !isError && residences.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed py-20 text-center">
            <Building2 size={40} />
            <h2 className="mt-4 text-lg font-semibold">
              No residences yet
            </h2>
            <p className="mt-1 max-w-sm text-sm">
              Create your first residence to start managing photos, services and apartments.
            </p>
            <Link
              to="/syndic/residences/create"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              <Plus size={18} />
              Create Residence
            </Link>
          </div>
        )}

        {/* GRID */}
        {!isLoading && !isError && residences.length > 0 && (
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {residences.map((residence) => (
              <ResidenceCard
                key={residence.id}
                residence={residence}
                to={`/syndic/residences/${residence.id}/detail`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}