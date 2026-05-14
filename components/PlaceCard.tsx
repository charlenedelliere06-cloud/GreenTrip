import Link from "next/link";
import { Place } from "@/lib/types";
import { PLACE_TYPE_CONFIG } from "@/lib/place-types";

interface PlaceCardProps {
  place: Place;
}

export function PlaceCard({ place }: PlaceCardProps) {
  const cfg = PLACE_TYPE_CONFIG[place.type];

  return (
    <Link href={`/place/${place.id}`} className="block group">
      <div className="bg-white rounded-xl shadow-sm group-hover:shadow-md transition-shadow p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-forest truncate group-hover:text-sage-dark transition-colors">
              {place.name}
            </h3>
            {place.address && (
              <p className="text-xs text-forest/50 mt-0.5 truncate">{place.address}</p>
            )}
          </div>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${cfg?.pastelBg} ${cfg?.pastelText}`}
          >
            {cfg?.icon} {cfg?.label}
          </span>
        </div>

        {place.description && (
          <p className="text-sm text-forest/70 line-clamp-2 leading-relaxed">
            {place.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          {place.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-beige text-forest/60 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
          {place.price_range && (
            <span className="text-xs text-forest/40 ml-auto">
              {"€".repeat(place.price_range)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
