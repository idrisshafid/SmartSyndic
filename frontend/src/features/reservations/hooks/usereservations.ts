import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as reservationService from "../services/reservations.services";
import type {
  Reservation,
  UpdateReservationStatusInput,
  CalendarDay,
  TimeSlot,CreateReservationInput
} from "../types/reservations.types";

// ─── Queries ──────────────────────────────────────────────────────────────

export const useDeleteReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reservationService.deleteReservation(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reservations"],
      });
    },
  });
};

/**
 * GET /calendar/:syndicId
 * Public – no auth required
 */
export const useCalendar = (apartmentId: string) => {
  return useQuery<CalendarDay[]>({
    queryKey: ["calendar", apartmentId],
    queryFn: () => reservationService.getCalendar(apartmentId),
    enabled: !!apartmentId,
  });
};

/**
 * GET /slots/:syndicId?date=
 * Public – no auth required
 */
export const useSlots = (apartmentId: string, date: string) => {
  return useQuery<TimeSlot[]>({
    queryKey: ["slots", apartmentId, date],
    queryFn: () => reservationService.getSlotsForDay(apartmentId, date),
    enabled: !!apartmentId && !!date,
  });
};

/**
 * GET /reservations
 * Syndic only – auth required
 */
export const useReservations = () => {
  return useQuery<Reservation[]>({
    queryKey: ["reservations"],
    queryFn: () => reservationService.getReservations(),
  });
};

/**
 * GET /reservations/:id
 * Syndic only – auth required
 */
export const useReservation = (id: string) => {
  return useQuery<Reservation>({
    queryKey: ["reservation", id],
    queryFn: () => reservationService.getReservationById(id),
    enabled: !!id,
  });
};

// ─── Mutations ─────────────────────────────────────────────────────────────

/**
 * POST /reservations
 * Public – no auth required
 */
export const useCreateReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReservationInput) =>
      reservationService.createReservation(data),
    onSuccess: () => {
      // Invalidate the calendar and slots cache for the syndic
      // We don't have the syndicId here, so we invalidate all calendar/slots queries
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
      queryClient.invalidateQueries({ queryKey: ["slots"] });
    },
  });
};

/**
 * PATCH /reservations/:id
 * Syndic only – auth required
 */
export const useUpdateReservationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateReservationStatusInput;
    }) => reservationService.updateReservationStatus(id, data),
    onSuccess: (_, variables) => {
      // Invalidate the specific reservation and the entire list
      queryClient.invalidateQueries({ queryKey: ["reservation", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });
};