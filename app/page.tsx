import { HeroSection } from "@/components/HeroSection";
import { CityCard } from "@/components/CityCard";
import { getCities } from "@/lib/supabase-queries";

export default async function HomePage() {
  const cities = await getCities();

  return (
    <div>
      <HeroSection />

      {/* Destinations */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="mb-10">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-sage-dark mb-3">
            Destinations
          </span>
          <h2 className="text-3xl font-bold text-forest leading-tight">
            Explore une ville
          </h2>
          <p className="text-sm text-forest/60 mt-2">
            S&eacute;lectionne une destination pour voir ses adresses vegan.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city, i) => (
            <div
              key={city.id}
              style={{
                animation: "fade-up 0.5s ease-out both",
                animationDelay: `${i * 100}ms`,
              }}
            >
              <CityCard city={city} />
            </div>
          ))}
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="bg-beige/40 py-16 px-4">
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-14">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-sage-dark mb-3">
              Mode d&apos;emploi
            </span>
            <h2 className="text-2xl font-bold text-forest">
              Comment &ccedil;a marche
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-sage/15 ring-1 ring-sage/25 flex items-center justify-center mb-5">
                <span className="text-xl font-black text-sage-dark">1</span>
              </div>
              <h3 className="font-semibold text-forest text-base mb-2">Cherche ta ville</h3>
              <p className="text-sm text-forest/60 leading-relaxed">
                Tape le nom d&apos;une destination pour d&eacute;couvrir ses meilleurs magasins vegan.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-sage/15 ring-1 ring-sage/25 flex items-center justify-center mb-5">
                <span className="text-xl font-black text-sage-dark">2</span>
              </div>
              <h3 className="font-semibold text-forest text-base mb-2">Trouve tes produits</h3>
              <p className="text-sm text-forest/60 leading-relaxed">
                Supermarch&eacute;s, &eacute;piceries, march&eacute;s bio &mdash; les meilleures adresses pour faire tes courses.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-sage/15 ring-1 ring-sage/25 flex items-center justify-center mb-5">
                <span className="text-xl font-black text-sage-dark">3</span>
              </div>
              <h3 className="font-semibold text-forest text-base mb-2">Partage tes bons plans</h3>
              <p className="text-sm text-forest/60 leading-relaxed">
                Sugg&egrave;re de nouveaux lieux pour aider la communaut&eacute; &agrave; voyager vegan.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
