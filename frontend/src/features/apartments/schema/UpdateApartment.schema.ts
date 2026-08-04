import { z } from "zod";

export const apartmentUpdateSchema = z.object({
  apartment_number: z
    .string()
    .min(1, "Apartment number is required")
    .max(20, "Keep it under 20 characters")
    .optional(),

  floor: z
    .number()
    .int()
    .min(-2, "Minimum floor is -2")
    .max(200)
    .optional(),

  surface: z
    .number()
    .min(5, "Surface must be at least 5 m²")
    .max(2000, "Surface must be under 2000 m²")
    .optional(),

  status: z
    .enum(["available", "occupied", "maintenance"])
    .optional(),

  price_per_night: z
    .number()
    .min(0, "Price can't be negative")
    .max(100000, "That price seems too high")
    .optional(),

  view_type: z
    .string()
    .max(60)
    .optional()
    .or(z.literal("")),

  description: z
    .string()
    .max(1000, "Description must be under 1000 characters")
    .optional()
    .or(z.literal("")),

  rooms: z
    .number()
    .int()
    .min(1, "At least 1 room")
    .max(20)
    .optional(),

  bedrooms: z
    .number()
    .int()
    .min(0)
    .max(20)
    .optional(),

  bathrooms: z
    .number()
    .int()
    .min(0)
    .max(10)
    .optional(),

  capacity: z
    .number()
    .int()
    .min(1, "At least 1 guest")
    .max(50)
    .optional(),
});

export type ApartmentUpdateFormData = z.infer<typeof apartmentUpdateSchema>;