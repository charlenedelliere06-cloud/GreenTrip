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
