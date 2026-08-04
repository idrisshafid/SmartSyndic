import { z } from "zod";

// Step 1 (basic info) + Step 2 (capacity/structure) combined — together
// these are exactly the shape of CreateApartmentInput, which is why the
// apartment gets created the moment this whole schema is valid.
export const apartmentCoreSchema = z.object({
  // ---- Step 1: Basic information ----
  apartment_number: z
    .string()
    .min(1, "Apartment number is required")
    .max(20, "Keep it under 20 characters"),

  floor: z.number().int().min(-2, "Minimum floor is -2").max(200),

  surface: z
    .number()
    .min(5, "Surface must be at least 5 m²")
    .max(2000, "Surface must be under 2000 m²"),

  status: z.enum(["available", "occupied", "maintenance"]),

  price_per_night: z
    .number()
    .min(0, "Price can't be negative")
    .max(100000, "That price seems too high"),

  view_type: z.string().max(60).optional().or(z.literal("")),

  description: z
    .string()
    .max(1000, "Description must be under 1000 characters")
    .optional()
    .or(z.literal("")),

  // ---- Step 2: Capacity and structure ----
  rooms: z.number().int().min(1, "At least 1 room").max(20),

  bedrooms: z.number().int().min(0).max(20),

  bathrooms: z.number().int().min(0).max(10),

  capacity: z.number().int().min(1, "At least 1 guest").max(50),
});

export type ApartmentCoreFormData = z.infer<typeof apartmentCoreSchema>;

// Field groups used to validate one step at a time with RHF's trigger(),
// without touching fields the user hasn't reached yet.
export const STEP_1_FIELDS = [
  "apartment_number",
  "floor",
  "surface",
  "status",
  "price_per_night",
  "view_type",
  "description",
] as const;

export const STEP_2_FIELDS = [
  "rooms",
  "bedrooms",
  "bathrooms",
  "capacity",
] as const;