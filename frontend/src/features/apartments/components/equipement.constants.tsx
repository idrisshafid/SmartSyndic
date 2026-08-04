import {
  Wifi,
  Snowflake,
  Flame,
  ChefHat,
  ArrowUpDown,
  Car,
  Waves,
  DoorOpen,
  Trees,
  Shirt,
  Tv,
  ShieldCheck,
  Sunset,
  Sparkles,
  Wind,
  Bath,
  Sofa,
  UtensilsCrossed,
  Coffee,
  Microwave,
  Refrigerator,
  Dumbbell,
  Baby,
  Accessibility,
  CigaretteOff,
  PawPrint,
  KeyRound,
  Thermometer,
  Fan,
  Lamp,
  type LucideIcon,
} from "lucide-react";

export interface EquipmentOption {
  name: string;
  icon: LucideIcon;
  category?: "comfort" | "kitchen" | "outdoor" | "safety" | "entertainment" | "access";
}

/**
 * Canonical catalog of apartment equipment.
 * Used to derive icons from stored equipment names
 * (Service_Equipment only stores the string, no icon field).
 */
export const APARTMENT_EQUIPMENT: EquipmentOption[] = [
  // Comfort
  { name: "WiFi", icon: Wifi, category: "comfort" },
  { name: "Air Conditioning", icon: Snowflake, category: "comfort" },
  { name: "Heating", icon: Flame, category: "comfort" },
  { name: "Fan", icon: Fan, category: "comfort" },
  { name: "Thermostat", icon: Thermometer, category: "comfort" },

  // Kitchen
  { name: "Kitchen", icon: ChefHat, category: "kitchen" },
  { name: "Fully Equipped Kitchen", icon: UtensilsCrossed, category: "kitchen" },
  { name: "Coffee Machine", icon: Coffee, category: "kitchen" },
  { name: "Microwave", icon: Microwave, category: "kitchen" },
  { name: "Refrigerator", icon: Refrigerator, category: "kitchen" },
  { name: "Dishwasher", icon: Sparkles, category: "kitchen" },

  // Access & Building
  { name: "Elevator", icon: ArrowUpDown, category: "access" },
  { name: "Parking", icon: Car, category: "access" },
  { name: "Private Entrance", icon: KeyRound, category: "access" },
  { name: "Wheelchair Accessible", icon: Accessibility, category: "access" },

  // Outdoor
  { name: "Pool", icon: Waves, category: "outdoor" },
  { name: "Balcony", icon: DoorOpen, category: "outdoor" },
  { name: "Terrace", icon: Sunset, category: "outdoor" },
  { name: "Garden", icon: Trees, category: "outdoor" },
  { name: "Sea View", icon: Sunset, category: "outdoor" },
  { name: "Mountain View", icon: Trees, category: "outdoor" },

  // Laundry & Living
  { name: "Washing Machine", icon: Shirt, category: "comfort" },
  { name: "Dryer", icon: Wind, category: "comfort" },
  { name: "Bathtub", icon: Bath, category: "comfort" },
  { name: "Living Room", icon: Sofa, category: "comfort" },
  { name: "Workspace", icon: Lamp, category: "comfort" },

  // Entertainment
  { name: "TV", icon: Tv, category: "entertainment" },
  { name: "Smart TV", icon: Tv, category: "entertainment" },
  { name: "Gym", icon: Dumbbell, category: "entertainment" },

  // Safety & Rules
  { name: "Security", icon: ShieldCheck, category: "safety" },
  { name: "Smoke Detector", icon: ShieldCheck, category: "safety" },
  { name: "Non Smoking", icon: CigaretteOff, category: "safety" },
  { name: "Pet Friendly", icon: PawPrint, category: "safety" },
  { name: "Baby Friendly", icon: Baby, category: "safety" },
];

/**
 * Returns the Lucide icon for a given equipment name.
 * Matching is case-insensitive and tolerates minor variations.
 * Falls back to Sparkles when no match is found.
 */
export function getEquipmentIcon(equipmentName: string): LucideIcon {
  if (!equipmentName?.trim()) return Sparkles;

  const normalized = equipmentName.trim().toLowerCase();

  // Exact match first
  const exact = APARTMENT_EQUIPMENT.find(
    (item) => item.name.toLowerCase() === normalized
  );
  if (exact) return exact.icon;

  // Partial / fuzzy match (e.g. "AC" → Air Conditioning, "Wifi" → WiFi)
  const partial = APARTMENT_EQUIPMENT.find(
    (item) =>
      item.name.toLowerCase().includes(normalized) ||
      normalized.includes(item.name.toLowerCase())
  );

  return partial?.icon ?? Sparkles;
}

/**
 * Optional helper — group equipment by category for richer UIs.
 */
export function groupEquipmentByCategory(
  names: string[]
): Record<string, { name: string; icon: LucideIcon }[]> {
  const groups: Record<string, { name: string; icon: LucideIcon }[]> = {};

  names.forEach((name) => {
    const entry = APARTMENT_EQUIPMENT.find(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );
    const category = entry?.category ?? "other";
    if (!groups[category]) groups[category] = [];
    groups[category].push({
      name,
      icon: entry?.icon ?? Sparkles,
    });
  });

  return groups;
}