"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const { user, loading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName =
    user?.user_metadata?.display_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4">
      <nav className="max-w-5xl mx-auto bg-white/70 backdrop-blur-md rounded-full shadow-sm ring-1 ring-black/5 px-5 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-base font-bold text-forest tracking-tight">
          Green<span className="text-sage">Trip</span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3 text-sm">
          <Link
            href="/"
            className={`transition-colors hidden sm:block text-sm ${
              pathname === "/"
                ? "text-forest font-semibold"
                : "text-forest/50 hover:text-forest"
            }`}
          >
            Explorer
          </Link>

          {loading ? (
            <div className="w-7 h-7 rounded-full bg-beige animate-pulse" />
          ) : user ? (
            <>
              <Link
                href="/contribute"
                className="bg-sage text-white text-xs px-4 py-2 rounded-full hover:bg-sage-dark transition-colors font-medium"
              >
                + Ajouter
              </Link>

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="w-8 h-8 rounded-full bg-sage/20 text-forest flex items-center justify-center font-semibold text-xs hover:bg-sage/30 transition-colors"
                >
                  {initial}
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-3 w-52 bg-white rounded-2xl shadow-lg ring-1 ring-black/5 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-beige">
                      <p className="font-medium text-forest text-sm">{displayName}</p>
                      <p className="text-xs text-forest/40 truncate">{user.email}</p>
                    </div>
                    <Link href="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-forest/70 hover:text-forest hover:bg-beige/40 transition-colors">
                      Mon profil
                    </Link>
                    <Link href="/my-contributions" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-forest/70 hover:text-forest hover:bg-beige/40 transition-colors">
                      Mes contributions
                    </Link>
                    <Link href="/contribute" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-forest/70 hover:text-forest hover:bg-beige/40 transition-colors">
                      Suggérer un lieu
                    </Link>
                    <button
                      onClick={() => { signOut(); setMenuOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="text-forest/50 hover:text-forest transition-colors">
                Se connecter
              </Link>
              <Link
                href="/login?redirect=/contribute"
                className="bg-sage text-white text-xs px-4 py-2 rounded-full hover:bg-sage-dark transition-colors font-medium"
              >
                Contribuer
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
