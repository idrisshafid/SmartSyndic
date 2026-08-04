import React, { useState } from "react";
import { Search, X,MapPin ,
   Home, Bed, Bath, Users, Eye, DollarSign, Ruler, ChevronDown, Loader2 } from "lucide-react";

interface Filters {
  query: string;
  bedrooms: number | "";
  bathrooms: number | "";
  capacity: number | "";
  rooms: number | "";
  viewType: string;
  city: string;                     // ✅ nouvelle propriété
  minPrice: number;
  maxPrice: number;
  minSurface: number;
  maxSurface: number;
}

interface SearchBarProps {
  filters: Filters;
  onFilterChange: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  onClearFilters: () => void;
  onSearch: () => void;
  isLoading: boolean;
}

const VIEW_TYPES = [
  "All views",
  "City View",
  "Sea View",
  "Garden View",
  "Pool View",
  "Mountain View",
  "No View",
] as const;

// ─── Liste des villes ──────────────────────────────────────────────────────
const CITIES = [
  "All cities",
  "Casablanca",
  "Rabat",
  "Fès",
  "Marrakech",
  "Tanger",
  "Agadir",
  "Meknès",
  "Oujda",
  "Kenitra",
  "Tétouan",
  "Safi",
  "Mohammedia",
  "Khouribga",
  "El Jadida",
  "Beni Mellal",
  "Ait Melloul",
  "Nador",
  "Taza",
  "Settat",
  "Berrechid",
  "Khemisset",
  "Guelmim",
  "Laâyoune",
  "Dakhla",
] as const;

const PRICE_RANGE = { min: 0, max: 20000 };
const SURFACE_RANGE = { min: 0, max: 300 };

// ─── FilterSelect ──────────────────────────────────────────────────────────

interface FilterSelectProps<T extends string | number> {
  label: string;
  icon?: React.ReactNode;
  value: T;
  onChange: (value: T) => void;
  options: readonly { value: T; label: string }[];
}

