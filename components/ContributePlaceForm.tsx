"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { cities } from "@/lib/mock-data";
import { PhotoUpload } from "./PhotoUpload";
import { LocationPicker } from "./LocationPicker";

interface ContributePlaceFormProps {
  userId: string;
}

const placeTypes = [
  { value: "supermarket", label: "Supermarché", icon: "\uD83D\uDED2" },
  { value: "store", label: "Épicerie bio", icon: "\uD83C\uDF3F" },
  { value: "restaurant", label: "Restaurant", icon: "\uD83C\uDF7D\uFE0F" },
  { value: "cafe", label: "Café", icon: "\u2615" },
];

export function ContributePlaceForm({ userId }: ContributePlaceFormProps) {
  const searchParams = useSearchParams();
  const initialLat = searchParams.get("lat") ? parseFloat(searchParams.get("lat")!) : null;
  const initialLng = searchParams.get("lng") ? parseFloat(searchParams.get("lng")!) : null;

  const [cityId, setCityId] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("supermarket");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState<number | null>(initialLat);
  const [lng, setLng] = useState<number | null>(initialLng);
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const selectedCity = cities.find((c) => c.id === cityId);

  const handleLocationChange = (newLat: number, newLng: number) => {
    setLat(newLat);
    setLng(newLng);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!cityId) {
      setError("Sélectionne une ville.");
      return;
    }

    setLoading(true);

    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const photoUrls: string[] = [];

      const body = {
        user_id: userId,
        type: "place" as const,
        city_id: cityId,
        place_name: name,
        place_type: type,
        place_address: address,
        place_description: description,
        place_lat: lat,
        place_lng: lng,
        place_google_maps_url: googleMapsUrl || undefined,
        place_tags: tags,
        place_photos: photoUrls,
        status: "pending" as const,
      };

      const res = await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Erreur lors de l'envoi");

      setSuccess(true);
    } catch {
      setError("Une erreur est survenue. Réessaie plus tard.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm text-center mt-6">
        <div className="text-4xl mb-4">🎉</div>
        <h2 className="text-xl font-bold text-forest">Merci pour ta contribution !</h2>
        <p className="text-forest/60 mt-2">
          Ton lieu sera vérifié par notre équipe avant d'être publié.
        </p>
        <button
          onClick={() => {
            setSuccess(false);
            setName("");
            setAddress("");
            setDescription("");
            setLat(null);
            setLng(null);
            setGoogleMapsUrl("");
            setTagsInput("");
            setPhotos([]);
            setCityId("");
          }}
          className="mt-6 bg-sage text-white px-6 py-2.5 rounded-xl font-medium hover:bg-sage-dark transition-colors"
        >
          Ajouter un autre lieu
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm mt-6 space-y-5">
      {/* Ville */}
      <div>
        <label className="block text-sm font-medium text-forest mb-1">
          Ville *
        </label>
        <select
          value={cityId}
          onChange={(e) => setCityId(e.target.value)}
          required
          className="w-full px-4 py-2.5 rounded-xl border border-beige-dark bg-offwhite text-forest focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
        >
          <option value="">Sélectionner une ville</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.country})
            </option>
          ))}
        </select>
      </div>

      {/* Nom */}
      <div>
        <label className="block text-sm font-medium text-forest mb-1">
          Nom du lieu *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2.5 rounded-xl border border-beige-dark bg-offwhite text-forest focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
          placeholder="Ex: Bio Market Ubud"
        />
      </div>

      {/* Type */}
      <div>
        <label className="block text-sm font-medium text-forest mb-2">
          Type de lieu *
        </label>
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

      {/* Localisation sur la carte */}
      <div>
        <label className="block text-sm font-medium text-forest mb-2">
          Localisation
        </label>
        <p className="text-xs text-forest/50 mb-2">
          Place le lieu sur la carte avec ta position GPS ou en cliquant directement dessus.
        </p>
        <LocationPicker
          lat={lat}
          lng={lng}
          onLocationChange={handleLocationChange}
          center={selectedCity ? [selectedCity.lat, selectedCity.lng] : undefined}
        />
      </div>

      {/* Adresse */}
      <div>
        <label className="block text-sm font-medium text-forest mb-1">
          Adresse
          <span className="text-forest/40 font-normal ml-1">(optionnel si placé sur la carte)</span>
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-beige-dark bg-offwhite text-forest focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
          placeholder="Ex: Jl. Raya Ubud No.35, Ubud"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-forest mb-1">
          Description *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          maxLength={500}
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-beige-dark bg-offwhite text-forest focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage resize-none"
          placeholder="Décris ce lieu : ce qu'on y trouve, pourquoi c'est bien pour les vegans..."
        />
        <p className="text-xs text-forest/40 text-right mt-1">
          {description.length}/500
        </p>
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
          placeholder="bio, vegan, vrac, local"
        />
      </div>

      {/* Photos */}
      <div>
        <label className="block text-sm font-medium text-forest mb-2">
          Photos
          <span className="text-forest/40 font-normal ml-1">(max 10)</span>
        </label>
        <PhotoUpload
          photos={photos}
          onPhotosChange={setPhotos}
          maxPhotos={10}
        />
      </div>

      {/* Erreur */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-sage text-white py-3 rounded-xl font-medium hover:bg-sage-dark transition-colors disabled:opacity-50"
      >
        {loading ? "Envoi en cours..." : "Soumettre le lieu"}
      </button>

      <p className="text-xs text-forest/40 text-center">
        Ta contribution sera vérifiée avant publication.
      </p>
    </form>
  );
}
