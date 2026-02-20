import Link from "next/link";
import { City } from "@/lib/types";
import { VeganScore } from "./VeganScore";

interface CityCardProps {
  city: City;
}

export function CityCard({ city }: CityCardProps) {
  return (
    <Link href={`/city/${city.slug}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="relative h-48 overflow-hidden">
          {city.image_url ? (
            <img
              src={city.image_url}
              alt={city.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-sage/40 to-forest/30 flex items-center justify-center">
              <span className="text-4xl font-bold text-white/80">{city.name}</span>
            </div>
          )}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <VeganScore score={city.vegan_score} size="sm" />
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg text-forest">{city.name}</h3>
          <p className="text-sm text-forest/60 mt-0.5">{city.country}</p>
          <p className="text-sm text-forest/80 mt-2 line-clamp-2">
            {city.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
