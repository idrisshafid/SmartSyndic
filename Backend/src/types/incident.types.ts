export type IncidentStatus =
  | "pending"
  | "in_progress"
  | "resolved";

export type IncidentPriority =
  | "low"
  | "normal"
  | "high"
  | "urgent";
  export interface UpdateIncidentStatusInput {
    status: IncidentStatus;}

  export interface incidentfilters {
    residence_id: string;
    apartment_id?: string;
    declared_by: string;
     priority: IncidentPriority;
    status?: IncidentStatus;}

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