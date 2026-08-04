export type ApartmentStatus =
  | "available"
  | "occupied"
  | "maintenance";

export interface Apartment {
  id: string;
  residence_id: string;
  apartment_number: string;
  floor?: number;
  surface?: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  capacity: number;
  description?: string;
  status: ApartmentStatus;
  price_per_night?: number;
  view_type?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateApartmentInput {
  residence_id: string;
  apartment_number: string;
  floor?: number;
  surface?: number;
  rooms: number;
  bedrooms: number;
  bathrooms?: number;
  capacity: number;
  description?: string;
  status?: ApartmentStatus;
  price_per_night?: number;
  view_type?: string;
}

export interface UpdateApartmentInput {
  apartment_number: string;
  floor?: number;
  surface?: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  capacity: number;
  description?: string;
  status?: ApartmentStatus;
  price_per_night?: number;
  view_type?: string;
}
