// ======================================
// Search Filters
// ======================================

export interface SearchFilters {
  floor?: number | null ;
    city?: string | null;
    rooms?: number | null;
  residence_id?: string | null;
  capacity?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  min_price?: number | null;
  max_price?: number | null;
  view_type?: string | null;
  equipments?: string[];
  services?: string[];
}

// ======================================
// Search Strategy
// ======================================

export interface SearchStrategy {

    priority: number;
    name: string;
    filters: SearchFilters; }

// ======================================
// Gemini Response
// ======================================
export interface ChatbotExtraction {

  queries: SearchStrategy[];  }

// ======================================
// Apartment Search Result
// ======================================

export interface ApartmentResult {

  id: string;
  apartment_name: string;
  residence_name: string;
  city: string;
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  price_per_night: number;
  view_type: string;
  photo_url: string;
}

// ======================================
// Search History
// ======================================

export interface SearchHistory {
  id: string;
  query: string;
  filters: ChatbotExtraction;
  results_count: number;
  created_at: Date; }