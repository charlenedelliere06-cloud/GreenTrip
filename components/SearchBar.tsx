"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { City } from "@/lib/types";
import { getCitiesClient } from "@/lib/supabase-client-queries";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const router = useRouter();

  useEffect(() => {
    getCitiesClient().then(setCities);
  }, []);

  const filtered = cities.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.country.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(e.target.value.length > 0);
        }}
        onFocus={() => query.length > 0 && setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        placeholder="Rechercher une ville..."
        className="w-full px-5 py-3 rounded-full bg-white border border-beige-dark shadow-sm text-forest placeholder:text-forest/40 focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
      />
      <svg
        className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-forest/40"
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
      {isOpen && filtered.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-beige-dark overflow-hidden z-50">
          {filtered.map((city) => (
            <button
              key={city.id}
              onMouseDown={() => {
                router.push(`/city/${city.slug}`);
                setIsOpen(false);
                setQuery("");
              }}
              className="w-full text-left px-4 py-3 hover:bg-beige/50 transition-colors flex items-center justify-between"
            >
              <span>
                <span className="font-medium text-forest">{city.name}</span>
                <span className="text-sm text-forest/50 ml-2">
                  {city.country}
                </span>
              </span>
              <span className="text-sm">
                {"🌱".repeat(city.vegan_score)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
