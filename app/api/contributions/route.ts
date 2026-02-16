import { NextRequest, NextResponse } from "next/server";

// Stockage temporaire en mémoire (sera remplacé par Supabase)
const contributions: Record<string, unknown>[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation basique
    if ((!body.city_id && !body.city_name) || !body.place_name || !body.place_type) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }

    const contribution = {
      id: `c-${Date.now()}`,
      ...body,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    contributions.push(contribution);
    console.log("Nouvelle contribution reçue:", contribution);

    return NextResponse.json({ success: true, contribution });
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(contributions);
}
