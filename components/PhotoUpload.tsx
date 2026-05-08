"use client";

import { useRef, useState } from "react";

interface PhotoUploadProps {
  photos: File[];
  onPhotosChange: (photos: File[]) => void;
  maxPhotos?: number;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function PhotoUpload({
  photos,
  onPhotosChange,
  maxPhotos = 10,
}: PhotoUploadProps) {
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: FileList | File[]) => {
    setError("");
    const validFiles: File[] = [];

    for (const file of Array.from(files)) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError("Format non supporté. Utilise JPG, PNG ou WebP.");
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError("Fichier trop lourd (max 10MB).");
        continue;
      }
      validFiles.push(file);
    }

    const remaining = maxPhotos - photos.length;
    if (validFiles.length > remaining) {
      setError(`Tu peux ajouter encore ${remaining} photo${remaining > 1 ? "s" : ""}.`);
    }

    const toAdd = validFiles.slice(0, remaining);
    if (toAdd.length > 0) {
      onPhotosChange([...photos, ...toAdd]);
    }
  };

  const removePhoto = (index: number) => {
    onPhotosChange(photos.filter((_, i) => i !== index));
    setError("");
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) addFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <div className="flex gap-2 flex-wrap">
        {/* Vignettes des photos sélectionnées */}
        {photos.map((file, index) => (
          <div key={index} className="relative group w-24 h-24 rounded-xl overflow-hidden shrink-0">
            <img
              src={URL.createObjectURL(file)}
              alt={`Photo ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removePhoto(index)}
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span className="text-white text-xl">✕</span>
            </button>
          </div>
        ))}

        {/* Bouton ajouter (masqué si max atteint) */}
        {photos.length < maxPhotos && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-24 h-24 rounded-xl border-2 border-dashed border-beige-dark bg-beige/30 hover:border-sage/50 hover:bg-sage/5 transition-colors flex flex-col items-center justify-center gap-1 shrink-0"
          >
            <span className="text-2xl">📷</span>
            <span className="text-xs text-forest/40">Ajouter</span>
          </button>
        )}
      </div>

      {/* Compteur */}
      <p className="text-xs text-forest/40 mt-2">
        {photos.length}/{maxPhotos} photos
      </p>

      {/* Erreur */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mt-2">
          {error}
        </p>
      )}
    </div>
  );
}
