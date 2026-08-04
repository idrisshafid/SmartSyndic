import { z } from "zod";


// Register
export const registerSchema = z.object({

  email: z.string().email("Invalid email"),

  password:  z.string()  .min(6,"Password must contain minimum 6 characters"),

  first_name:   z.string().min(3),

  last_name:    z.string().min(3),

  phone: z.string().optional(),

   role: z.enum(['syndic','owner','admin']),

  country:  z.string().optional()          });

// Login

export const loginSchema = z.object({

  email:z.string()    .email(),

  password:z.string().min(6)

});