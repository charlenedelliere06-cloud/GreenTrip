"use client";

import { useState, useRef } from "react";

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
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFiles = (files: FileList | File[]): File[] => {
    const validFiles: File[] = [];
    const fileArray = Array.from(files);

    for (const file of fileArray) {
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

    return validFiles;
  };

  const addFiles = (files: FileList | File[]) => {
    setError("");
    const valid = validateFiles(files);
    const remaining = maxPhotos - photos.length;

    if (valid.length > remaining) {
      setError(`Tu peux ajouter encore ${remaining} photo${remaining > 1 ? "s" : ""}.`);
    }

    const toAdd = valid.slice(0, remaining);
    if (toAdd.length > 0) {
      onPhotosChange([...photos, ...toAdd]);
    }
  };

  const removePhoto = (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    onPhotosChange(updated);
    setError("");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  return (
    <div>
      {/* Zone de drop */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          dragOver
            ? "border-sage bg-sage/5"
            : "border-beige-dark hover:border-sage/50 hover:bg-beige/30"
        } ${photos.length >= maxPhotos ? "opacity-50 pointer-events-none" : ""}`}
      >
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
        <div className="text-3xl mb-2">📸</div>
        <p className="text-sm text-forest/60">
          <span className="text-sage-dark font-medium">Clique</span> ou glisse
          tes photos ici
        </p>
        <p className="text-xs text-forest/40 mt-1">
          JPG, PNG ou WebP — Max 10MB par photo
        </p>
      </div>

      {/* Compteur */}
      <p className="text-xs text-forest/40 mt-2 text-right">
        {photos.length}/{maxPhotos} photos
      </p>

      {/* Erreur */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mt-2">
          {error}
        </p>
      )}

      {/* Previews */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-3">
          {photos.map((file, index) => (
            <div key={index} className="relative group rounded-lg overflow-hidden">
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${index + 1}`}
                className="w-full h-20 object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removePhoto(index);
                }}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
