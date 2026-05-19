import { SearchBar } from "@/components/SearchBar"
import { GeolocateButton } from "@/components/GeolocateButton"

export function HeroSection() {
  return (
    <section className="bg-white px-6 pt-14 pb-16">
      <div className="max-w-xl mx-auto text-center">

        <h1
          className="text-4xl sm:text-5xl font-bold text-stone leading-tight mb-3 text-balance"
          style={{ animation: "fade-up 0.6s ease-out both", animationDelay: "0ms" }}
        >
          Voyagez <span className="text-sage-dark">vegan</span>, partout dans le monde
        </h1>

        <p
          className="text-sm text-stone-muted mb-8"
          style={{ animation: "fade-up 0.6s ease-out both", animationDelay: "100ms" }}
        >
          Supermarch&eacute;s, &eacute;piceries et march&eacute;s bio pr&egrave;s de ta destination.
        </p>

        <div
          style={{ animation: "fade-up 0.6s ease-out both", animationDelay: "200ms" }}
        >
          <SearchBar />
          <GeolocateButton />
        </div>

      </div>
    </section>
  )
}
