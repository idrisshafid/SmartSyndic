import { z } from "zod";


export const registerSchema = z.object({


  email: z.email("email invalide"),

  password: z.string() .min(6, "Le Mot de passe  doit contenir au moins 6 caractères."),
    first_name: z.string().min(3, "Le prénom doit contenir au moins 3 caractères."),

last_name: z.string().min(3, "Le nom doit contenir au moins 3 caractères."),
   phone: z.string(),
   country: z.string()  , 
role: z.enum(["syndic",  "owner","admin",]),
});


export type  RegisterFormData =  z.infer<typeof registerSchema>;
