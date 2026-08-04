export interface Residence {
  id: string;
  syndic_id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateResidenceInput {
  syndic_id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateResidenceInput {
  name: string;
  description?: string;
  address: string;
  city: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
}