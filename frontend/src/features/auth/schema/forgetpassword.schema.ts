import { z } from "zod";


export const ForgotpasswordSchema = z.object({

  email: z.email("Invalid email") ,

});

export type ForgotpasswordFormData = z.infer<typeof ForgotpasswordSchema>;
