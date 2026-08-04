// src/features/reservations/types/reservation.types.ts

export type ReservationStatus = "pending" | "confirmed" | "cancelled";

export type TimeSlot = {
  syndic_id: string;
  slot_date: string;
  time_slot: "09:00" | "14:00" | "17:00";
  is_available: boolean;
}
export type  time_slot="09:00" | "14:00" | "17:00";

/*export interface  GetReservation{
  id?: string;
  apartment_id: string;
  appointment_date: Date | string;
  time_slot: time_slot;
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

}*/

export interface Reservation {
  id?: string;
  apartment_id: string;
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

export interface CreateReservationInput {
  apartment_id: string;
  appointment_date: string; // YYYY-MM-DD
  time_slot: "09:00" | "14:00" | "17:00"; // only the time string
  visitor_name: string;
  visitor_email: string;
  visitor_phone?: string;
  message?: string;
  check_in_date?: string; // YYYY-MM-DD
  check_out_date?: string; // YYYY-MM-DD
  guests_count?: number;
  notes?: string;
}
export interface UpdateReservationStatusInput {
  status: ReservationStatus;
}

export interface CalendarDay {
  syndic_id: string;
  appointment_date: string;
  booked_count: number;
  slots_remaining: number;
  booked_slots: string[];
}
