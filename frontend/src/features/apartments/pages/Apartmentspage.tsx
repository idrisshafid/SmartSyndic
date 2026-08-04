import { useState, useMemo, useEffect } from "react";
import { Building2 } from "lucide-react";

import { useSearchApartments } from "../hooks/Apartment.hook";
import ApartmentCard from "../components/apartmentCard";
import SearchBar from "../components/SearchBar";

interface Filters {
  query: string;
  bedrooms: number | "";
  bathrooms: number | "";
  capacity: number | "";
  rooms: number | "";
  viewType: string;
  city: string;                    
  minPrice: number;
  maxPrice: number;
  minSurface: number;
  maxSurface: number;
}

const PRICE_RANGE = { min: 0, max: 20000 };
const SURFACE_RANGE = { min: 0, max: 300 };

export default function ApartmentsSearchPage() {
  const [filters, setFilters] = useState<Filters>({
    query: "",
    bedrooms: "",
    bathrooms: "",
    capacity: "",
    rooms: "",
    viewType: "All views",
    city: "All cities",             // ✅ valeur par défaut
    minPrice: PRICE_RANGE.min,
    maxPrice: PRICE_RANGE.max,
    minSurface: SURFACE_RANGE.min,
    maxSurface: SURFACE_RANGE.max,
  });

  const { data, isLoading, isError, error, refetch } = useSearchApartments({});

  useEffect(() => {
    console.log("Filters changed:", filters);
  }, [filters]);

  const filteredApartments = useMemo(() => {
    const all = data?.data ?? [];
    console.log("Filtering apartments, total:", all.length);

    return all.filter((apt) => {
      const query = filters.query.trim().toLowerCase();
      if (query) {
        const numberMatch = apt.apartment_number.toLowerCase().includes(query);
        const descMatch = apt.description?.toLowerCase().includes(query) ?? false;
        if (!numberMatch && !descMatch) return false;                                }

      if (filters.bedrooms !== "" && apt.bedrooms !== filters.bedrooms) return false;
      if (filters.bathrooms !== "" && apt.bathrooms !== filters.bathrooms) return false;
      if (filters.capacity !== "" && apt.capacity !== filters.capacity) return false;
      if (filters.rooms !== "" && apt.rooms !== filters.rooms) return false;

      if (filters.viewType !== "All views" && apt.view_type !== filters.viewType) return false;

      // ✅ Filtre City
      if (filters.city !== "All cities" && apt.city !== filters.city) return false;

      const price = apt.price_per_night ?? 0;
      if (price < filters.minPrice || price > filters.maxPrice) return false;

      const surface = apt.surface ?? 0;
      if (surface < filters.minSurface || surface > filters.maxSurface) return false;

      return true;
    });
  }, [
    data,
    filters.query,
    filters.bedrooms,
    filters.bathrooms,
    filters.capacity,
    filters.rooms,
    filters.viewType,
    filters.city,                 // ✅ dépendance ajoutée
    filters.minPrice,
    filters.maxPrice,
    filters.minSurface,
    filters.maxSurface,
  ]);

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      query: "",
      bedrooms: "",
      bathrooms: "",
      capacity: "",
      rooms: "",
      viewType: "All views",
      city: "All cities",           // ✅ reset
      minPrice: PRICE_RANGE.min,
      maxPrice: PRICE_RANGE.max,
      minSurface: SURFACE_RANGE.min,
      maxSurface: SURFACE_RANGE.max,
    });
  };

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="min-h-screen">
      <div className="border-b backdrop-blur-md">
        <div className="mx-auto max-w-7xl py-2 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-medium tracking-tight text-center">
            Find Your Perfect Apartment
          </h1>
        </div>
      </div>

      <div className="w-full px-3 py-4 sm:px-3 lg:px-8">
        <SearchBar
          filters={filters}
          onFilterChange={updateFilter}
          onClearFilters={clearFilters}
          onSearch={() => refetch()}
          isLoading={isLoading}
        />

        <div className="mt-8">
          {isLoading ? (
            <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div key={item}>
                  <div className="aspect-[4/3] animate-pulse rounded-2xl" />
                  <div className="mt-3 space-y-2">
                    <div className="h-4 w-2/3 animate-pulse rounded" />
                    <div className="h-3 w-1/2 animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border py-16 text-center">
              <h2 className="text-lg font-semibold">
                Couldn't load apartments
              </h2>
              <p className="mt-1 text-sm">
                {error instanceof Error ? error.message : "Unknown error"}
              </p>
            </div>
          ) : filteredApartments.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed py-20 text-center">
              <Building2 size={40} />
              <h2 className="mt-4 text-lg font-semibold">
                No apartments found
              </h2>
              <p className="mt-1 max-w-sm text-sm">
                Try adjusting your filters or clear them to see more results.
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 inline-flex items-center gap-1 rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-orange-600"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredApartments.map((apartment) => (
                <ApartmentCard key={apartment.id} apartment={apartment} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}