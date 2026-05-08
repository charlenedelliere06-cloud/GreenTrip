import { createSupabaseServer } from "./supabase-server";
import { createSupabaseAdmin } from "./supabase-admin";
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
      type: "place",
      place_name: body.place_name as string,
      place_type: body.place_type as string,
      city_id: body.city_id || null,
      city_name: body.city_name as string,
      city_country: body.city_country as string,
      is_new_city: body.is_new_city as boolean,
      place_address: (body.place_address as string) || "",
      place_lat: body.place_lat as number | null,
      place_lng: body.place_lng as number | null,
      place_description: (body.place_description as string) || "",
      place_google_maps_url: (body.place_google_maps_url as string) || "",
      place_tags: (body.place_tags as string[]) || [],
      place_photos: (body.place_photos as string[]) || [],
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

  // Si approuvé → créer la ville (si nouvelle) puis le lieu
  if (status === "approved" && contribution) {
    let cityId = contribution.city_id;

    // Si c'est une nouvelle ville, vérifier si elle existe déjà sinon la créer
    if (contribution.is_new_city && contribution.city_name) {
      const slug = contribution.city_name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Vérifier si la ville existe déjà
      const { data: existingCity } = await supabase
        .from("cities")
        .select("id")
        .eq("slug", slug)
        .single();

      if (existingCity) {
        cityId = existingCity.id;
      } else {
        const { data: newCity, error: cityError } = await supabase
          .from("cities")
          .insert({
            name: contribution.city_name,
            country: contribution.city_country || "",
            slug,
            vegan_score: 3,
            description: `Découvrez les adresses vegan à ${contribution.city_name}.`,
            image_url: "",
            lat: contribution.place_lat || 0,
            lng: contribution.place_lng || 0,
          })
          .select()
          .single();

        if (cityError) {
          console.error("Erreur création ville:", cityError);
          throw cityError;
        }

        cityId = newCity.id;
      }
    }

    const { error: placeError } = await supabase.from("places").insert({
      city_id: cityId,
      name: contribution.place_name,
      type: contribution.place_type,
      address: contribution.place_address || "",
      lat: contribution.place_lat || 0,
      lng: contribution.place_lng || 0,
      description: contribution.place_description || "",
      google_maps_url: contribution.place_google_maps_url || "",
      tags: contribution.place_tags || [],
      photos: contribution.place_photos || [],
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

export async function getPlaces(): Promise<Place[]> {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("places")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur getPlaces:", error);
    return [];
  }
  return data || [];
}

export async function deletePlace(id: string) {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("places").delete().eq("id", id);
  if (error) {
    console.error("Erreur deletePlace:", error);
    throw error;
  }
}

export async function updatePlace(
  id: string,
  updates: {
    name?: string;
    type?: string;
    address?: string;
    description?: string;
    google_maps_url?: string;
    tags?: string[];
    photos?: string[];
    lat?: number;
    lng?: number;
  }
) {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("places")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erreur updatePlace:", error);
    throw error;
  }
  return data;
}

