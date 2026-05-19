import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Créer un compte",
  description: "Rejoins GreenTrip et contribue à la plus grande carte vegan du monde.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
