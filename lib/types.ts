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
  type: "supermarket" | "restaurant" | "cafe" | "store";
  address: string;
  lat: number;
  lng: number;
  description: string;
  google_maps_url: string;
  tags: string[];
}

export interface Tip {
  id: string;
  city_id: string;
  country: string;
  title: string;
  content: string;
  category: "tip" | "trap";
}

export interface Contribution {
  id: string;
  user_id: string;
  city_id: string;
  place_id?: string;
  content: string;
  status: "pending" | "approved" | "rejected";
}
