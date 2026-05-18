import { SearchBar } from "@/components/SearchBar"
import { GeolocateButton } from "@/components/GeolocateButton"

export function HeroSection() {
  return (
    <section className="min-h-[85vh] bg-cream flex flex-col items-center justify-center px-6 py-24">
      <div className="max-w-2xl w-full text-center space-y-8">

        <p
          className="text-xs tracking-[0.25em] uppercase text-stone-muted font-medium"
          style={{ animation: "fade-up 0.7s ease-out both", animationDelay: "0ms" }}
        >
          Le guide vegan du voyageur
        </p>

        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-light text-stone leading-[1.1] tracking-tight"
          style={{ animation: "fade-up 0.7s ease-out both", animationDelay: "120ms" }}
        >
          Voyagez{" "}
          <em className="font-serif italic text-sage-dark">vegan</em>
          , partout dans le monde
        </h1>

        <p
          className="text-base sm:text-lg text-stone-muted font-light max-w-md mx-auto leading-relaxed"
          style={{ animation: "fade-up 0.7s ease-out both", animationDelay: "240ms" }}
        >
          Supermarch&eacute;s, &eacute;piceries et bons plans pour tes voyages vegan.
        </p>

        <div
          className="pt-4"
          style={{ animation: "fade-up 0.7s ease-out both", animationDelay: "360ms" }}
        >
          <SearchBar />
          <GeolocateButton />
        </div>

      </div>
    </section>
  )
}
