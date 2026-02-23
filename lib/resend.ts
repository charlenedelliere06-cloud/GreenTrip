import { Resend } from "resend";
import { createSupabaseAdmin } from "./supabase-admin";

const resend = new Resend(process.env.RESEND_API_KEY);

// Pour le développement, utiliser "onboarding@resend.dev"
// En production, remplacer par un domaine vérifié (ex: noreply@greentrip.app)
const FROM_EMAIL = "GreenTrip <onboarding@resend.dev>";

// Récupérer l'email d'un utilisateur depuis auth.users
async function getUserEmail(userId: string): Promise<string | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.auth.admin.getUserById(userId);
  if (error || !data?.user?.email) {
    console.error("Impossible de récupérer l'email utilisateur:", error);
    return null;
  }
  return data.user.email;
}

// Template email : contribution approuvée
function buildApprovedEmail(placeName: string, cityName: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    subject: "Ta contribution a été approuvée ! 🎉",
    html: `
      <div style="margin:0; padding:0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
        <div style="max-width:560px; margin:0 auto;">

          <!-- Header vert -->
          <div style="background-color:#9CAF88; padding:28px 32px; text-align:center;">
            <span style="color:white; font-size:24px; font-weight:bold; letter-spacing:0.5px;">Green</span><span style="color:#2D5F2D; font-size:24px; font-weight:bold; letter-spacing:0.5px;">Trip</span>
          </div>

          <!-- Contenu principal -->
          <div style="background-color:#ffffff; padding:40px 32px 32px;">

            <div style="text-align:center; font-size:44px; margin-bottom:20px;">🎉</div>

            <h2 style="color:#333333; font-size:22px; text-align:center; margin:0 0 20px; font-weight:700;">
              Bonne nouvelle !
            </h2>

            <p style="color:#555555; font-size:15px; line-height:1.7; text-align:center; margin:0 0 12px;">
              Ta contribution <strong style="color:#333333;">${placeName}</strong> à <strong style="color:#333333;">${cityName}</strong> a été validée par notre équipe.
            </p>

            <p style="color:#888888; font-size:14px; line-height:1.7; text-align:center; margin:0 0 32px;">
              Elle est maintenant visible par toute la communauté GreenTrip. Merci de rendre le voyage vegan plus facile pour tout le monde !
            </p>

            <!-- Bouton CTA -->
            <div style="text-align:center; margin:0 0 32px;">
              <a href="${siteUrl}" style="display:inline-block; background-color:#9CAF88; color:white; font-weight:600; font-size:15px; padding:14px 36px; border-radius:25px; text-decoration:none;">
                Explorer GreenTrip
              </a>
            </div>
          </div>

          <!-- Séparateur -->
          <div style="background-color:#ffffff; padding:0 32px;">
            <div style="border-top:1px solid #eeeeee;"></div>
          </div>

          <!-- Section info -->
          <div style="background-color:#ffffff; padding:24px 32px;">
            <p style="color:#888888; font-size:13px; line-height:1.6; text-align:center; margin:0 0 8px;">
              Tu peux suivre le statut de toutes tes contributions dans la section <strong style="color:#555555;">Mes contributions</strong>.
            </p>
          </div>

          <!-- Footer -->
          <div style="padding:24px 32px; text-align:center;">
            <p style="color:#bbbbbb; font-size:11px; margin:0; line-height:1.5;">
              Tu reçois cet email car tu as contribué sur GreenTrip.
            </p>
          </div>

        </div>
      </div>
    `,
  };
}

// Template email : contribution rejetée
function buildRejectedEmail(placeName: string, cityName: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    subject: "À propos de ta contribution sur GreenTrip",
    html: `
      <div style="margin:0; padding:0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
        <div style="max-width:560px; margin:0 auto;">

          <!-- Header vert -->
          <div style="background-color:#9CAF88; padding:28px 32px; text-align:center;">
            <span style="color:white; font-size:24px; font-weight:bold; letter-spacing:0.5px;">Green</span><span style="color:#2D5F2D; font-size:24px; font-weight:bold; letter-spacing:0.5px;">Trip</span>
          </div>

          <!-- Contenu principal -->
          <div style="background-color:#ffffff; padding:40px 32px 32px;">

            <h2 style="color:#333333; font-size:22px; text-align:center; margin:0 0 20px; font-weight:700;">
              Merci pour ta contribution
            </h2>

            <p style="color:#555555; font-size:15px; line-height:1.7; text-align:center; margin:0 0 12px;">
              Malheureusement, ta suggestion <strong style="color:#333333;">${placeName}</strong> à <strong style="color:#333333;">${cityName}</strong> n'a pas pu être retenue cette fois-ci.
            </p>

            <p style="color:#888888; font-size:14px; line-height:1.7; text-align:center; margin:0 0 32px;">
              Cela peut arriver si le lieu ne correspond pas encore à nos critères ou s'il a déjà été ajouté. N'hésite pas à proposer d'autres adresses !
            </p>

            <!-- Bouton CTA -->
            <div style="text-align:center; margin:0 0 32px;">
              <a href="${siteUrl}/contribute" style="display:inline-block; background-color:#9CAF88; color:white; font-weight:600; font-size:15px; padding:14px 36px; border-radius:25px; text-decoration:none;">
                Proposer un autre lieu
              </a>
            </div>
          </div>

          <!-- Séparateur -->
          <div style="background-color:#ffffff; padding:0 32px;">
            <div style="border-top:1px solid #eeeeee;"></div>
          </div>

          <!-- Section info -->
          <div style="background-color:#ffffff; padding:24px 32px;">
            <p style="color:#888888; font-size:13px; line-height:1.6; text-align:center; margin:0 0 8px;">
              Tu peux suivre le statut de toutes tes contributions dans la section <strong style="color:#555555;">Mes contributions</strong>.
            </p>
          </div>

          <!-- Footer -->
          <div style="padding:24px 32px; text-align:center;">
            <p style="color:#bbbbbb; font-size:11px; margin:0; line-height:1.5;">
              Tu reçois cet email car tu as contribué sur GreenTrip.
            </p>
          </div>

        </div>
      </div>
    `,
  };
}

// Fonction principale : envoyer l'email de notification
export async function sendContributionEmail(
  userId: string,
  status: "approved" | "rejected",
  placeName: string,
  cityName: string
): Promise<void> {
  try {
    const email = await getUserEmail(userId);
    if (!email) {
      console.warn("Pas d'email trouvé pour l'utilisateur", userId, "— email non envoyé.");
      return;
    }

    const { subject, html } =
      status === "approved"
        ? buildApprovedEmail(placeName, cityName)
        : buildRejectedEmail(placeName, cityName);

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject,
      html,
    });

    if (error) {
      console.error("Erreur Resend:", error);
    }
  } catch (err) {
    // On log mais on ne throw pas — l'email ne doit pas bloquer la modération
    console.error("Échec envoi email contribution:", err);
  }
}
