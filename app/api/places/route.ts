import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const cityId = request.nextUrl.searchParams.get("city_id");
  const supabase = await createSupabaseServer();

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
