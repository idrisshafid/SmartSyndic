import { z } from "zod";


export const createResidenceSchema = z.object({
  name: z.string(),
  description: z.string().optional(), 
  address: z.string(),
  city: z.string(),
  postal_code: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});



export const updateResidenceSchema =
z.object({
  name: z.string(),
  description: z.string().optional(), 
  address: z.string(),
  city: z.string(),
  postal_code: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),

});