function FilterSelect<T extends string | number>({
  label,
  icon,
  value,
  onChange,
  options,
}: FilterSelectProps<T>) {
  return (
    <div className="flex flex-col gap-1">
      <label className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider">
        {icon && <span>{icon}</span>}
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === "") {
              onChange("" as T);
            } else {
              const isNumeric = raw !== "" && !isNaN(Number(raw));
              onChange((isNumeric ? Number(raw) : raw) as T);
            }
          }}
          className="w-full appearance-none rounded-lg border py-1.5 pl-2.5 pr-7 text-xs font-medium outline-none transition cursor-pointer"
        >
          {options.map((opt) => (
            <option key={String(opt.value)} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2" />
      </div>
    </div>
  );
}

// ─── Dual Range Slider ──────────────────────────────────────────────────────

interface DualRangeSliderProps {
  label: string;
  icon?: React.ReactNode;
  minValue: number;
  maxValue: number;
  onMinChange: (val: number) => void;
  onMaxChange: (val: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
}

function DualRangeSlider({
  label,
  icon,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  min,
  max,
  step,
  unit,
}: DualRangeSliderProps) {
  const [activeThumb, setActiveThumb] = useState<"min" | "max">("min");

  const minPercent = Math.min(100, Math.max(0, ((minValue - min) / (max - min)) * 100));
  const maxPercent = Math.min(100, Math.max(0, ((maxValue - min) / (max - min)) * 100));

  return (
    <div className="flex flex-col gap-1.5 rounded-lg border p-2.5">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider">
          {icon && <span>{icon}</span>}
          {label}
        </label>
        <span className="text-[10px] font-semibold text-orange-600 px-2 py-0.5 rounded border border-orange-200/50">
          {minValue} – {maxValue} {unit}
        </span>
      </div>

      <div className="relative py-1 flex items-center">
        <div className="h-1 w-full rounded-full relative">
          <div
            className="absolute h-full rounded-full bg-orange-500"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`,
            }}
          />
        </div>

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onMouseDown={() => setActiveThumb("min")}
          onTouchStart={() => setActiveThumb("min")}
          onChange={(e) => {
            const val = Number(e.target.value);
            if (val <= maxValue) onMinChange(val);
          }}
          style={{ zIndex: activeThumb === "min" || minValue === max ? 30 : 20 }}
          className="pointer-events-none absolute left-0 w-full appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-orange-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-orange-500 [&::-moz-range-thumb]:shadow-md"
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onMouseDown={() => setActiveThumb("max")}
          onTouchStart={() => setActiveThumb("max")}
          onChange={(e) => {
            const val = Number(e.target.value);
            if (val >= minValue) onMaxChange(val);
          }}
          style={{ zIndex: activeThumb === "max" ? 30 : 20 }}
          className="pointer-events-none absolute left-0 w-full appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-orange-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-orange-500 [&::-moz-range-thumb]:shadow-md"
        />
      </div>
    </div>
  );
}

// ─── Main SearchBar (compact) ─────────────────────────────────────────────

export default function SearchBar({
  filters,
  onFilterChange,
  onClearFilters,
  onSearch,
  isLoading,
}: SearchBarProps) {
  return (
    <div className="w-full max-w-6xl rounded-xl border p-3 shadow-sm">
      {/* Search Input Row */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by apartment number, building, or keyword..."
            value={filters.query}
            onChange={(e) => onFilterChange("query", e.target.value)}
            className="w-full rounded-lg border py-2 pl-8 pr-8 text-sm outline-none transition"
          />
          {filters.query && (
            <button
              onClick={() => onFilterChange("query", "")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-0.5 transition"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClearFilters}
            className="inline-flex items-center justify-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold transition active:scale-[0.98]"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
          <button
            onClick={onSearch}
            disabled={isLoading}
            className="inline-flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-lg bg-orange-500 px-4 py-1.5 text-xs font-semibold text-white shadow transition hover:bg-orange-600 active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Search className="h-3.5 w-3.5" />
            )}
            Search
          </button>
        </div>
      </div>

      <div className="my-3 h-px" />

      {/* Filter Options */}
      <div className="space-y-3">
        {/* Selects row */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6 p-2 bg-white text-slate-900 shadow-sm border rounded-lg">
          <FilterSelect
            label="Bedrooms"
            icon={<Bed size={13} />}
            value={filters.bedrooms}
            onChange={(val) => onFilterChange("bedrooms", val)}
            options={[
              { value: "", label: "Any" },
              ...Array.from({ length: 6 }, (_, i) => ({ value: i, label: `${i} Bed${i !== 1 ? 's' : ''}` })),
            ]}
          />

          <FilterSelect
            label="Bathrooms"
            icon={<Bath size={13} />}
            value={filters.bathrooms}
            onChange={(val) => onFilterChange("bathrooms", val)}
            options={[
              { value: "", label: "Any" },
              ...Array.from({ length: 5 }, (_, i) => ({ value: i, label: `${i} Bath${i !== 1 ? 's' : ''}` })),
            ]}
          />

          <FilterSelect
            label="Capacity"
            icon={<Users size={13} />}
            value={filters.capacity}
            onChange={(val) => onFilterChange("capacity", val)}
            options={[
              { value: "", label: "Any" },
              ...Array.from({ length: 6 }, (_, i) => ({ value: i + 1, label: `${i + 1}+ guests` })),
              { value: 8, label: "8+ guests" },
              { value: 10, label: "10+ guests" },
            ]}
          />

          <FilterSelect
            label="Rooms"
            icon={<Home size={13} />}
            value={filters.rooms}
            onChange={(val) => onFilterChange("rooms", val)}
            options={[
              { value: "", label: "Any" },
              ...Array.from({ length: 10 }, (_, i) => ({ value: i + 1, label: `${i + 1} Room${i > 0 ? 's' : ''}` })),
            ]}
          />

          <FilterSelect
            label="View"
            icon={<Eye size={13} />}
            value={filters.viewType}
            onChange={(val) => onFilterChange("viewType", val)}
            options={VIEW_TYPES.map((v) => ({ value: v, label: v }))}
          />

          {/* ✅ Nouveau filtre City */}
          <FilterSelect
            label="City"
            icon={<MapPin size={13} />}    // on utilise l'icône MapPin (à importer)
            value={filters.city}
            onChange={(val) => onFilterChange("city", val)}
            options={CITIES.map((city) => ({ value: city, label: city }))}
          />
        </div>

        {/* Sliders row */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <DualRangeSlider
            label="Price / night"
            icon={<DollarSign size={13} />}
            minValue={filters.minPrice}
            maxValue={filters.maxPrice}
            onMinChange={(val) => onFilterChange("minPrice", val)}
            onMaxChange={(val) => onFilterChange("maxPrice", val)}
            min={PRICE_RANGE.min}
            max={PRICE_RANGE.max}
            step={50}
            unit="MAD"
          />

          <DualRangeSlider
            label="Surface"
            icon={<Ruler size={13} />}
            minValue={filters.minSurface}
            maxValue={filters.maxSurface}
            onMinChange={(val) => onFilterChange("minSurface", val)}
            onMaxChange={(val) => onFilterChange("maxSurface", val)}
            min={SURFACE_RANGE.min}
            max={SURFACE_RANGE.max}
            step={5}
            unit="m²"
          />
        </div>
      </div>
    </div>
  );
}