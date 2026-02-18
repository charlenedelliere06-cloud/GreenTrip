import { createSupabaseServer } from "./supabase-server";
import { City, Place, Tip } from "./types";

// ============================================
// Fonctions SERVEUR (Server Components + API Routes)
// ============================================

export async function getCities(): Promise<City[]> {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("cities")
    .select("*")
    .order("name");

  if (error) {
    console.error("Erreur getCities:", error);
    return [];
  }
  return data || [];
}

export async function getCityBySlug(slug: string): Promise<City | null> {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("cities")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Erreur getCityBySlug:", error);
    return null;
  }
  return data;
}

export async function getPlacesByCity(cityId: string): Promise<Place[]> {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("places")
    .select("*")
    .eq("city_id", cityId)
    .eq("status", "approved")
    .order("name");

  if (error) {
    console.error("Erreur getPlacesByCity:", error);
    return [];
  }
  return data || [];
}

export async function getPlaceById(id: string): Promise<Place | null> {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("places")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Erreur getPlaceById:", error);
    return null;
  }
  return data;
}

export async function getTipsByCity(cityId: string): Promise<Tip[]> {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("tips")
    .select("*")
    .eq("city_id", cityId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur getTipsByCity:", error);
    return [];
  }
  return data || [];
}

// ============================================
// Fonctions CONTRIBUTIONS (API Routes)
// ============================================

export async function createContribution(body: Record<string, unknown>) {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("contributions")
    .insert({
      user_id: body.user_id as string,
      place_name: body.place_name as string,
      place_type: body.place_type as string,
      city_id: body.city_id || null,
      city_name: body.city_name as string,
      city_country: body.city_country as string,
      is_new_city: body.is_new_city as boolean,
      address: (body.place_address as string) || "",
      lat: body.place_lat as number | null,
      lng: body.place_lng as number | null,
      description: (body.place_description as string) || "",
      google_maps_url: (body.place_google_maps_url as string) || "",
      tags: (body.place_tags as string[]) || [],
      photos: (body.place_photos as string[]) || [],
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    console.error("Erreur createContribution:", error);
    throw error;
  }
  return data;
}

export async function getContributions() {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("contributions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur getContributions:", error);
    return [];
  }
  return data || [];
}

export async function updateContributionStatus(
  id: string,
  status: "approved" | "rejected"
) {
  const supabase = await createSupabaseServer();

  // Mettre à jour le statut de la contribution
  const { data: contribution, error: updateError } = await supabase
    .from("contributions")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    console.error("Erreur updateContributionStatus:", updateError);
    throw updateError;
  }

  // Si approuvé → créer le lieu dans la table places
  if (status === "approved" && contribution) {
    const { error: placeError } = await supabase.from("places").insert({
      city_id: contribution.city_id,
      name: contribution.place_name,
      type: contribution.place_type,
      address: contribution.address || "",
      lat: contribution.lat || 0,
      lng: contribution.lng || 0,
      description: contribution.description || "",
      google_maps_url: contribution.google_maps_url || "",
      tags: contribution.tags || [],
      photos: contribution.photos || [],
      status: "approved",
      added_by: contribution.user_id,
    });

    if (placeError) {
      console.error("Erreur création place après approbation:", placeError);
      throw placeError;
    }
  }

  return contribution;
}

