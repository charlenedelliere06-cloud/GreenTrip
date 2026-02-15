"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Contribution } from "@/lib/types";

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [contributions, setContributions] = useState<Contribution[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/profile");
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Charger les contributions de l'utilisateur
    fetch("/api/contributions")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const mine = data.filter(
            (c: Contribution) => c.user_id === user?.id
          );
          setContributions(mine);
        }
      })
      .catch(() => {});
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
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

  const statusLabels: Record<string, { label: string; color: string }> = {
    pending: { label: "En attente", color: "bg-amber-50 text-amber-700" },
    approved: { label: "Approuvé", color: "bg-emerald-50 text-emerald-700" },
    rejected: { label: "Rejeté", color: "bg-red-50 text-red-700" },
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Profil */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-sage text-white flex items-center justify-center text-2xl font-bold">
            {initial}
          </div>
          <div>
            <h1 className="text-xl font-bold text-forest">{displayName}</h1>
            <p className="text-sm text-forest/50">{user.email}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-6 border-t border-beige-dark">
          <button
            onClick={() => router.push("/contribute")}
            className="bg-sage text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-sage-dark transition-colors"
          >
            + Ajouter un lieu
          </button>
          <button
            onClick={async () => {
              await signOut();
              router.push("/");
            }}
            className="bg-red-50 text-red-600 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
          >
            Se déconnecter
          </button>
        </div>
      </div>

      {/* Contributions */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-forest mb-4">
          Mes contributions ({contributions.length})
        </h2>

        {contributions.length === 0 ? (
          <div className="bg-white rounded-xl p-8 shadow-sm text-center">
            <div className="text-3xl mb-2">📝</div>
            <p className="text-forest/50">
              Tu n'as pas encore ajouté de lieu.
            </p>
            <button
              onClick={() => router.push("/contribute")}
              className="mt-4 text-sage-dark font-medium text-sm hover:underline"
            >
              Ajouter ton premier lieu →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {contributions.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between"
              >
                <div>
                  <h3 className="font-medium text-forest">
                    {c.place_name || "Contribution"}
                  </h3>
                  <p className="text-xs text-forest/50 mt-0.5">
                    {c.created_at &&
                      new Date(c.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusLabels[c.status]?.color || ""}`}
                >
                  {statusLabels[c.status]?.label || c.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
