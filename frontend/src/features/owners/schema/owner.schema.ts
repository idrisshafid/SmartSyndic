import { z } from "zod";

// ======================================
// Create Owner
// ======================================

export const createOwnerSchema = z.object({
  first_name: z.string()
    .trim().min(2, "First name must be at least 2 characters.")
    .max(50, "First name is too long."),

  last_name: z
    .string().trim()
    .min(2, "Last name must be at least 2 characters.")
    .max(50, "Last name is too long."),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address."),

  phone: z
    .string()
    .trim()
    .optional().or(z.literal("")),

  country: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
});

// ======================================
// Types
// ======================================

export type CreateOwnerFormData = z.infer<typeof createOwnerSchema>;