import type { Metadata } from "next";
import Script from "next/script";
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
          <main className="min-h-screen">{children}</main>
          <footer className="bg-forest text-beige py-10 mt-16">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left">
                  <p className="font-bold text-lg">Green<span className="text-sage-light">Trip</span></p>
                  <p className="text-sm opacity-60 mt-1">Ne perds plus de temps à chercher des produits vegan en voyage.</p>
                </div>
                <div className="flex gap-6 text-sm opacity-80">
                  <a href="/" className="hover:text-white transition-colors">Explorer</a>
                  <a href="/login?redirect=/contribute" className="hover:text-white transition-colors">Contribuer</a>
                  <a href="/login" className="hover:text-white transition-colors">Se connecter</a>
                </div>
              </div>
              <div className="border-t border-beige/20 mt-6 pt-6 text-center text-xs opacity-50">
                <p>Fait avec des plantes, pour la planète.</p>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
