import Link from "next/link";
import { Place } from "@/lib/types";

const typeLabels: Record<Place["type"], string> = {
  restaurant: "Restaurant",
  supermarket: "Supermarché",
  cafe: "Café",
  store: "Épicerie",
};

const typeColors: Record<Place["type"], string> = {
  restaurant: "bg-sage/10 text-sage-dark",
  supermarket: "bg-amber-50 text-amber-700",
  cafe: "bg-orange-50 text-orange-700",
  store: "bg-emerald-50 text-emerald-700",
};

interface PlaceCardProps {
  place: Place;
}

export function PlaceCard({ place }: PlaceCardProps) {
  return (
    <Link href={`/place/${place.id}`} className="block">
      <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-forest truncate">{place.name}</h3>
            <p className="text-sm text-forest/60 mt-0.5">{place.address}</p>
            <p className="text-sm text-forest/80 mt-2 line-clamp-2">
              {place.description}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {place.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-beige text-forest/70 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${typeColors[place.type]}`}
          >
            {typeLabels[place.type]}
          </span>
        </div>
      </div>
    </Link>
  );
}
