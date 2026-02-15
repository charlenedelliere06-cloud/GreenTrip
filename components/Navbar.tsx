"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const { user, loading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu au clic extérieur
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
    <nav className="bg-white/80 backdrop-blur-sm border-b border-beige-dark sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-forest">
          Green<span className="text-sage">Trip</span>
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className="hidden sm:block hover:text-sage-dark transition-colors">
            Explorer
          </Link>

          {loading ? (
            <div className="w-8 h-8 rounded-full bg-beige animate-pulse" />
          ) : user ? (
            <>
              <Link
                href="/contribute"
                className="bg-sage text-white px-4 py-2 rounded-full hover:bg-sage-dark transition-colors"
              >
                + Ajouter un lieu
              </Link>

              {/* Menu utilisateur */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="w-9 h-9 rounded-full bg-sage text-white flex items-center justify-center font-semibold text-sm hover:bg-sage-dark transition-colors"
                >
                  {initial}
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-beige-dark overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-beige-dark">
                      <p className="font-medium text-forest text-sm">
                        {displayName}
                      </p>
                      <p className="text-xs text-forest/50 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-forest hover:bg-beige/50 transition-colors"
                    >
                      Mon profil
                    </Link>
                    <Link
                      href="/contribute"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-forest hover:bg-beige/50 transition-colors"
                    >
                      Suggérer un lieu
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hover:text-sage-dark transition-colors"
              >
                Se connecter
              </Link>
              <Link
                href="/login?redirect=/contribute"
                className="bg-sage text-white px-4 py-2 rounded-full hover:bg-sage-dark transition-colors"
              >
                Contribuer
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
