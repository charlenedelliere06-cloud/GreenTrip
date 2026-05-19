"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { City } from "@/lib/types";
import { getCitiesClient } from "@/lib/supabase-client-queries";

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function GeolocateButton() {
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleGeolocate = async () => {
    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas disponible sur ton appareil.");
      return;
    }

    setLocating(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        const cities = await getCitiesClient();
        if (cities.length === 0) {
          setError("Aucune ville disponible.");
          setLocating(false);
          return;
        }

        let closest: City = cities[0];
        let minDist = Infinity;

        for (const city of cities) {
          const d = getDistance(latitude, longitude, city.lat, city.lng);
          if (d < minDist) {
            minDist = d;
            closest = city;
          }
        }

        router.push(`/city/${closest.slug}`);
        setLocating(false);
      },
      () => {
        setError("Position refusée. Active la localisation dans tes réglages.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="mt-5 flex flex-col items-center gap-1">
      <button
        onClick={handleGeolocate}
        disabled={locating}
        className="inline-flex items-center gap-1.5 text-sm text-stone-muted hover:text-stone transition-colors disabled:opacity-40"
      >
        {locating ? (
          <span className="w-3 h-3 border border-stone/20 border-t-stone/50 rounded-full animate-spin" />
        ) : (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )}
        {locating ? "Localisation en cours..." : "Utiliser ma position"}
      </button>
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
