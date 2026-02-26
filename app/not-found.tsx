import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl mb-4">🌿</p>
      <h1 className="text-3xl font-bold text-forest mb-2">Page introuvable</h1>
      <p className="text-forest/60 max-w-md">
        Cette page n&apos;existe pas ou a été déplacée. Retourne explorer les villes vegan-friendly !
      </p>
      <Link
        href="/"
        className="mt-6 inline-block bg-sage text-white px-6 py-3 rounded-full hover:bg-sage-dark transition-colors font-medium"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
