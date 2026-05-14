import { notFound } from "next/navigation";
import Link from "next/link";
import { getCityBySlug, getPlacesByCity } from "@/lib/supabase-queries";
import { VeganScore } from "@/components/VeganScore";
import { Map } from "@/components/Map";
import { CityPlacesSection } from "@/components/CityPlacesSection";

interface CityPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CityPage({ params }: CityPageProps) {
  const { slug } = await params;
  const city = await getCityBySlug(slug);

  if (!city) {
    notFound();
  }

  const places = await getPlacesByCity(city.id);

  return (
    <div>
      {/* Hero ville */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        {city.image_url ? (
          <img
            src={city.image_url}
            alt={city.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-sage to-forest" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-forest/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-6xl mx-auto">
          <p className="text-beige/80 text-sm">{city.country}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mt-1">
            {city.name}
          </h1>
          <div className="mt-2">
            <VeganScore score={city.vegan_score} size="lg" />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Description */}
        <p className="text-forest/80 text-lg max-w-3xl">{city.description}</p>

        {/* Carte */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-forest mb-4">Carte</h2>
          <Map center={[city.lat, city.lng]} places={places} citySlug={city.slug} />
        </section>

        {/* Lieux avec filtres */}
        <CityPlacesSection places={places} />

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
