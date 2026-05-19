import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCityBySlug, getPlacesByCity, getPlacesNearbyCity, NearbyPlace } from "@/lib/supabase-queries";
import { VeganScore } from "@/components/VeganScore";
import { Map } from "@/components/Map";
import { CityPlacesSection } from "@/components/CityPlacesSection";

interface CityPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const city = await getCityBySlug(slug);

  if (!city) {
    return { title: "Ville introuvable" };
  }

  const title = `${city.name} — Guide vegan`;
  const description = `Trouve les supermarchés, épiceries bio et magasins vegan à ${city.name}, ${city.country}. ${city.description ?? ""}`.trim();

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(city.image_url ? { images: [{ url: city.image_url }] } : {}),
    },
    twitter: {
      title,
      description,
      ...(city.image_url ? { images: [city.image_url] } : {}),
    },
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const { slug } = await params;
  const city = await getCityBySlug(slug);

  if (!city) {
    notFound();
  }

  const places = await getPlacesByCity(city.id);
  const nearbyPlaces = await getPlacesNearbyCity(city.id, city.lat, city.lng);

  return (
    <div>
      {/* Hero ville */}
      <section className="relative h-56 md:h-72 overflow-hidden">
        {city.image_url ? (
          <img
            src={city.image_url}
            alt={city.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-sage to-forest" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-7 md:px-12 md:pb-10 max-w-6xl mx-auto">
          <p className="text-white/60 text-xs font-semibold tracking-[0.25em] uppercase mb-1.5">
            {city.country}
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none">
            {city.name}
          </h1>
          <div className="mt-3">
            <VeganScore score={city.vegan_score} size="lg" />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Description */}
        <p className="text-forest text-base md:text-lg max-w-3xl font-medium leading-relaxed">{city.description}</p>

        {/* Carte */}
        <section className="mt-8">
          <h2 className="text-xl font-bold text-forest mb-4">Carte</h2>
          <Map center={[city.lat, city.lng]} places={places} nearbyPlaces={nearbyPlaces} citySlug={city.slug} />
        </section>

        {/* Lieux avec filtres */}
        <CityPlacesSection places={places} />

        {/* Magasins à proximité */}
        {nearbyPlaces.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-forest mb-1">Dans les environs</h2>
            <p className="text-forest/50 text-sm mb-4">Magasins à moins de 80 km de {city.name}</p>
            <div className="space-y-3">
              {nearbyPlaces.map((place: NearbyPlace) => (
                <Link
                  key={place.id}
                  href={`/place/${place.id}`}
                  className="flex items-center justify-between bg-white rounded-xl px-4 py-3.5 shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{place.type === "supermarket" ? "🛒" : "🌿"}</span>
                    <div>
                      <p className="font-medium text-forest group-hover:text-sage-dark transition-colors">
                        {place.name}
                      </p>
                      <p className="text-sm text-forest/50">{place.cityName}</p>
                    </div>
                  </div>
                  <span className="text-xs text-forest/40 shrink-0 ml-2">
                    ~{place.distanceKm} km
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Appel à contribution */}
        <section className="mt-10">
          <div className="bg-gradient-to-br from-sage/10 to-beige rounded-2xl p-7 flex flex-col sm:flex-row items-center gap-5">
            <div className="text-4xl">🌿</div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg font-bold text-forest">
                Tu connais une bonne adresse à {city.name} ?
              </h3>
              <p className="text-forest/60 text-sm mt-1">
                Magasin entièrement vegan, épicerie bio ou supermarché avec un bon rayon vegan — partage-le avec la communauté !
              </p>
            </div>
            <Link
              href="/contribute"
              className="flex-shrink-0 bg-sage text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-sage-dark transition-colors"
            >
              Ajouter un lieu
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
