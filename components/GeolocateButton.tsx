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
    <div className="mt-4">
      <button
        onClick={handleGeolocate}
        disabled={locating}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-beige-dark text-forest text-sm font-medium hover:bg-beige/50 hover:border-sage/50 transition-all disabled:opacity-50 shadow-sm"
      >
        {locating ? (
          <span className="w-4 h-4 border-2 border-forest/30 border-t-forest rounded-full animate-spin" />
        ) : (
          <svg className="w-4 h-4 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2M2 12h2m16 0h2m-3.636-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414m0-11.314l1.414 1.414m9.9 9.9l1.414 1.414M12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
        )}
        {locating ? "Localisation..." : "Utiliser ma position"}
      </button>
      {error && (
        <p className="text-xs text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
}
