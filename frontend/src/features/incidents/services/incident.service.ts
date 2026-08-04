import api from "@/config/api";
import type {
  Incident,
  CreateIncidentInput,
  UpdateIncidentStatusInput,
  IncidentFilters,
  IncidentComment,
  IncidentHistory,
  IncidentPhoto,
} from "../types/incident.types";

// ─── CRUD ────────────────────────────────────────────────────────────────────
// ─── Delete incident ──────────────────────────────────────────────────────
export const deleteIncident = async (id: string): Promise<Incident> => {
  const response = await api.delete(`/incidents/${id}`);
  return response.data.data;
};


/*  GET /incidents
    Get all incidents (with optional filters)  */
export const getIncidents = async (
  filters?: IncidentFilters
): Promise<Incident[]> => {
  const response = await api.get("/incidents", { params: filters });
  return response.data.data;};

/* POST /incidents
 * Create a new incident*/
export const createIncident = async (
  data: CreateIncidentInput
): Promise<Incident> => {
  const response = await api.post("/incidents", data);
  return response.data.data;
};

/*  GET /incidents/:id
 * Get an incident by ID*/
export const getIncidentById = async (id: string): Promise<Incident> => {
  const response = await api.get(`/incidents/${id}`);
  return response.data.data;
};

// ─── STATUS ──────────────────────────────────────────────────────────────────

/**
 * PATCH /incidents/:id/status
 * Update incident status
 */
export const updateIncidentStatus = async (
  id: string,
  data: UpdateIncidentStatusInput
): Promise<Incident> => {
  const response = await api.patch(`/incidents/${id}/status`, data);
  return response.data.data;
};
//update
export const updateIncident = async (
  id: string,
  data: CreateIncidentInput
): Promise<Incident> => {
  const response = await api.put(`/incidents/${id}`, data);
  return response.data.data;
};

// ─── COMMENTS ───────────────────────────────────────────────────────────────

/**
 * POST /incidents/:id/comments
 * Add a comment to an incident
 */
export const addComment = async (
  incidentId: string,
  comment: string
): Promise<IncidentComment> => {
  const response = await api.post(`/incidents/${incidentId}/comments`, { comment });
  return response.data.data;
};

/**
 * GET /incidents/:id/comments
 * Get all comments for an incident
 */
export const getComments = async (
  incidentId: string
): Promise<IncidentComment[]> => {
  const response = await api.get(`/incidents/${incidentId}/comments`);
  return response.data.data;
};

// ─── HISTORY ─────────────────────────────────────────────────────────────────

/**
 * GET /incidents/:id/history
 * Get history log for an incident (syndic only)
 */
export const getIncidentHistory = async (
  incidentId: string
): Promise<IncidentHistory[]> => {
  const response = await api.get(`/incidents/${incidentId}/history`);
  return response.data.data;
};

// ─── PHOTOS ──────────────────────────────────────────────────────────────────

/**
 * POST /incidents/:id/photos
 * Upload a photo for an incident (multipart/form-data)
 */
export const uploadIncidentPhoto = async (
  incidentId: string,
  file: File
): Promise<IncidentPhoto> => {
  const formData = new FormData();
  formData.append("photos", file);
  const response = await api.post(`/incidents/${incidentId}/photos`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data;
};

/**
 * GET /incidents/:id/photos
 * Get all photos for an incident
 */
export const getIncidentPhotos = async (
  incidentId: string
): Promise<IncidentPhoto[]> => {
  const response = await api.get(`/incidents/${incidentId}/photos`);
  return response.data.data;
};

/**
 * PUT /incidents/photos/:photoId
 * Update a photo (replace image)
 */
export const updateIncidentPhoto = async (
  photoId: string,
  file: File
): Promise<IncidentPhoto> => {
  const formData = new FormData();
  formData.append("photo", file);
  const response = await api.put(`/incidents/photos/${photoId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data;
};

/**
 * DELETE /incidents/photos/:photoId
 * Delete a photo
 */
export const deleteIncidentPhoto = async (
  photoId: string
): Promise<{ message: string }> => {
  const response = await api.delete(`/incidents/photos/${photoId}`);
  return response.data.data;
};