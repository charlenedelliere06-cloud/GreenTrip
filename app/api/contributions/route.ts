import { NextResponse } from "next/server";
import { createContribution, getContributions } from "@/lib/supabase-queries";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validation basique
    if ((!body.city_id && !body.city_name) || !body.place_name || !body.place_type) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }

    const contribution = await createContribution(body);

    return NextResponse.json({ success: true, contribution });
  } catch (err) {
    console.error("Erreur POST /api/contributions:", err);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const contributions = await getContributions();
    return NextResponse.json(contributions);
  } catch (err) {
    console.error("Erreur GET /api/contributions:", err);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
