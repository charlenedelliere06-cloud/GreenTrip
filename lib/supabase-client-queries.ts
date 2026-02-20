import { createSupabaseBrowser } from "./supabase-browser";
import { City } from "./types";

// ============================================
// Fonctions CLIENT (composants "use client")
// ============================================

export async function getCitiesClient(): Promise<City[]> {
  const supabase = createSupabaseBrowser();
  const { data, error } = await supabase
    .from("cities")
    .select("*")
    .order("name");

  if (error) {
    console.error("Erreur getCitiesClient:", error);
    return [];
  }
  return (data as City[]) || [];
}

export interface PlaceWithCity {
  id: string;
  name: string;
  type: string;
  address: string;
  city_id: string;
  cities: { name: string; slug: string } | null;
}

export async function getPlacesClient(): Promise<PlaceWithCity[]> {
  const supabase = createSupabaseBrowser();
  const { data, error } = await supabase
    .from("places")
    .select("id, name, type, address, city_id, cities(name, slug)")
    .eq("status", "approved")
    .order("name");

  if (error) {
    console.error("Erreur getPlacesClient:", error);
    return [];
  }
  return (data as PlaceWithCity[]) || [];
}
