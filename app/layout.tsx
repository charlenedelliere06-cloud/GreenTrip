import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "GreenTrip — Guide de voyage vegan",
  description:
    "Trouvez les supermarchés et épiceries avec des produits vegan partout dans le monde.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-offwhite text-forest font-sans antialiased">
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&libraries=places`}
          strategy="afterInteractive"
        />
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen pt-20">{children}</main>
          <footer className="bg-sage-dark text-white mt-16">
            <div className="max-w-6xl mx-auto px-4 py-12">

              {/* Grille 3 colonnes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">

                {/* Colonne 1 : Marque */}
                <div>
                  <p className="text-xl font-bold tracking-tight">
                    Green<span className="text-sage-light">Trip</span>
                  </p>
                  <p className="text-sm text-white/50 mt-3 leading-relaxed">
                    Le guide <span className="text-sage-light">vegan</span> du voyageur — trouve des produits partout dans le monde.
                  </p>
                </div>

                {/* Colonne 2 : Navigation */}
                <div>
                  <p className="text-xs font-semibold tracking-[0.15em] uppercase text-white/30 mb-4">
                    Navigation
                  </p>
                  <ul className="space-y-2.5 text-sm">
                    <li>
                      <Link href="/" className="text-white/60 hover:text-white transition-colors">
                        Explorer les villes
                      </Link>
                    </li>
                    <li>
                      <Link href="/login?redirect=/contribute" className="text-white/60 hover:text-white transition-colors">
                        Contribuer
                      </Link>
                    </li>
                    <li>
                      <Link href="/my-contributions" className="text-white/60 hover:text-white transition-colors">
                        Mes contributions
                      </Link>
                    </li>
                    <li>
                      <Link href="/login" className="text-white/60 hover:text-white transition-colors">
                        Se connecter
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Colonne 3 : Mission */}
                <div>
                  <p className="text-xs font-semibold tracking-[0.15em] uppercase text-white/30 mb-4">
                    Notre mission
                  </p>
                  <p className="text-sm text-white/50 leading-relaxed">
                    Rendre le voyage vegan simple et accessible pour tous, partout dans le monde.
                  </p>
                </div>

              </div>

              {/* Ligne de séparation + bas de page */}
              <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/25">
                <p>&copy; 2025 GreenTrip &mdash; Fait avec des plantes, pour la plan&egrave;te.</p>
                <p className="text-sage-light/60">&#127807;</p>
              </div>

            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
