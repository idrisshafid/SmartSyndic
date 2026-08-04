import api from "@/config/api";
import type { Announcement } from "../types/announcement.types";

// ─── Responses ──────────────────────────────────────────────────────────────

export interface AnnouncementsResponse {
  data: Announcement[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface CreateAnnouncementPayload {
  residence_id: string;
  syndic_id: string;
  title: string;
  content: string;
}

export interface UpdateAnnouncementPayload {
  title?: string;
  content?: string;
  is_pinned?: boolean;
}
type OwnerResidence = {
  residence_id: string;
};

export const getOwnerResidence = async (ownerId: string):Promise<OwnerResidence> => {
  const response = await api.get(`/announcements/${ownerId}/residence`);
  return response.data.data;
   
};

// ─── Get all announcements for a residence ────────────────────────────────

export const getAnnouncements = async (
  residenceId: string,
  params?: { page?: number; limit?: number }
): Promise<AnnouncementsResponse> => {
  const { data } = await api.get<AnnouncementsResponse>(`/announcements/residence/${residenceId}`, {
    params,
  });
  return data;
};

// ─── Get a single announcement ──────────────────────────────────────────────

export const getAnnouncementById = async (id: string): Promise<Announcement> => {
  const { data } = await api.get<Announcement>(`/announcements/${id}`);
  return data;
};

// ─── Create announcement ────────────────────────────────────────────────────

export const createAnnouncement = async (
  payload: CreateAnnouncementPayload
): Promise<Announcement> => {
  const { data } = await api.post<Announcement>("/announcements", payload);
  return data;
};

// ─── Update announcement ────────────────────────────────────────────────────

export const updateAnnouncement = async (
  id: string,
  payload: UpdateAnnouncementPayload
): Promise<Announcement> => {
  const { data } = await api.put<Announcement>(`/announcements/${id}`, payload);
  return data;
};

// ─── Delete announcement ────────────────────────────────────────────────────

export const deleteAnnouncement = async (id: string): Promise<Announcement> => {
  const { data } = await api.delete<Announcement>(`/announcements/${id}`);
  return data;
};

// ─── Toggle pin ─────────────────────────────────────────────────────────────

export const toggleAnnouncementPin = async (id: string): Promise<Announcement> => {
  const { data } = await api.patch<Announcement>(`/announcements/${id}/pin`);
  return data;
};