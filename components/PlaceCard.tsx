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
  const hasPhoto = place.photos && place.photos.length > 0;

  return (
    <Link href={`/place/${place.id}`} className="block">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        <div className="flex">
          {/* Photo miniature */}
          {hasPhoto && (
            <div className="w-24 h-28 shrink-0">
              <img
                src={place.photos[0]}
                alt={place.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Contenu */}
          <div className="p-4 flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-forest truncate">
                  {place.name}
                </h3>
                <p className="text-sm text-forest/60 mt-0.5">{place.address}</p>
              </div>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${typeColors[place.type]}`}
              >
                {typeLabels[place.type]}
              </span>
            </div>
            <p className="text-sm text-forest/80 mt-2 line-clamp-2">
              {place.description}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {place.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-beige text-forest/70 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {place.photos.length > 0 && (
                <span className="text-xs text-forest/40">
                  📷 {place.photos.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
