import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "GreenTrip — Guide de voyage vegan",
  description:
    "Trouvez les meilleurs restaurants, supermarchés et tips vegan dans le monde entier.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-offwhite text-forest font-sans antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <footer className="bg-forest text-beige py-8 mt-16">
          <div className="max-w-6xl mx-auto px-4 text-center text-sm opacity-80">
            <p>GreenTrip — Le guide de voyage vegan</p>
            <p className="mt-1">Fait avec des plantes, pour la planète.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
