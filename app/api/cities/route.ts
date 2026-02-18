import { NextResponse } from "next/server";
import { getCities } from "@/lib/supabase-queries";

export async function GET() {
  const cities = await getCities();
  return NextResponse.json(cities);
}
