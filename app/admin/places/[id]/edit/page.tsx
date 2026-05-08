"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { uploadPlacePhoto } from "@/lib/storage";

const placeTypes = [
  { value: "supermarket", label: "Supermarché", icon: "🛒" },
  { value: "store", label: "Épicerie bio", icon: "🌿" },
];

export default function EditPlacePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [type, setType] = useState("supermarket");
  const [priceRange, setPriceRange] = useState<number | null>(null);
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`/api/places?id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        // On charge via getPlaceById
        setName(data.name || "");
        setType(data.type || "supermarket");
        setPriceRange(data.price_range || null);
        setAddress(data.address || "");
        setDescription(data.description || "");
        setGoogleMapsUrl(data.google_maps_url || "");
        setTagsInput((data.tags || []).join(", "));
        setExistingPhotos(data.photos || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Impossible de charger le lieu.");
        setLoading(false);
      });
  }, [id]);

  const removeExistingPhoto = (index: number) => {
    setExistingPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNewPhotos = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).filter((f) => f.size <= 10 * 1024 * 1024);
    setNewPhotos((prev) => [...prev, ...arr]);
  };

  const removeNewPhoto = (index: number) => {
    setNewPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      // Upload des nouvelles photos
      let uploadedUrls: string[] = [];
      if (newPhotos.length > 0) {
        setUploadingPhotos(true);
        for (const photo of newPhotos) {
          const url = await uploadPlacePhoto(photo, `place-${id}`);
          uploadedUrls.push(url);
        }
        setUploadingPhotos(false);
      }

      const allPhotos = [...existingPhotos, ...uploadedUrls];
      const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);

      const res = await fetch(`/api/places/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type,
          price_range: priceRange,
          address,
          description,
          google_maps_url: googleMapsUrl,
          tags,
          photos: allPhotos,
        }),
      });

      if (!res.ok) throw new Error("Erreur lors de la sauvegarde");

      setSuccess(true);
      setNewPhotos([]);
      setExistingPhotos(allPhotos);
    } catch {
      setError("Une erreur est survenue. Réessaie.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-beige rounded-lg w-1/2" />
          <div className="h-64 bg-beige rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <button
        onClick={() => router.push("/admin")}
        className="text-sm text-forest/50 hover:text-forest mb-6 flex items-center gap-1"
      >
        ← Retour à l&apos;admin
      </button>

      <h1 className="text-2xl font-bold text-forest mb-1">Modifier le lieu</h1>
      <p className="text-forest/50 text-sm mb-6">{name}</p>

      {success && (
        <div className="mb-6 bg-sage/10 border border-sage/30 text-sage-dark rounded-xl px-4 py-3 text-sm font-medium">
          ✅ Modifications enregistrées !
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
        {/* Nom */}
        <div>
          <label className="block text-sm font-medium text-forest mb-1">Nom du lieu</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-beige-dark bg-offwhite text-forest focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-forest mb-2">Type</label>
          <div className="grid grid-cols-2 gap-2">
            {placeTypes.map((pt) => (
              <button
                key={pt.value}
                type="button"
                onClick={() => setType(pt.value)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  type === pt.value
                    ? "bg-sage text-white border-sage"
                    : "bg-offwhite text-forest/70 border-beige-dark hover:border-sage/50"
                }`}
              >
                <span>{pt.icon}</span>
                <span>{pt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Gamme de prix */}
        <div>
          <label className="block text-sm font-medium text-forest mb-2">Gamme de prix</label>
          <div className="flex gap-2">
            {[
              { value: 1, label: "€", desc: "Pas cher" },
              { value: 2, label: "€€", desc: "Moyen" },
              { value: 3, label: "€€€", desc: "Cher" },
            ].map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPriceRange(priceRange === p.value ? null : p.value)}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all flex flex-col items-center gap-0.5 ${
                  priceRange === p.value
                    ? "bg-sage text-white border-sage shadow-sm"
                    : "bg-offwhite text-forest/70 border-beige-dark hover:border-sage/50"
                }`}
              >
                <span className="font-bold">{p.label}</span>
                <span className="text-xs opacity-70">{p.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Adresse */}
        <div>
          <label className="block text-sm font-medium text-forest mb-1">Adresse</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-beige-dark bg-offwhite text-forest focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-forest mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            maxLength={500}
            className="w-full px-4 py-2.5 rounded-xl border border-beige-dark bg-offwhite text-forest focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage resize-none"
          />
          <p className="text-xs text-forest/40 text-right mt-1">{description.length}/500</p>
        </div>

        {/* Google Maps URL */}
        <div>
          <label className="block text-sm font-medium text-forest mb-1">
            Lien Google Maps
            <span className="text-forest/40 font-normal ml-1">(optionnel)</span>
          </label>
          <input
            type="url"
            value={googleMapsUrl}
            onChange={(e) => setGoogleMapsUrl(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-beige-dark bg-offwhite text-forest focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
            placeholder="https://maps.google.com/..."
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-forest mb-1">
            Tags
            <span className="text-forest/40 font-normal ml-1">(séparés par des virgules)</span>
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-beige-dark bg-offwhite text-forest focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
            placeholder="bio, vegan, vrac..."
          />
        </div>

        {/* Photos existantes */}
        <div>
          <label className="block text-sm font-medium text-forest mb-2">
            Photos actuelles
            <span className="text-forest/40 font-normal ml-1">({existingPhotos.length})</span>
          </label>
          {existingPhotos.length === 0 ? (
            <p className="text-sm text-forest/40">Aucune photo pour l&apos;instant.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {existingPhotos.map((url, i) => (
                <div key={i} className="relative group rounded-lg overflow-hidden">
                  <img src={url} alt="" className="w-full h-24 object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingPhoto(i)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ajouter de nouvelles photos */}
        <div>
          <label className="block text-sm font-medium text-forest mb-2">Ajouter des photos</label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-beige-dark rounded-xl p-5 text-center cursor-pointer hover:border-sage/50 hover:bg-beige/20 transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              multiple
              className="hidden"
              onChange={(e) => handleNewPhotos(e.target.files)}
            />
            <p className="text-2xl mb-1">📸</p>
            <p className="text-sm text-forest/60">
              <span className="text-sage-dark font-medium">Clique</span> pour ajouter des photos
            </p>
            <p className="text-xs text-forest/40 mt-1">JPG, PNG ou WebP — Max 10MB</p>
          </div>

          {newPhotos.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {newPhotos.map((file, i) => (
                <div key={i} className="relative group rounded-lg overflow-hidden">
                  <img src={URL.createObjectURL(file)} alt="" className="w-full h-24 object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewPhoto(i)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                  <div className="absolute bottom-0 inset-x-0 bg-sage/80 text-white text-xs text-center py-0.5">
                    À uploader
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-sage text-white py-3.5 rounded-xl font-semibold hover:bg-sage-dark transition-colors disabled:opacity-50"
        >
          {saving
            ? uploadingPhotos
              ? "Upload des photos en cours..."
              : "Enregistrement..."
            : "Enregistrer les modifications"}
        </button>
      </form>
    </div>
  );
}
