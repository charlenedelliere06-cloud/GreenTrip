import { NextRequest, NextResponse } from "next/server";
import { updateContributionStatus } from "@/lib/supabase-queries";
import { sendContributionEmail } from "@/lib/resend";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.status || !["approved", "rejected"].includes(body.status)) {
      return NextResponse.json(
        { error: "Statut invalide (approved ou rejected)" },
        { status: 400 }
      );
    }

    const contribution = await updateContributionStatus(id, body.status);

    // Envoyer un email de notification à l'utilisateur
    await sendContributionEmail(
      contribution.user_id,
      body.status,
      contribution.place_name || "Lieu sans nom",
      contribution.city_name || "Ville inconnue"
    );

    return NextResponse.json({ success: true, contribution });
  } catch (err) {
    console.error("Erreur PATCH /api/contributions/[id]:", err);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
