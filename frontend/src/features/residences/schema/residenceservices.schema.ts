import { z } from "zod";


export const ServicesresidenceSchema = z.object({

   serviceName : z
    .string()
    .min(5, "service is required"),

  iconName : z
    .string().optional ,
});


export type ServicesresidenceFormData =
  z.infer<typeof ServicesresidenceSchema>;
  