import { notFound } from "next/navigation";
import { getCityBySlug, getPlacesByCity, getTipsByCity } from "@/lib/mock-data";
import { VeganScore } from "@/components/VeganScore";
import { TipCard } from "@/components/TipCard";
import { Map } from "@/components/Map";
import { CityPlacesSection } from "@/components/CityPlacesSection";

interface CityPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CityPage({ params }: CityPageProps) {
  const { slug } = await params;
  const city = getCityBySlug(slug);

  if (!city) {
    notFound();
  }

  const places = getPlacesByCity(city.id);
  const tips = getTipsByCity(city.id);

  return (
    <div>
      {/* Hero ville */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={city.image_url}
          alt={city.name}
          className="w-full h-full object-cover"
        />
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
          <Map center={[city.lat, city.lng]} places={places} />
        </section>

        {/* Lieux avec filtres */}
        <CityPlacesSection places={places} />

        {/* Tips */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-forest mb-4">
            Tips & pièges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tips.map((tip) => (
              <TipCard key={tip.id} tip={tip} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
