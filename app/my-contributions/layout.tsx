import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mes contributions",
  description: "Retrouve tous les lieux vegan que tu as suggérés sur GreenTrip.",
};

export default function MyContributionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
