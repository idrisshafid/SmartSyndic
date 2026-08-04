import {
  Car,
  ArrowUpDown,
  Waves,
  Dumbbell,
  Wifi,
  ShieldCheck,
  Trees,
  Gamepad2,
  Shirt,
  Snowflake,
  Camera, PawPrint,  Wrench,  type LucideIcon,} from "lucide-react";

export interface AmenityOption {
  name: string;
  iconName: string;
  icon: LucideIcon;            }

export const AMENITIES: AmenityOption[] = [

  { name: "Parking", iconName: "car",  icon: Car },
  { name: "Elevator", iconName: "arrow-up-down",  icon: ArrowUpDown },
  { name: "Swimming Pool", iconName: "waves", icon: Waves },
  { name: "Gym", iconName: "dumbbell", icon: Dumbbell },
  { name: "WiFi", iconName: "wifi", icon: Wifi },
  { name: "Security", iconName: "shield-check", icon: ShieldCheck },
  { name: "Garden", iconName: "trees", icon: Trees },
  { name: "Playground", iconName: "gamepad-2", icon: Gamepad2 },
  { name: "Laundry", iconName: "shirt", icon: Shirt },
  { name: "Air Conditioning", iconName: "snowflake", icon: Snowflake },
  { name: "CCTV", iconName: "camera", icon: Camera },
  { name: "Pets Allowed", iconName: "paw-print", icon: PawPrint },
];

// Falls back to a generic wrench icon for services added before
// icon_name existed , or any value that isn't in the catalog

  export function getAmenityIcon (iconName?: string) : LucideIcon                   {

  return AMENITIES.find ( (a) => a.iconName === iconName) ?.icon ?? Wrench  ;        }