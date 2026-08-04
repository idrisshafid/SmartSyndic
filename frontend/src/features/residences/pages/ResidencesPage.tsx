import { Building2, Sparkles } from "lucide-react";

import { usePublicResidences } from "../hooks/residence.hook";
import ResidenceCard from "../components/ResidenceCard";

export default function PublicResidencesPage() {
  const { data, isLoading, isError, error } = usePublicResidences();

  // Safely extract residences and total count from your hook response
  const residences = data?.data?.residences ?? [];
  const total = data?.data?.total ?? residences.length;

  return (
    <div className="w-full space-y-6 pb-12">
      {/* COMPACT PAGE HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
           
        <div>
      <h1 className="mt-2 px-4 text-2xl font-semibold text-center tracking-tight p-3 pl-22">
         Explore available residences and find the perfect apartment for you.
            </h1>

          <div/>
    
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 
          py-1 text-xs font-semibold text-slate-700">
            <Sparkles size={13} className="text-indigo-600" />
            {isLoading
              ? "Chargement..."
              : `${total} residence${total === 1 ? "" : "s"} disponible${total === 1 ? "" : "s"}`}
          </span>
        </div>
      </div>

      {/* SKELETON LOADING STATE */}
      {isLoading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm"
            >
              <div className="aspect-[4/3] w-full animate-pulse rounded-xl bg-slate-200" />
              <div className="mt-3 space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ERROR STATE */}
      {isError && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/50 py-16 text-center">
          <h2 className="text-base font-semibold text-rose-900">
            Impossible de charger les résidences
          </h2>
          <p className="mt-1 text-sm text-rose-600">
            {error instanceof Error ? error.message : "Une erreur est survenue"}
          </p>
        </div>
      )}

      {/* EMPTY STATE */}
      {!isLoading && !isError && residences.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Building2 size={24} />
          </div>
          <h2 className="mt-4 text-base font-bold text-slate-800">
            Aucune résidence disponible
          </h2>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Revenez plus tard — de nouvelles résidences sont ajoutées régulièrement.
          </p>
        </div>
      )}

      {/* RESIDENCES CARD GRID */}
      {!isLoading && !isError && residences.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {residences.map((residence) => (
            <ResidenceCard key={residence.id} residence={residence} />
          ))}
        </div>
      )}
    </div>
  );
}