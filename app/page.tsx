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
      <section className="bg-forest pt-20 pb-20 px-4 relative overflow-hidden">
        {/* Cercles décoratifs en arrière-plan */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-sage/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-20 w-72 h-72 rounded-full bg-sage/10 blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-sage-light mb-6">
            Le guide vegan du voyageur
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight">
            Voyagez <span className="text-sage-light">vegan</span>,<br />
            partout dans le monde
          </h1>
          <p className="mt-6 text-white/60 text-lg max-w-xl mx-auto leading-relaxed">
            Supermarchés, épiceries et bons plans pour trouver des produits vegan
            partout où tu voyages.
          </p>
          <div className="mt-10">
            <SearchBar />
            <GeolocateButton />
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-forest mb-2">
          Explore une ville
        </h2>
        <p className="text-forest/50 mb-6">
          Trouve les supermarch&eacute;s et &eacute;piceries vegan pr&egrave;s de ta destination.
        </p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-semibold text-forest text-lg">Cherche ta ville</h3>
              <p className="text-sm text-forest/60 mt-2">
                Tape le nom d&apos;une destination pour d&eacute;couvrir son score vegan et ses
                meilleurs magasins.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-5xl mb-4">🛒</div>
              <h3 className="font-semibold text-forest text-lg">Trouve tes produits</h3>
              <p className="text-sm text-forest/60 mt-2">
                Supermarch&eacute;s, &eacute;piceries, magasins bio &mdash; les meilleurs
                endroits pour trouver des produits vegan.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-5xl mb-4">📍</div>
              <h3 className="font-semibold text-forest text-lg">Partage tes bons plans</h3>
              <p className="text-sm text-forest/60 mt-2">
                Ajoute tes adresses favorites pour aider la communaut&eacute; &agrave; voyager vegan.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
