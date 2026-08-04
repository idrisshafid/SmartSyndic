import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  notifyUser,
  notifyAllOwners,
  type NotifyUserPayload,
  type NotifyAllOwnersPayload,  deleteAllNotifications , deleteNotification ,
} from "../services/notification.service";

// ─── Query keys ─────────────────────────────────────────────────────────────

export const NOTIFICATION_KEYS = {
  all: ["notifications"] as const,
  list: () => [...NOTIFICATION_KEYS.all, "list"] as const,
  unread: () => [...NOTIFICATION_KEYS.all, "unread"] as const,
};

// ─── Get all notifications ─────────────────────────────────────────────────

export const useNotifications = () => {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.list(),
    queryFn: getNotifications,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// ─── Get unread count ──────────────────────────────────────────────────────

export const useUnreadCount = () => {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.unread(),
    queryFn: getUnreadCount,
    refetchInterval: 60 * 1000, // refetch every 60 seconds
  });
};

// ─── Mark one read ─────────────────────────────────────────────────────────

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.list() });
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.unread() });
    },
  });
};

// ─── Mark all read ──────────────────────────────────────────────────────────

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.list() });
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.unread() });
    },
  });
};

// ─── Notify a user ──────────────────────────────────────────────────────────

export const useNotifyUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: NotifyUserPayload) => notifyUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.list() });
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.unread() });
    },
  });
};

// ─── Notify all owners ──────────────────────────────────────────────────────

export const useNotifyAllOwners = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: NotifyAllOwnersPayload) => notifyAllOwners(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.list() });
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.unread() });
    },
  });
};

export const useDeleteAllNotifications = ()=>{

 const queryClient = useQueryClient();

 return useMutation({

  mutationFn:    deleteAllNotifications,  onSuccess:()=>{

    queryClient.invalidateQueries({
      queryKey:NOTIFICATION_KEYS.list()});


    queryClient.invalidateQueries({
      queryKey:NOTIFICATION_KEYS.unread()

    });}});};

export const useDeleteNotification = ()=>{

 const queryClient = useQueryClient();

 return useMutation({  mutationFn:(id:string)=>  deleteNotification(id),

  onSuccess:()=>{

    queryClient.invalidateQueries({  queryKey:NOTIFICATION_KEYS.list()    });

    queryClient.invalidateQueries({   queryKey:NOTIFICATION_KEYS.unread()});

  }});};