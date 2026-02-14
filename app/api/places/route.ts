import { NextRequest, NextResponse } from "next/server";
import { places } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const cityId = request.nextUrl.searchParams.get("city_id");

  if (cityId) {
    const filtered = places.filter((p) => p.city_id === cityId);
    return NextResponse.json(filtered);
  }

  return NextResponse.json(places);
}
