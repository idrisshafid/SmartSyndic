// =========================================
// User
// =========================================

export type UserRole = "owner";

export interface Owner {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  country?: string;
  role: UserRole;
  is_active: boolean;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

// =========================================
// Create Owner
// =========================================

export interface CreateOwnerInput {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  country?: string;
}

// =========================================
// Apartment
// =========================================

export interface Apartment {
  id: string;
  apartment_number: string;
  floor?: number;
  surface?: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  capacity: number;
  status: string;
  price_per_night?: number;
  view_type?: string;
  residence_id?:string;
}

// =========================================
// API Response
// =========================================

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}