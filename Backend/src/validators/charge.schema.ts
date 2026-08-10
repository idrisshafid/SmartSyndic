import { z } from "zod";

// ===============================
// CREATE CHARGE
// ===============================

export const createChargeSchema = z.object({
  syndic_id: z
    .string()
    .uuid("Invalid syndic id"),

  owner_id: z
    .string()
    .uuid("Invalid owner id"),

  apartment_id: z
    .string()
    .uuid("Invalid apartment id"),

  title: z
    .string()
    .min(3, "Title must contain at least 3 characters")
    .max(255),

  description: z
    .string()
    .max(1000)
    .optional(),

  amount: z
    .number({
      message: "Amount must be a number",
    })
    .positive("Amount must be greater than 0"),

  due_date: z
    .string()
    .min(1, "Due date is required")
    .refine(
      (date) => !isNaN(Date.parse(date)),
      "Invalid date format"
    ),
});

export type CreateChargeInput = z.infer<typeof createChargeSchema>;


// ===============================
// PAYMENT
// ===============================

export const paymentSchema = z.object({
  charge_id: z.string().min(3, "Veuillez sélectionner une charge"),
  payment_date: z.string().min(1, "Date de paiement requise"),
  payment_method: z.string().min(1, "Méthode de paiement requise"),
  reference: z.string().optional(),
  notes: z.string().optional(),
});


export type CreatePaymentInput = z.infer<typeof paymentSchema>;