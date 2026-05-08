import { NextRequest, NextResponse } from "next/server";
import { updatePlace, deletePlace } from "@/lib/supabase-queries";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await updatePlace(id, body);
    return NextResponse.json({ success: true, place: updated });
  } catch (err) {
    console.error("Erreur PATCH /api/places/[id]:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await deletePlace(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur DELETE /api/places/[id]:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
