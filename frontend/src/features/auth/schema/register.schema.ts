import { z } from "zod";


export const registerSchema = z.object({


  email: z.email("Invalid email"),

  password: z.string() .min(6, "Password must contain at least 6 characters"),
    first_name : z.string() ,
    last_name :z.string(),
   phone: z.string(),
   country: z.string()  , 
role: z.enum(["syndic",  "owner","admin",]),
});


export type  RegisterFormData =  z.infer<typeof registerSchema>;
