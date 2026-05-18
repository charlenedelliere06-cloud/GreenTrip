import Link from "next/link";
import { City } from "@/lib/types";
import { VeganScore } from "./VeganScore";
import { CityIllustration } from "./CityIllustration";

interface CityCardProps {
  city: City;
}

export function CityCard({ city }: CityCardProps) {
  return (
    <Link href={`/city/${city.slug}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
        <div className="relative h-52 overflow-hidden">
          <img
            src={city.image_url || "/images/city-default.png"}
            alt={city.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Gradient overlay bas */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          {/* Score vegan */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <VeganScore score={city.vegan_score} size="sm" showLabel={false} />
          </div>
          {/* Nom de la ville sur la photo */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="font-bold text-xl text-white leading-tight">{city.name}</h3>
            <p className="text-sm text-white/70 mt-0.5">{city.country}</p>
          </div>
        </div>
        {/* Footer carte */}
        <div className="px-4 py-3 flex items-center justify-between">
          <span className="text-xs text-forest/40">Voir les adresses</span>
          <svg className="w-4 h-4 text-sage group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
