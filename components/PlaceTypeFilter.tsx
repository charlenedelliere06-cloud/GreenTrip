"use client";

import { Place } from "@/lib/types";

const typeConfig = [
  { value: "all", label: "Tous", icon: "\uD83D\uDCCD" },
  { value: "supermarket", label: "Supermarchés", icon: "\uD83D\uDED2" },
  { value: "store", label: "Épiceries bio", icon: "\uD83C\uDF3F" },
  { value: "restaurant", label: "Restaurants", icon: "\uD83C\uDF7D\uFE0F" },
  { value: "cafe", label: "Cafés", icon: "\u2615" },
];

interface PlaceTypeFilterProps {
  places: Place[];
  activeType: string;
  onTypeChange: (type: string) => void;
}

export function PlaceTypeFilter({
  places,
  activeType,
  onTypeChange,
}: PlaceTypeFilterProps) {
  // Compter les lieux par type
  const counts: Record<string, number> = { all: places.length };
  places.forEach((p) => {
    counts[p.type] = (counts[p.type] || 0) + 1;
  });

  return (
    <div className="flex flex-wrap gap-2">
      {typeConfig.map((t) => {
        const count = counts[t.value] || 0;
        const isActive = activeType === t.value;

        // Ne pas afficher les types sans lieux (sauf "Tous")
        if (t.value !== "all" && count === 0) return null;

        return (
          <button
            key={t.value}
            onClick={() => onTypeChange(t.value)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all ${
              isActive
                ? "bg-sage text-white shadow-sm"
                : "bg-white text-forest/70 border border-beige-dark hover:bg-beige/50"
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
            <span
              className={`text-xs ml-0.5 ${
                isActive ? "text-white/70" : "text-forest/40"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
