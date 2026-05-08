"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { uploadPlacePhoto } from "@/lib/storage";
import { Review } from "@/lib/types";

interface ReviewSectionProps {
  placeId: string;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const months = Math.floor(days / 30);

  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  if (hours < 24) return `il y a ${hours}h`;
  if (days < 30) return `il y a ${days} jour${days > 1 ? "s" : ""}`;
  return `il y a ${months} mois`;
}

export function ReviewSection({ placeId }: ReviewSectionProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`/api/reviews?place_id=${placeId}`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setReviews(data); })
      .finally(() => setLoading(false));
  }, [placeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    setError("");

    try {
      // Upload photos
      const uploadedUrls: string[] = [];
      for (const photo of photos) {
        const url = await uploadPlacePhoto(photo, `review-${placeId}`);
        uploadedUrls.push(url);
      }

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ place_id: placeId, content, photos: uploadedUrls }),
      });

      if (!res.ok) throw new Error();
      const { review } = await res.json();

      setReviews((prev) => [review, ...prev]);
      setContent("");
      setPhotos([]);
    } catch {
      setError("Une erreur est survenue. Réessaie.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-forest mb-5 flex items-center gap-2">
        💬 Avis de la communauté
        {reviews.length > 0 && (
          <span className="text-sm font-normal text-forest/40">({reviews.length})</span>
        )}
      </h2>

      {/* Formulaire */}
      {user ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 shadow-sm mb-6">
          <p className="text-sm font-medium text-forest mb-3">Partage ta visite</p>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            maxLength={1000}
            placeholder="Nouveautés, produits trouvés, conseils pratiques..."
            className="w-full px-4 py-3 rounded-xl border border-beige-dark bg-offwhite text-forest text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage resize-none"
          />
          <p className="text-xs text-forest/30 text-right mt-1 mb-3">{content.length}/1000</p>

          {/* Photos */}
          <div className="mb-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-sage-dark hover:text-sage font-medium flex items-center gap-1.5 transition-colors"
            >
              📸 Ajouter des photos
              {photos.length > 0 && <span className="text-forest/40">({photos.length})</span>}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              multiple
              className="hidden"
              onChange={(e) => {
                if (!e.target.files) return;
                const arr = Array.from(e.target.files).filter((f) => f.size <= 10 * 1024 * 1024);
                setPhotos((prev) => [...prev, ...arr]);
                e.target.value = "";
              }}
            />
            {photos.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {photos.map((f, i) => (
                  <div key={i} className="relative group">
                    <img src={URL.createObjectURL(f)} alt="" className="w-16 h-16 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => setPhotos((prev) => prev.filter((_, j) => j !== i))}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="bg-sage text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-sage-dark transition-colors disabled:opacity-50"
          >
            {submitting ? "Envoi en cours..." : "Publier l'avis"}
          </button>
        </form>
      ) : (
        <div className="bg-beige/50 rounded-2xl p-5 text-center mb-6">
          <p className="text-forest/60 text-sm">
            <a href="/login" className="text-sage-dark font-medium hover:underline">Connecte-toi</a>
            {" "}pour laisser un avis et partager tes photos 🌿
          </p>
        </div>
      )}

      {/* Liste des avis */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => <div key={i} className="h-24 bg-beige rounded-2xl animate-pulse" />)}
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
          <p className="text-3xl mb-2">🌱</p>
          <p className="text-forest/60 text-sm">Sois le premier à partager ta visite !</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center text-sm">🌿</div>
                  <span className="text-sm font-medium text-forest">Visiteur</span>
                </div>
                <span className="text-xs text-forest/40">{timeAgo(review.created_at)}</span>
              </div>

              <p className="text-forest/80 text-sm leading-relaxed">{review.content}</p>

              {review.photos && review.photos.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {review.photos.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setLightbox(url)}
                      className="rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                    >
                      <img src={url} alt="" className="w-20 h-20 object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl">✕</button>
          <img src={lightbox} alt="" className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
