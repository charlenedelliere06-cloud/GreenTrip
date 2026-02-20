"use client";

import { useState } from "react";
import { Place } from "@/lib/types";
import { PlaceTypeFilter } from "./PlaceTypeFilter";
import { PlaceCard } from "./PlaceCard";

interface CityPlacesSectionProps {
  places: Place[];
}

const typePriority: Record<string, number> = {
  supermarket: 0,
  store: 1,
};

export function CityPlacesSection({ places }: CityPlacesSectionProps) {
  const [activeType, setActiveType] = useState<string>("all");

  const filtered =
    activeType === "all"
      ? places
      : places.filter((p) => p.type === activeType);

  // Tri : supermarchés et épiceries en premier
  const sorted = [...filtered].sort(
    (a, b) => (typePriority[a.type] ?? 99) - (typePriority[b.type] ?? 99)
  );

  if (places.length === 0) {
    return (
      <section className="mt-10">
        <h2 className="text-xl font-bold text-forest mb-4">Lieux</h2>
        <div className="text-center py-12 bg-beige/30 rounded-2xl">
          <p className="text-3xl mb-3">🌱</p>
          <p className="text-forest font-medium text-lg">
            Aucun lieu pour le moment
          </p>
          <p className="text-forest/60 mt-2 max-w-md mx-auto">
            Sois le premier a partager une bonne adresse vegan ici !
          </p>
          <a
            href="/contribute"
            className="inline-block mt-4 px-6 py-2 bg-sage text-white rounded-full hover:bg-sage/90 transition-colors"
          >
            Ajouter un lieu
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold text-forest mb-4">
        Lieux ({filtered.length})
      </h2>
      <PlaceTypeFilter
        places={places}
        activeType={activeType}
        onTypeChange={setActiveType}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {sorted.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </div>
      {sorted.length === 0 && (
        <p className="text-center text-forest/40 py-8">
          Aucun lieu trouvé pour ce filtre.
        </p>
      )}
    </section>
  );
}
