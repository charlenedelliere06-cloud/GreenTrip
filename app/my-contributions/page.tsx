"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

interface MyContribution {
  id: string;
  place_name: string;
  place_type: string;
  city_name: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
  pending: { label: "En attente", color: "bg-amber-50 text-amber-700", icon: "⏳" },
  approved: { label: "Approuvé", color: "bg-sage/15 text-sage-dark", icon: "✓" },
  rejected: { label: "Refusé", color: "bg-red-50 text-red-600", icon: "✕" },
};

const typeLabels: Record<string, string> = {
  supermarket: "🛒 Grande surface",
  store: "🌿 Épicerie",
};

export default function MyContributionsPage() {
  const { user, loading: authLoading } = useAuth();
  const [contributions, setContributions] = useState<MyContribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    fetch("/api/my-contributions")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setContributions(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="h-8 w-48 bg-beige rounded-lg animate-pulse mb-6" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-beige rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-3xl mb-3">🔒</p>
        <h1 className="text-xl font-bold text-stone">Connecte-toi</h1>
        <p className="text-stone-muted mt-2">
          Tu dois être connecté pour voir tes contributions.
        </p>
        <Link
          href="/login?redirect=/my-contributions"
          className="inline-block mt-4 px-6 py-2 bg-sage text-white rounded-full hover:bg-sage-dark transition-colors"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-stone">Mes contributions</h1>
      <p className="text-stone-muted mt-1">
        Suis le statut de tes suggestions de lieux.
      </p>

      {contributions.length === 0 ? (
        <div className="mt-8 bg-white rounded-xl p-8 shadow-sm text-center">
          <p className="text-3xl mb-3">🌱</p>
          <p className="text-stone font-medium">Aucune contribution pour le moment</p>
          <p className="text-stone-muted mt-2 text-sm">
            Partage tes bonnes adresses vegan avec la communauté !
          </p>
          <Link
            href="/contribute"
            className="inline-block mt-4 px-6 py-2 bg-sage text-white rounded-full hover:bg-sage-dark transition-colors"
          >
            Ajouter un lieu
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {contributions.map((c) => {
            const config = statusConfig[c.status];
            return (
              <div key={c.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-stone truncate">
                      {c.place_name}
                    </h3>
                    <p className="text-sm text-stone-muted mt-0.5">
                      {typeLabels[c.place_type] || c.place_type}
                      {c.city_name && ` · ${c.city_name}`}
                    </p>
                    <p className="text-xs text-stone-muted mt-1">
                      {new Date(c.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <span className={`shrink-0 text-xs font-medium px-3 py-1 rounded-full ${config.color}`}>
                    {config.icon} {config.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
