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
  restaurant: 2,
  cafe: 3,
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
