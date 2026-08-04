import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAnnouncements,
  getAnnouncementById,  getOwnerResidence,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  toggleAnnouncementPin, 
  type CreateAnnouncementPayload,
  type UpdateAnnouncementPayload,
} from "../services/announcements.service";

// ─── Query keys ─────────────────────────────────────────────────────────────

export const useOwnerResidence = (ownerId: string) => {
  return useQuery({
     queryKey: ["owner-residence", ownerId],
    queryFn: () => getOwnerResidence(ownerId),
    enabled: !!ownerId,
    staleTime: 5 * 60 * 1000,
  });
};

export const ANNOUNCEMENT_KEYS = {
  all: ["announcements"] as const,
  byResidence: (residenceId: string) => [...ANNOUNCEMENT_KEYS.all, "residence", residenceId] as const,
  detail: (id: string) => [...ANNOUNCEMENT_KEYS.all, "detail", id] as const,
};

// ─── Get all announcements by residence ────────────────────────────────────

export const useAnnouncements = (
  residenceId: string,
  params?: { page?: number; limit?: number }
) => {
  return useQuery({
    queryKey: ANNOUNCEMENT_KEYS.byResidence(residenceId),
    queryFn: () => getAnnouncements(residenceId, params),
    enabled: !!residenceId,
    staleTime: 60 * 1000, // 1 minute
  });
};

// ─── Get a single announcement ─────────────────────────────────────────────

export const useAnnouncement = (id: string) => {
  return useQuery({
    queryKey: ANNOUNCEMENT_KEYS.detail(id),
    queryFn: () => getAnnouncementById(id),
    enabled: !!id,
  });
};

// ─── Create announcement ────────────────────────────────────────────────────

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAnnouncementPayload) => createAnnouncement(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ANNOUNCEMENT_KEYS.byResidence(data.residence_id),
      });
    },
  });
};

// ─── Update announcement ────────────────────────────────────────────────────

export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAnnouncementPayload }) =>
      updateAnnouncement(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ANNOUNCEMENT_KEYS.detail(data.id),
      });
      queryClient.invalidateQueries({
        queryKey: ANNOUNCEMENT_KEYS.byResidence(data.residence_id),
      });
    },
  });
};

// ─── Delete announcement ────────────────────────────────────────────────────

export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAnnouncement(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ANNOUNCEMENT_KEYS.all });
      // Also invalidate the detail if it exists
      queryClient.invalidateQueries({
        queryKey: ANNOUNCEMENT_KEYS.detail(variables),
      });
    },
  });
};

// ─── Toggle pin ─────────────────────────────────────────────────────────────

export const useToggleAnnouncementPin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => toggleAnnouncementPin(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ANNOUNCEMENT_KEYS.detail(data.id),
      });
      queryClient.invalidateQueries({
        queryKey: ANNOUNCEMENT_KEYS.byResidence(data.residence_id),
      });
    },
  });
};