import Link from "next/link";
import { City } from "@/lib/types";
import { VeganScore } from "./VeganScore";

interface CityCardProps {
  city: City;
}

export function CityCard({ city }: CityCardProps) {
  return (
    <Link href={`/city/${city.slug}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300">

        {/* Photo ou fond dégradé */}
        <div className="h-40 overflow-hidden">
          {city.image_url ? (
            <img
              src={city.image_url}
              alt={city.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-sage/20 via-beige to-sage/10 flex items-end px-5 pb-4">
              <span className="text-4xl font-black text-sage-dark/20 leading-none select-none">
                {city.name}
              </span>
            </div>
          )}
        </div>

        {/* Infos */}
        <div className="px-4 pt-3 pb-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-forest leading-tight">{city.name}</h3>
              <p className="text-xs text-forest/60 mt-0.5">{city.country}</p>
            </div>
            <VeganScore score={city.vegan_score} size="sm" showLabel={false} />
          </div>
        </div>

      </div>
    </Link>
  );
}
