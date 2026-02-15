"use client";

import { useEffect, useState } from "react";
import { Contribution } from "@/lib/types";
import { cities } from "@/lib/mock-data";

export default function AdminPage() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("pending");

  useEffect(() => {
    fetch("/api/contributions")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setContributions(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all"
    ? contributions
    : contributions.filter((c) => c.status === filter);

  const getCityName = (cityId: string) => {
    return cities.find((c) => c.id === cityId)?.name || cityId;
  };

  const typeLabels: Record<string, string> = {
    supermarket: "🛒 Supermarché",
    store: "🌿 Épicerie bio",
    restaurant: "🍽️ Restaurant",
    cafe: "☕ Café",
  };

  const statusColors: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700",
    approved: "bg-emerald-50 text-emerald-700",
    rejected: "bg-red-50 text-red-700",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-forest">Administration</h1>
      <p className="text-forest/60 mt-1">Modération des contributions</p>

      {/* Filtres */}
      <div className="flex gap-2 mt-6">
        {[
          { value: "pending", label: "En attente" },
          { value: "approved", label: "Approuvées" },
          { value: "rejected", label: "Rejetées" },
          { value: "all", label: "Toutes" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === f.value
                ? "bg-sage text-white"
                : "bg-white text-forest/70 border border-beige-dark hover:bg-beige/50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Liste */}
      {loading ? (
        <div className="mt-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-beige rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-8 bg-white rounded-xl p-8 shadow-sm text-center">
          <p className="text-forest/50">Aucune contribution {filter !== "all" ? "avec ce statut" : ""}.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {filtered.map((c) => (
            <div key={c.id} className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-forest">
                      {c.place_name || "Sans nom"}
                    </h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[c.status]}`}>
                      {c.status}
                    </span>
                  </div>
                  <p className="text-sm text-forest/60 mt-1">
                    {typeLabels[c.place_type || ""] || c.place_type} · {getCityName(c.city_id)} · {c.place_address}
                  </p>
                  <p className="text-sm text-forest/80 mt-2">
                    {c.place_description}
                  </p>
                  {c.place_tags && c.place_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {c.place_tags.map((tag) => (
                        <span key={tag} className="text-xs bg-beige text-forest/70 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {c.place_photos && c.place_photos.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {c.place_photos.map((photo, i) => (
                        <img key={i} src={photo} alt="" className="w-16 h-16 rounded-lg object-cover" />
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-forest/40 mt-2">
                    Par {c.user_display_name || c.user_id} · {c.created_at && new Date(c.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>

                {/* Actions */}
                {c.status === "pending" && (
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setContributions((prev) =>
                          prev.map((item) =>
                            item.id === c.id ? { ...item, status: "approved" } : item
                          )
                        );
                      }}
                      className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
                    >
                      ✓ Approuver
                    </button>
                    <button
                      onClick={() => {
                        setContributions((prev) =>
                          prev.map((item) =>
                            item.id === c.id ? { ...item, status: "rejected" } : item
                          )
                        );
                      }}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                    >
                      ✕ Rejeter
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-forest">
            {contributions.filter((c) => c.status === "pending").length}
          </p>
          <p className="text-xs text-forest/50 mt-1">En attente</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-emerald-600">
            {contributions.filter((c) => c.status === "approved").length}
          </p>
          <p className="text-xs text-forest/50 mt-1">Approuvées</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-red-500">
            {contributions.filter((c) => c.status === "rejected").length}
          </p>
          <p className="text-xs text-forest/50 mt-1">Rejetées</p>
        </div>
      </div>
    </div>
  );
}
