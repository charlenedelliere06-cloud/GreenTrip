import { notFound } from "next/navigation";
import Link from "next/link";
import { getPlaceById, getCities } from "@/lib/supabase-queries";
import { PhotoGallery } from "@/components/PhotoGallery";
import { PLACE_TYPE_CONFIG } from "@/lib/place-types";
import { ReviewSection } from "@/components/ReviewSection";



interface PlacePageProps {
  params: Promise<{ id: string }>;
}

export default async function PlacePage({ params }: PlacePageProps) {
  const { id } = await params;
  const place = await getPlaceById(id);

  if (!place) {
    notFound();
  }

  const cities = await getCities();
  const city = cities.find((c) => c.id === place.city_id);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-forest/50 mb-6">
        <Link href="/" className="hover:text-sage-dark">
          Accueil
        </Link>
        {" / "}
        {city && (
          <>
            <Link
              href={`/city/${city.slug}`}
              className="hover:text-sage-dark"
            >
              {city.name}
            </Link>
            {" / "}
          </>
        )}
        <span className="text-forest/80">{place.name}</span>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block text-xs font-medium bg-sage/10 text-sage-dark px-2.5 py-1 rounded-full">
                {PLACE_TYPE_CONFIG[place.type]?.icon} {PLACE_TYPE_CONFIG[place.type]?.label}
              </span>
              {place.price_range && (
                <span className="inline-block text-xs font-medium bg-beige text-forest/70 px-2.5 py-1 rounded-full">
                  {"€".repeat(place.price_range)}
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-forest">
              {place.name}
            </h1>
            <p className="text-forest/60 mt-1">{place.address}</p>
          </div>
        </div>

        <p className="text-forest/80 mt-4 leading-relaxed">
          {place.description}
        </p>

        {/* Photos */}
        <div className="mt-6">
          <PhotoGallery photos={place.photos} placeName={place.name} />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {place.tags.map((tag) => (
            <span
              key={tag}
              className="text-sm bg-beige text-forest/70 px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-beige-dark">
          {place.google_maps_url && (
            <a
              href={place.google_maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-sage text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-sage-dark transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Ouvrir dans Google Maps
            </a>
          )}
          {city && (
            <Link
              href={`/city/${city.slug}`}
              className="inline-flex items-center gap-2 bg-beige text-forest px-5 py-2.5 rounded-full text-sm font-medium hover:bg-beige-dark transition-colors"
            >
              Retour à {city.name}
            </Link>
          )}
        </div>
      </div>
      {/* Avis de la communauté */}
      <ReviewSection placeId={place.id} />
    </div>
  );
}
