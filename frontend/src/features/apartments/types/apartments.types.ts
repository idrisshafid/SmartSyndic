export type ApartmentStatus = "available" | "occupied" | "maintenance";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Some delete endpoints return a bare message with no envelope —
// kept distinct from ApiResponse<null> since that's what you confirmed
// the backend actually sends for these specific routes.
export interface DeleteResponse {
  message: string;
}

export interface Service_Equipment {
  id?: string;
  apartment_id: string;
  equipment: string;
}

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
    city?:string;
  // FIXED: JSON never contains a real Date instance, only an ISO
  // string. Typing these as `Date` would let TypeScript wave through
  // code that calls Date methods on what's actually a string at
  // runtime (e.g. apartment.created_at.getFullYear() would throw).
  created_at: string;
  updated_at: string;
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
  price_per_night?: number;
  view_type?: string;

}

// All optional — this is a filter object, not a full record. If your
// backend actually requires `rooms`/`capacity` to be present on every
// search call, revert those two to required.
export interface searchApartmentInput {
  apartment_number?: string;
  floor?: number;
  surface?: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  city?: string;
  capacity?: number;
  description?: string;
  status?: ApartmentStatus;
  price_per_night?: number;
  view_type?: string;
}

export interface ApartmentPhoto {
  id: string;
  // SUSPECT FIELD: this is almost certainly meant to be `apartment_id`
  // — the fetch/delete routes are scoped by apartment id
  // (/apartment/:id/photos), not residence id. Kept as-is per your
  // source, but verify with Postman before relying on it.
  residence_id: string;
  photo_url: string;
  public_id: string;
  is_primary : boolean
}