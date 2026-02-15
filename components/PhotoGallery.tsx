"use client";

import { useState } from "react";

interface PhotoGalleryProps {
  photos: string[];
  placeName: string;
}

export function PhotoGallery({ photos, placeName }: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (photos.length === 0) {
    return (
      <div className="bg-beige/50 rounded-xl p-8 text-center">
        <div className="text-3xl mb-2">📷</div>
        <p className="text-forest/40 text-sm">
          Pas encore de photos pour ce lieu.
        </p>
        <p className="text-forest/30 text-xs mt-1">
          Connecte-toi pour en ajouter !
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Grille de photos */}
      <div
        className={`grid gap-2 rounded-xl overflow-hidden ${
          photos.length === 1
            ? "grid-cols-1"
            : photos.length === 2
              ? "grid-cols-2"
              : photos.length === 3
                ? "grid-cols-2"
                : "grid-cols-2 md:grid-cols-3"
        }`}
      >
        {photos.map((photo, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`relative overflow-hidden group ${
              photos.length === 3 && index === 0 ? "row-span-2" : ""
            }`}
          >
            <img
              src={photo}
              alt={`${placeName} - Photo ${index + 1}`}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-forest/0 group-hover:bg-forest/10 transition-colors" />
          </button>
        ))}
      </div>

      <p className="text-xs text-forest/40 mt-2">
        {photos.length} photo{photos.length > 1 ? "s" : ""} — Cliquer pour agrandir
      </p>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Fermer */}
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl z-10"
          >
            ✕
          </button>

          {/* Flèche gauche */}
          {selectedIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(selectedIndex - 1);
              }}
              className="absolute left-4 text-white/80 hover:text-white text-4xl z-10"
            >
              ‹
            </button>
          )}

          {/* Image */}
          <img
            src={photos[selectedIndex]}
            alt={`${placeName} - Photo ${selectedIndex + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Flèche droite */}
          {selectedIndex < photos.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(selectedIndex + 1);
              }}
              className="absolute right-4 text-white/80 hover:text-white text-4xl z-10"
            >
              ›
            </button>
          )}

          {/* Compteur */}
          <div className="absolute bottom-4 text-white/60 text-sm">
            {selectedIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  );
}
