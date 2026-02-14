import { NextRequest, NextResponse } from "next/server";
import { tips } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const cityId = request.nextUrl.searchParams.get("city_id");

  if (cityId) {
    const filtered = tips.filter((t) => t.city_id === cityId);
    return NextResponse.json(filtered);
  }

  return NextResponse.json(tips);
}
