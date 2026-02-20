import { SearchBar } from "@/components/SearchBar";
import { GeolocateButton } from "@/components/GeolocateButton";
import { CityCard } from "@/components/CityCard";
import { getCities } from "@/lib/supabase-queries";

export default async function HomePage() {
  const cities = await getCities();
  const trendingCities = cities.filter((c) => c.image_url);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-sage/10 to-offwhite pt-20 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-forest leading-tight">
            Voyagez <span className="text-sage">vegan</span>,<br />
            partout dans le monde
          </h1>
          <p className="mt-4 text-forest/60 text-lg max-w-xl mx-auto">
            Supermarchés, épiceries et bons plans pour trouver des produits vegan
            partout où tu voyages.
          </p>
          <div className="mt-8">
            <SearchBar />
            <GeolocateButton />
          </div>
        </div>
      </section>

      {/* Top tendance */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-forest mb-6">
          Top tendance
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingCities.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="bg-beige/50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-forest mb-10">
            Comment ça marche
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="font-semibold text-forest">Cherche ta ville</h3>
              <p className="text-sm text-forest/60 mt-2">
                Tape le nom d&apos;une destination pour découvrir son score vegan et ses
                meilleures adresses.
              </p>
            </div>
            <div>
              <div className="text-3xl mb-3">📍</div>
              <h3 className="font-semibold text-forest">Explore les lieux</h3>
              <p className="text-sm text-forest/60 mt-2">
                Grandes surfaces, épiceries, magasins bio — les meilleurs
                endroits pour trouver des produits vegan.
              </p>
            </div>
            <div>
              <div className="text-3xl mb-3">💡</div>
              <h3 className="font-semibold text-forest">Lis les tips</h3>
              <p className="text-sm text-forest/60 mt-2">
                Astuces locales et pièges à éviter pour manger vegan sans
                stress.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
