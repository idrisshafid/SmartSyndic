import { z } from "zod";


export const createReservationSchema = z.object({

  visitor_name: z.string().min(3),

  visitor_email: z.string().email(),

  apartment_id:  z.string().uuid(),

  appointment_date:  z.string().date(),

  time_slot:         z.string().min(1) ,
  
  message: z.string().optional(),

 visitor_phone: z.string().optional(),  
   
  check_in_date: z.string().optional(),

  check_out_date: z.string().optional(),
   guests_count: z.number().int().optional() ,
  notes: z.string().optional(),

});
