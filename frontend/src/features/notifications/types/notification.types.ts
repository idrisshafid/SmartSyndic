
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  reference_id?: string;
  reference_type?: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export type NotificationType = 

"payment"|  "incident"|

"reservation"|     "announcement"|"general";


