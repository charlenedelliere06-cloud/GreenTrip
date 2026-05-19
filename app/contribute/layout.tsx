import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contribuer",
  description:
    "Suggère un supermarché, une épicerie bio ou un magasin vegan dans ta ville. Aide la communauté GreenTrip à grandir !",
};

export default function ContributeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
