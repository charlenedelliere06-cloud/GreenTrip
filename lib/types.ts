export interface City {
  id: string;
  name: string;
  country: string;
  slug: string;
  vegan_score: number;
  description: string;
  image_url: string;
  lat: number;
  lng: number;
}

export interface Place {
  id: string;
  city_id: string;
  name: string;
  type: "supermarket" | "store";
  address: string;
  lat: number;
  lng: number;
  description: string;
  google_maps_url: string;
  tags: string[];
  photos: string[];
  price_range?: number | null; // 1=€  2=€€  3=€€€
  added_by?: string;
  created_at?: string;
}

export interface Tip {
  id: string;
  city_id: string;
  country: string;
  title: string;
  content: string;
  category: "tip" | "trap";
}

export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Review {
  id: string;
  place_id: string;
  user_id: string;
  content: string;
  photos: string[];
  created_at: string;
}

export interface Contribution {
  id: string;
  user_id: string;
  user_display_name?: string;
  type: "place" | "tip";
  city_id: string;
  // Champs pour les contributions de type "place"
  place_name?: string;
  place_type?: Place["type"];
  place_address?: string;
  place_description?: string;
  place_lat?: number;
  place_lng?: number;
  place_google_maps_url?: string;
  place_tags?: string[];
  place_photos?: string[];
  // Champs pour les contributions de type "tip"
  tip_title?: string;
  tip_content?: string;
  tip_category?: "tip" | "trap";
  // Statut de modération
  status: "pending" | "approved" | "rejected";
  created_at: string;
}
