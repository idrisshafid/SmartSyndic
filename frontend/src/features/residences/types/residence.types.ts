// =====================================
// Generic API envelope — matches the real backend response:
// { success, message, data: T }
// =====================================
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// =====================================
// Paginated list envelope used by GET /residence and
// GET /residence/public — the array lives at `.data.residences`,
// NOT `.data` directly. Confirmed from a real Postman response:
// { success, message, data: { residences: [...], total, page, limit } }
// =====================================
export interface PaginatedResidences {
  residences: Residence[];
  total: number;
  page: number;
  limit: number;
}

// =====================================
// Residence
// =====================================
export interface Residence {
  id: string;
  syndic_id: string;
  name: string;
  description?: string | null;
  address: string;
  city: string;
  postal_code?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  photos?: ResidencePhoto[];
  services?: ResidenceService[];
}

// =====================================
// Photo
// =====================================
export interface ResidencePhoto {
  id: string;
  residence_id: string;
  photo_url: string;
  public_id: string;
}

// =====================================
// Service
// =====================================
export interface ResidenceService {
  id: string;
  residence_id: string;
  service_name: string;
  icon_name?: string;
}

// =====================================
// Create / Update payloads
// =====================================
export interface CreateResidenceInput {
  name: string;
  description?: string;
  address: string;
  city: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  syndic_id: string;
}

export type ResidenceFormValues = Omit<CreateResidenceInput, "syndic_id">;

export type UpdateResidenceInput = Partial<ResidenceFormValues>;

export interface CreateResidenceServiceInput {
  service_name: string;
  icon_name?: string;
}