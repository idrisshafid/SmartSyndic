export interface ApartmentResult {
  id: string;
  apartment_number: string;
  floor: number | null;
  surface: string;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  capacity: number;
  description: string;
  status: string;
  price_per_night: string;
  view_type: string | null;
  residence_id: string;
  residence_name: string;
  city: string;
  address: string;
  latitude: string | null;
  longitude: string | null;
  primary_photo: string | null;
  equipments: string[];
  residence_services: string[];
  photo_url: string | null;
}

export interface ChatbotSearchResponse {
  success: boolean;
  message: string;
  count: number;
  data: ApartmentResult[];
}