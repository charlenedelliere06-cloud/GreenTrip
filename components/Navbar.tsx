import Link from "next/link";

export function Navbar() {
  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-beige-dark sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-forest">
          Green<span className="text-sage">Trip</span>
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/" className="hover:text-sage-dark transition-colors">
            Explorer
          </Link>
          <Link
            href="/contribute"
            className="bg-sage text-white px-4 py-2 rounded-full hover:bg-sage-dark transition-colors"
          >
            Contribuer
          </Link>
        </div>
      </div>
    </nav>
  );
}
