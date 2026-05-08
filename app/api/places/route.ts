import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const cityId = request.nextUrl.searchParams.get("city_id");
  const id = request.nextUrl.searchParams.get("id");
  const supabase = await createSupabaseServer();

  // Récupérer un lieu par son ID
  if (id) {
    const { data, error } = await supabase
      .from("places")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  // Récupérer tous les lieux (filtrés optionnellement par ville)
  let query = supabase
    .from("places")
    .select("*")
    .eq("status", "approved")
    .order("name");

  if (cityId) {
    query = query.eq("city_id", cityId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}
