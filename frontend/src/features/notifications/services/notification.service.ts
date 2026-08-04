import api from "@/config/api";
import type { Notification ,NotificationType } from "../types/notification.types";

// ─── Responses ──────────────────────────────────────────────────────────────

export interface NotificationsResponse {
  data: Notification[];
  total?: number;
  unread?: number;
}

// ─── Get all notifications ──────────────────────────────────────────────────

export const getNotifications = async (): Promise<NotificationsResponse> => {
  const { data } = await api.get<NotificationsResponse>("/notifications");
  return data;
};

// ─── Get unread count ──────────────────────────────────────────────────────

export interface UnreadCountResponse {
  success: boolean;
 unread: number;}

export const getUnreadCount = async (): Promise<UnreadCountResponse> => {
  const { data } = await api.get<UnreadCountResponse>(
    "/notifications/unread-count"
  );

  return data;
};

// ─── Mark single notification as read ─────────────────────────────────────

export const markNotificationRead = async (id: string): Promise<Notification> => {
  const { data } = await api.patch<Notification>(`/notifications/${id}/read`);
  return data;
};

// ─── Mark all notifications as read ──────────────────────────────────────

export const markAllNotificationsRead = async (): Promise<{ success: boolean }> => {
  const { data } = await api.patch<{ success: boolean }>("/notifications/read-all");
  return data;
};

// ─── Notify a specific user (admin/syndic only) ──────────────────────────

export interface NotifyUserPayload {
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  reference_id?: string;
  reference_type?: string;
}

export const notifyUser = async (payload: NotifyUserPayload): Promise<Notification> => {
  const { data } = await api.post<Notification>(`/notifications/user/${payload.user_id}`, payload);
  return data;
};

// ─── Notify all owners of a residence (admin/syndic only) ─────────────────

export interface NotifyAllOwnersPayload {
  residence_id: string;
  title: string;
  message: string;
  type: NotificationType;
  reference_id?: string;
  reference_type?: string;
}

export const notifyAllOwners = async (payload: NotifyAllOwnersPayload): Promise<{ success: boolean }> => {
  const { data } = await api.post<{ success: boolean }>(
    `/notifications/residence/${payload.residence_id}`,
    payload
  );
  return data;
};


export const deleteAllNotifications = async ()=>{

 const {data}= await api.delete( "/notifications");

 return data;};

export const deleteNotification = async (id:string)=>{

 const {data}= await api.delete(`/notifications/${id}`);

 return data;
};