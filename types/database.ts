export type PlaceCategory = 'landmark' | 'museum' | 'church' | 'park' | 'food' | 'cafe';

export interface Place {
  id: string;
  name: string;
  name_local: string | null;
  category: PlaceCategory;
  description: string | null;
  address: string | null;
  lat: number;
  lng: number;
  image_url: string | null;
  rating: number | null;
  price_level: number | null;
  tags: string[] | null;
  created_at: string;
}

export interface Itinerary {
  id: string;
  title: string;
  description: string | null;
  duration_days: number;
  cover_image_url: string | null;
  created_at: string;
}

export interface ItineraryStop {
  id: string;
  itinerary_id: string;
  place_id: string;
  day_number: number;
  order_in_day: number;
  note: string | null;
  place?: Place;
}

export interface ItineraryWithStops extends Itinerary {
  itinerary_stops: ItineraryStop[];
}

export interface Review {
  id: string;
  place_id: string;
  author_name: string | null;
  rating: number | null;
  message: string;
  created_at: string;
  place?: Place;
}

export interface Inquiry {
  id: string;
  place_id: string;
  author_name: string | null;
  message: string;
  created_at: string;
  place?: Place;
}
