"use client";

import { useEffect, useRef, useState } from "react";

interface AddressResult {
  address: string;
  lat: number;
  lng: number;
  city: string;
  country: string;
  postalCode: string;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelected: (result: AddressResult) => void;
  autoFilled?: boolean;
  className?: string;
}

declare global {
  interface Window {
    google?: typeof google;
  }
}

export function AddressAutocomplete({
  value,
  onChange,
  onPlaceSelected,
  autoFilled,
  className,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [ready, setReady] = useState(false);

  // Attendre que le script Google Maps soit chargé
  useEffect(() => {
    function checkGoogle() {
      if (window.google?.maps?.places) {
        setReady(true);
        return;
      }
      setTimeout(checkGoogle, 200);
    }
    checkGoogle();
  }, []);

  // Synchroniser la valeur du parent vers l'input (pour le reset du formulaire)
  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== value) {
      inputRef.current.value = value;
    }
  }, [value]);

  // Initialiser l'autocomplete
  useEffect(() => {
    if (!ready || !inputRef.current || autocompleteRef.current) return;

    const autocomplete = new window.google!.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["address"],
        fields: ["formatted_address", "geometry", "address_components"],
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry?.location) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const address = place.formatted_address || "";

      let city = "";
      let country = "";
      let postalCode = "";

      if (place.address_components) {
        for (const comp of place.address_components) {
          if (comp.types.includes("locality")) {
            city = comp.long_name;
          }
          if (!city && comp.types.includes("administrative_area_level_1")) {
            city = comp.long_name;
          }
          if (comp.types.includes("country")) {
            country = comp.long_name;
          }
          if (comp.types.includes("postal_code")) {
            postalCode = comp.long_name;
          }
        }
      }

      // Mettre à jour l'input directement (sans passer par React)
      if (inputRef.current) {
        inputRef.current.value = address;
      }

      onChange(address);
      onPlaceSelected({ address, lat, lng, city, country, postalCode });
    });

    autocompleteRef.current = autocomplete;
  }, [ready, onChange, onPlaceSelected]);

  return (
    <input
      ref={inputRef}
      type="text"
      defaultValue={value}
      onChange={(e) => onChange(e.target.value)}
      className={
        className ||
        `w-full px-4 py-2.5 rounded-xl border text-forest focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage ${
          autoFilled && value
            ? "border-sage bg-sage/5"
            : "border-beige-dark bg-offwhite"
        }`
      }
      placeholder="Tape une adresse pour voir les suggestions..."
    />
  );
}
