"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { City } from "@/lib/types";
import { getCitiesClient, getPlacesClient, PlaceWithCity } from "@/lib/supabase-client-queries";

const typeLabels: Record<string, string> = {
  supermarket: "🛒 Grande surface",
  store: "🌿 Épicerie",
};

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [places, setPlaces] = useState<PlaceWithCity[]>([]);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getCitiesClient().then(setCities);
    getPlacesClient().then(setPlaces);
  }, []);

  // Fermer au clic extérieur
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const q = query.toLowerCase().trim();

  const filteredCities = q
    ? cities.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q)
      )
    : [];

  const filteredPlaces = q
    ? places.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q)
      )
    : [];

  const hasResults = filteredCities.length > 0 || filteredPlaces.length > 0;

  return (
    <div className="relative w-full max-w-md mx-auto" ref={containerRef}>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(e.target.value.trim().length > 0);
        }}
        onFocus={() => query.trim().length > 0 && setIsOpen(true)}
        placeholder="Rechercher une ville ou un lieu..."
        className="w-full px-5 py-3 rounded-full bg-white border border-stone/10 shadow-sm text-stone placeholder:text-stone-muted focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage/50"
      />
      <svg
        className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-muted"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      {isOpen && q && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-stone/10 overflow-hidden z-50 max-h-80 overflow-y-auto">
          {/* Villes */}
          {filteredCities.length > 0 && (
            <div>
              <p className="px-4 py-2 text-xs font-semibold text-stone-muted uppercase bg-beige/30">
                Villes
              </p>
              {filteredCities.map((city) => (
                <button
                  key={city.id}
                  onMouseDown={() => {
                    router.push(`/city/${city.slug}`);
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-beige/50 transition-colors flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">🏙️</span>
                    <span>
                      <span className="font-medium text-stone">{city.name}</span>
                      <span className="text-sm text-stone-muted ml-2">{city.country}</span>
                    </span>
                  </span>
                  <span className="text-sm">
                    {"🌱".repeat(city.vegan_score)}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Lieux */}
          {filteredPlaces.length > 0 && (
            <div>
              <p className="px-4 py-2 text-xs font-semibold text-stone-muted uppercase bg-beige/30">
                Lieux
              </p>
              {filteredPlaces.map((place) => (
                <button
                  key={place.id}
                  onMouseDown={() => {
                    if (place.cities?.slug) {
                      router.push(`/city/${place.cities.slug}`);
                    }
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-beige/50 transition-colors flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{place.type === "supermarket" ? "🛒" : "🌿"}</span>
                    <span>
                      <span className="font-medium text-stone">{place.name}</span>
                      {place.cities?.name && (
                        <span className="text-sm text-stone-muted ml-2">{place.cities.name}</span>
                      )}
                    </span>
                  </span>
                  <span className="text-xs text-stone-muted">
                    {typeLabels[place.type] || place.type}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Aucun résultat */}
          {!hasResults && (
            <div className="px-4 py-6 text-center">
              <p className="text-stone-muted text-sm">Aucun résultat pour &quot;{query}&quot;</p>
              <p className="text-stone-muted/70 text-xs mt-1">Essaie un autre nom de ville ou de lieu</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
