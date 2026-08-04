
export type IncidentStatus =
  | "pending"
  | "in_progress"
  | "resolved";

export type IncidentPriority =
  | "low"
  | "normal"
  | "high"
  | "urgent";


export interface incident_history {
    id     :     string
    incident_id : string;
    old_status  : IncidentStatus;
    new_status  : IncidentStatus;
    notes       : string;
    created_at:  Date;
};
