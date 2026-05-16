import { NextResponse } from "next/server";
import { createContribution, getContributions } from "@/lib/supabase-queries";
import { sendContributionReceivedEmail } from "@/lib/resend";

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

    // Envoyer l'email de confirmation à l'utilisateur
    if (body.user_id) {
      await sendContributionReceivedEmail(
        body.user_id,
        body.place_name,
        body.city_name || "ta ville"
      );
    }

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
