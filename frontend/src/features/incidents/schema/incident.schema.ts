import { z } from "zod";


export const createIncidentSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères").max(100),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères").max(2000),
  type: z.string().max(50).optional(),
  priority: z.enum(["low", "normal", "high", "urgent"]),
});

export type CreateIncidentFormData = z.infer<typeof createIncidentSchema>;