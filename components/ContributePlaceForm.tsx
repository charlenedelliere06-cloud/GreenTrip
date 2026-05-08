"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { City } from "@/lib/types";
import { getCitiesClient } from "@/lib/supabase-client-queries";
import { PhotoUpload } from "./PhotoUpload";
import { LocationPicker, ResolvedAddress } from "./LocationPicker";
import { AddressAutocomplete } from "./AddressAutocomplete";
import { uploadPlacePhoto } from "@/lib/storage";

/* ─── Mini composant : Ville avec Google Places ─── */
function CityAutocompleteInput({
  value,
  onChange,
  onCitySelected,
  autoFilled,
}: {
  value: string;
  onChange: (v: string) => void;
  onCitySelected: (city: string, country: string) => void;
  autoFilled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const acRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    function check() {
      if (window.google?.maps?.places) { setReady(true); return; }
      setTimeout(check, 200);
    }
    check();
  }, []);

  useEffect(() => {
    if (!ready || !inputRef.current || acRef.current) return;

    const ac = new google.maps.places.Autocomplete(inputRef.current, {
      types: ["(cities)"],
      fields: ["address_components", "name"],
    });

    ac.addListener("place_changed", () => {
      const place = ac.getPlace();
      let city = place.name || "";
      let country = "";

      if (place.address_components) {
        for (const comp of place.address_components) {
          if (comp.types.includes("country")) {
            country = comp.long_name;
          }
        }
      }

      // Mettre à jour l'input directement (sans passer par React)
      if (inputRef.current) {
        inputRef.current.value = city;
      }

      onChange(city);
      onCitySelected(city, country);
    });

    acRef.current = ac;
  }, [ready, onChange, onCitySelected]);

  // Synchroniser la valeur du parent vers l'input (pour le reset du formulaire)
  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== value) {
      inputRef.current.value = value;
    }
  }, [value]);

  return (
    <input
      ref={inputRef}
      type="text"
      defaultValue={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-2.5 rounded-xl border text-forest focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage ${
        autoFilled && value ? "border-sage bg-sage/5" : "border-beige-dark bg-offwhite"
      }`}
      placeholder="Ex: Paris, Bangkok, Berlin..."
      required
    />
  );
}

interface ContributePlaceFormProps {
  userId: string;
}

const placeTypes = [
  { value: "supermarket", label: "Supermarché", icon: "\uD83D\uDED2" },
  { value: "store", label: "Épicerie bio", icon: "\uD83C\uDF3F" },
];

export function ContributePlaceForm({ userId }: ContributePlaceFormProps) {
  const searchParams = useSearchParams();
  const initialLat = searchParams.get("lat") ? parseFloat(searchParams.get("lat")!) : null;
  const initialLng = searchParams.get("lng") ? parseFloat(searchParams.get("lng")!) : null;

  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    getCitiesClient().then(setCities);
  }, []);

  const [citySearch, setCitySearch] = useState("");
  const [cityId, setCityId] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [name, setName] = useState("");
  const [type, setType] = useState("supermarket");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState<number | null>(initialLat);
  const [lng, setLng] = useState<number | null>(initialLng);
  const [tagsInput, setTagsInput] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const selectedCity = cities.find((c) => c.id === cityId);
  const isNewCity = citySearch.trim() !== "" && !selectedCity;

  // Pas besoin de filteredCities ni handleSelectCity — Google Places gère tout

  const [autoFilled, setAutoFilled] = useState(false);

  const handleLocationChange = (newLat: number, newLng: number) => {
    setLat(newLat);
    setLng(newLng);
  };

  const handleAddressResolved = (data: ResolvedAddress) => {
    if (data.city) {
      // Vérifier si la ville correspond à une ville existante
      const match = cities.find(
        (c) => c.name.toLowerCase() === data.city.toLowerCase()
      );
      if (match) {
        setCityId(match.id);
        setCitySearch(match.name);
        setCountry(match.country);
      } else {
        setCityId("");
        setCitySearch(data.city);
        setCountry(data.country);
      }
    }
    if (data.address) {
      setAddress(data.address);
    }
    setAutoFilled(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!citySearch.trim()) {
      setError("Indique une ville.");
      return;
    }
    if (!country.trim()) {
      setError("Indique le pays.");
      return;
    }

    setLoading(true);

    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      // Upload des photos vers Supabase Storage
      const photoUrls: string[] = [];
      if (photos.length > 0) {
        const tempFolder = `contribution-${Date.now()}`;
        for (const photo of photos) {
          const url = await uploadPlacePhoto(photo, tempFolder);
          photoUrls.push(url);
        }
      }

      const body = {
        user_id: userId,
        type: "place" as const,
        city_id: cityId || undefined,
        city_name: citySearch.trim(),
        city_country: country.trim(),
        is_new_city: isNewCity,
        place_name: name,
        place_type: type,
        place_address: address,
        place_description: description,
        place_lat: lat,
        place_lng: lng,
        place_google_maps_url: "",
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

  const resetForm = () => {
    setSuccess(false);
    setName("");
    setAddress("");
    setDescription("");
    setLat(null);
    setLng(null);
    setTagsInput("");
    setPhotos([]);
    setCityId("");
    setCitySearch("");
    setCountry("");
    setPostalCode("");
    setAutoFilled(false);
  };

  if (success) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm text-center mt-6">
        <div className="text-4xl mb-4">🎉</div>
        <h2 className="text-xl font-bold text-forest">Merci pour ta contribution !</h2>
        <p className="text-forest/60 mt-2">
          Ton lieu sera vérifié par notre équipe avant d&apos;être publié.
        </p>
        <button
          onClick={resetForm}
          className="mt-6 bg-sage text-white px-6 py-2.5 rounded-xl font-medium hover:bg-sage-dark transition-colors"
        >
          Ajouter un autre lieu
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm mt-6">
      {/* === SECTION 1 : Où ? === */}
      <fieldset className="space-y-4">
        <legend className="text-base font-bold text-forest flex items-center gap-2 mb-3">
          <span className="w-6 h-6 rounded-full bg-sage text-white text-xs flex items-center justify-center font-bold">1</span>
          Où se trouve le lieu ?
        </legend>

        {/* Localisation carte — en premier */}
        <div>
          <p className="text-sm text-forest/60 mb-2">
            Utilise ta position ou clique sur la carte — la ville, le pays et l&apos;adresse se rempliront automatiquement.
          </p>
          <LocationPicker
            lat={lat}
            lng={lng}
            onLocationChange={handleLocationChange}
            onAddressResolved={handleAddressResolved}
            center={selectedCity ? [selectedCity.lat, selectedCity.lng] : undefined}
          />
        </div>

        {/* Séparateur "ou" */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-beige-dark" />
          <span className="text-xs text-forest/40 font-medium">ou remplis manuellement</span>
          <div className="flex-1 h-px bg-beige-dark" />
        </div>

        {/* Adresse avec autocomplete Google — en premier */}
        <div>
          <label className="block text-sm font-medium text-forest mb-1">
            Adresse
            <span className="text-forest/40 font-normal ml-1">(optionnel)</span>
          </label>
          <AddressAutocomplete
            value={address}
            onChange={(val) => { setAddress(val); setAutoFilled(false); }}
            onPlaceSelected={(result) => {
              setAddress(result.address);
              setLat(result.lat);
              setLng(result.lng);
              if (result.postalCode) setPostalCode(result.postalCode);
              if (result.city) {
                const match = cities.find(
                  (c) => c.name.toLowerCase() === result.city.toLowerCase()
                );
                if (match) {
                  setCityId(match.id);
                  setCitySearch(match.name);
                  setCountry(match.country);
                } else {
                  setCityId("");
                  setCitySearch(result.city);
                  setCountry(result.country);
                }
              }
              setAutoFilled(true);
            }}
            autoFilled={autoFilled}
          />
        </div>

        {/* Ville + Code postal côte à côte */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Ville — Google Places Autocomplete */}
          <div className="relative">
            <label className="block text-sm font-medium text-forest mb-1">
              Ville
            </label>
            <CityAutocompleteInput
              value={citySearch}
              onChange={(val) => {
                setCitySearch(val);
                setCityId("");
                setCountry("");
                setAutoFilled(false);
              }}
              onCitySelected={(cityName, countryName) => {
                setCitySearch(cityName);
                setCountry(countryName);
                const match = cities.find(
                  (c) => c.name.toLowerCase() === cityName.toLowerCase()
                );
                if (match) {
                  setCityId(match.id);
                }
                setAutoFilled(true);
              }}
              autoFilled={autoFilled}
            />
            {selectedCity && (
              <p className="text-xs text-sage mt-1 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Ville existante sur GreenTrip
              </p>
            )}
            {isNewCity && citySearch.trim() && (
              <p className="text-xs text-forest/40 mt-1">
                Nouvelle ville — sera ajoutée après vérification
              </p>
            )}
          </div>

          {/* Code postal */}
          <div>
            <label className="block text-sm font-medium text-forest mb-1">
              Code postal
            </label>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border text-forest focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage ${
                autoFilled && postalCode ? "border-sage bg-sage/5" : "border-beige-dark bg-offwhite"
              }`}
              placeholder="Ex: 51100, 75001..."
            />
          </div>
        </div>

        {/* Pays — auto-rempli */}
        <div>
          <label className="block text-sm font-medium text-forest mb-1">
            Pays
          </label>
          <input
            type="text"
            value={country}
            onChange={(e) => { setCountry(e.target.value); setAutoFilled(false); }}
            className={`w-full px-4 py-2.5 rounded-xl border text-forest focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage ${
              autoFilled && country ? "border-sage bg-sage/5" : "border-beige-dark bg-offwhite"
            }`}
            placeholder="Ex: France, Allemagne..."
            required
          />
        </div>
      </fieldset>

      <hr className="my-6 border-beige-dark" />

      {/* === SECTION 2 : Quoi ? === */}
      <fieldset className="space-y-4">
        <legend className="text-base font-bold text-forest flex items-center gap-2 mb-3">
          <span className="w-6 h-6 rounded-full bg-sage text-white text-xs flex items-center justify-center font-bold">2</span>
          Quel est ce lieu ?
        </legend>

        {/* Nom */}
        <div>
          <label className="block text-sm font-medium text-forest mb-1">
            Nom du lieu
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-beige-dark bg-offwhite text-forest focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
            placeholder="Ex: Whole Foods Market, Veganz..."
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-forest mb-2">
            Type de lieu
          </label>
          <div className="grid grid-cols-2 gap-2">
            {placeTypes.map((pt) => (
              <button
                key={pt.value}
                type="button"
                onClick={() => setType(pt.value)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  type === pt.value
                    ? "bg-sage text-white border-sage shadow-sm"
                    : "bg-offwhite text-forest/70 border-beige-dark hover:border-sage/50"
                }`}
              >
                <span>{pt.icon}</span>
                <span>{pt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-forest mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            maxLength={500}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-beige-dark bg-offwhite text-forest focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage resize-none"
            placeholder="Qu'est-ce qu'on y trouve ? Pourquoi c'est bien pour les vegans ?"
          />
          <p className="text-xs text-forest/40 text-right mt-1">
            {description.length}/500
          </p>
        </div>
      </fieldset>

      <hr className="my-6 border-beige-dark" />

      {/* === SECTION 3 : Compléments === */}
      <fieldset className="space-y-4">
        <legend className="text-base font-bold text-forest flex items-center gap-2 mb-3">
          <span className="w-6 h-6 rounded-full bg-sage text-white text-xs flex items-center justify-center font-bold">3</span>
          Pour aller plus loin
          <span className="text-xs font-normal text-forest/40 ml-1">(optionnel)</span>
        </legend>

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
            placeholder="bio, vegan, vrac, local..."
          />
        </div>
      </fieldset>

      {/* Erreur */}
      {error && (
        <div className="mt-5 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-6 bg-sage text-white py-3.5 rounded-xl font-semibold hover:bg-sage-dark transition-colors disabled:opacity-50 text-base"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Envoi en cours...
          </span>
        ) : (
          "Soumettre le lieu"
        )}
      </button>

      <p className="text-xs text-forest/40 text-center mt-3">
        Ta contribution sera vérifiée avant publication.
      </p>
    </form>
  );
}
