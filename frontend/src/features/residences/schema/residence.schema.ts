import { z } from "zod";

// =====================================
// Residence form (create + edit)
// =====================================
export const residenceSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(120, "Name is too long"),

  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address is too long"),

  city: z.string().min(2, "City is required").max(80, "City is too long"),

  postal_code: z
    .string()
    .max(20, "Postal code is too long")
    .optional()
    .or(z.literal("")),

  description: z
    .string()
    .optional()
    .or(z.literal("")),

  latitude: z
    .number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90")
    .optional(),

  longitude: z
    .number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180")
    .optional(),
});

export type ResidenceFormData = z.infer<typeof residenceSchema>;

// =====================================
// Service form
// =====================================
export const residenceServiceSchema = z.object({
  service_name: z
    .string()
    .min(2, "Service name must be at least 2 characters")
    .max(60, "Service name is too long"),

  icon_name: z.string().max(60).optional().or(z.literal("")),
});

export type ResidenceServiceFormData = z.infer<typeof residenceServiceSchema>;