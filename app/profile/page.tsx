"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/profile");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-20 w-20 bg-beige rounded-full" />
          <div className="h-6 bg-beige rounded-lg w-1/3" />
          <div className="h-4 bg-beige rounded-lg w-1/2" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  const displayName =
    user.user_metadata?.display_name ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "User";

  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-4">
      {/* Carte profil */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-sage text-white flex items-center justify-center text-2xl font-bold shrink-0">
            {initial}
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-forest">{displayName}</h1>
            <p className="text-sm text-forest/50 truncate">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-2xl p-4 shadow-sm space-y-1">
        <Link
          href="/contribute"
          className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-beige/50 transition-colors text-sm text-forest"
        >
          <span className="text-lg">🌿</span>
          <span className="font-medium">Ajouter un lieu</span>
        </Link>
        <Link
          href="/my-contributions"
          className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-beige/50 transition-colors text-sm text-forest"
        >
          <span className="text-lg">📋</span>
          <span className="font-medium">Mes contributions</span>
          <span className="ml-auto text-forest/40 text-xs">Voir le statut →</span>
        </Link>
      </div>

      {/* Déconnexion */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <button
          onClick={async () => {
            await signOut();
            router.push("/");
          }}
          className="w-full text-left flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-50 transition-colors text-sm text-red-600"
        >
          <span className="text-lg">🚪</span>
          <span className="font-medium">Se déconnecter</span>
        </button>
      </div>
    </div>
  );
}
