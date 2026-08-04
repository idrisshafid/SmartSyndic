import api from "@/config/api";
import type {
  Reservation, CreateReservationInput ,
  UpdateReservationStatusInput,
  CalendarDay,
  TimeSlot,
} from "../types/reservations.types";

// ─── PUBLIC ROUTES (No Auth) ──────────────────────────────────────────────

  export const deleteReservation = async (id: string): Promise<Reservation> => {
  const response = await api.delete(`reservations/${id}`);
  return response.data;
};

/**
   GET /calendar/:syndicId
   Get calendar overview for a syndic (public)  */
export const getCalendar = async (apartmentId: string): Promise<CalendarDay[]> => {
  const response = await api.get(`reservations/calendar/${apartmentId}`);
  return response.data.data;
};

/**
  GET /slots/:syndicId
  Get available time slots for a syndic (public)
 */
export const getSlotsForDay = async (apartmentId: string, date: string): Promise<TimeSlot[]> => {
  const response = await api.get(`reservations/slots/${apartmentId}`, { params: { date } });
  return response.data.data;
};
/* * POST /reservations
 * Create a new reservation (public – no auth required)*/

export const createReservation = async (
  data: CreateReservationInput
): Promise<Reservation> => {
  const response = await api.post("/reservations/", data);
  console.log("DATA SENT TO API:", data);
  return response.data.data;     };

// ─── SYNDIC ROUTES (Auth Required) ─────────────────────────────────────────

/**
 * GET /reservations
 * Get all reservations for the authenticated syndic
 */
export const getReservations = async (): Promise<Reservation[]> => {
  const response = await api.get("/reservations/");
  return response.data.data;  };

/**
 * PATCH /reservations/:id
 * Update reservation status (syndic only)
 */
export const updateReservationStatus = async (
  id: string,
  data: UpdateReservationStatusInput
): Promise<Reservation> => {
  const response = await api.patch(`/reservations/${id}`, data);
  return response.data.data;   };

  export const getReservationById = async (id: string): Promise<Reservation> => {
  const response = await api.get(`/reservations/${id}`);
  return response.data.data;
};
