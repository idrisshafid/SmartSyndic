export interface Announcement {
  id: string;
  residence_id: string;
  syndic_id: string;
  title?: string;
  content?: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}