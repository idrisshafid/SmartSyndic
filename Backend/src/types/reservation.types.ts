export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "cancelled";

export type TimeSlot =
  | "09:00"
  | "14:00"
  | "17:00";

export interface Reservation {
  id?: string;
  apartment_id: string;
  syndic_id: string;
  appointment_date: Date | string;
  time_slot: TimeSlot;
  status?: ReservationStatus;
  visitor_name: string;
  visitor_email: string;
  visitor_phone?: string;
  message?: string;
  check_in_date?: Date;
  check_out_date?: Date;
  guests_count?: number;
  notes?: string;
  created_at?: Date;
  updated_at?: Date;
}