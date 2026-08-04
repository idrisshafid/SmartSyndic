export type IncidentStatus = "pending" | "in_progress" | "resolved";
export type IncidentPriority = "low" | "normal" | "high" | "urgent";

export interface Incident {
  id: string;
  residence_id: string;
  apartment_id?: string;
  declared_by: string;
  assigned_to?: string;
  title: string;
  description: string;
  type?: string;
  status: IncidentStatus;
  priority: IncidentPriority;
  resolved_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CreateIncidentInput {
  title: string;
  description: string;
  type?: string;
  priority: IncidentPriority;
}

export interface UpdateIncidentStatusInput {
  status: IncidentStatus;
}

export interface IncidentFilters {
  residence_id?: string;
  apartment_id?: string;
  declared_by?: string;
  priority?: IncidentPriority;
  status?: IncidentStatus;
}

export interface IncidentComment {
  id: string;
  incident_id: string;
  author_id: string;
  comment: string;
  created_at: Date;
}

export interface IncidentHistory {
  id: string;
  incident_id: string;
  old_status: IncidentStatus;
  new_status: IncidentStatus;
  notes: string;
  created_at: Date;
}

export interface IncidentPhoto {
  id: string;
  incident_id: string;
  photo_url: string;
  public_id: string;
  created_at: Date;
}