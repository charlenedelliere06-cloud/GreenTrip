"use client";

import { useEffect, useState, useCallback } from "react";

export interface ResolvedAddress {
  city: string;
  country: string;
  address: string;
}

interface LocationPickerProps {
  lat: number | null;
  lng: number | null;
  onLocationChange: (lat: number, lng: number) => void;
  onAddressResolved?: (data: ResolvedAddress) => void;
  center?: [number, number];
}

async function reverseGeocode(lat: number, lng: number): Promise<ResolvedAddress | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=fr`,
      { headers: { "User-Agent": "GreenTrip/1.0" } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const addr = data.address || {};

    const city =
      addr.city || addr.town || addr.village || addr.municipality || addr.hamlet || "";
    const country = addr.country || "";
    const road = addr.road || addr.pedestrian || addr.footway || "";
    const houseNumber = addr.house_number || "";
    const suburb = addr.suburb || addr.neighbourhood || "";

    const parts = [houseNumber, road, suburb].filter(Boolean);
    const address = parts.join(", ");

    return { city, country, address };
  } catch {
    return null;
  }
}

export function LocationPicker({ lat, lng, onLocationChange, onAddressResolved, center }: LocationPickerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[300px] rounded-xl bg-beige flex items-center justify-center text-forest/40">
        Chargement de la carte...
      </div>
    );
  }

  return (
    <LocationPickerInner
      lat={lat}
      lng={lng}
      onLocationChange={onLocationChange}
      onAddressResolved={onAddressResolved}
      center={center}
    />
  );
}

function LocationPickerInner({ lat, lng, onLocationChange, onAddressResolved, center }: LocationPickerProps) {
  const {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
    useMap,
  } = require("react-leaflet");
  const L = require("leaflet");

  const [locating, setLocating] = useState(false);
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });
  }, [L]);

  const markerIcon = L.divIcon({
    className: "custom-marker",
    html: `<div style="
      background: #9CAF88;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    ">\uD83D\uDCCD</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  const defaultCenter: [number, number] = center || [48.8566, 2.3522];
  const mapCenter: [number, number] = lat && lng ? [lat, lng] : defaultCenter;

  const handleNewPosition = useCallback(async (newLat: number, newLng: number) => {
    onLocationChange(newLat, newLng);

    if (onAddressResolved) {
      setResolving(true);
      const result = await reverseGeocode(newLat, newLng);
      if (result) {
        onAddressResolved(result);
      }
      setResolving(false);
    }
  }, [onLocationChange, onAddressResolved]);

  function ClickHandler() {
    useMapEvents({
      click(e: any) {
        handleNewPosition(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  }

  function FlyToLocation({ position }: { position: [number, number] }) {
    const map = useMap();
    useEffect(() => {
      map.flyTo(position, 16, { duration: 1 });
    }, [map, position]);
    return null;
  }

  const handleGeolocate = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        handleNewPosition(pos.coords.latitude, pos.coords.longitude);
        setLocating(false);
      },
      () => {
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleGeolocate}
          disabled={locating}
          className="flex items-center gap-2 bg-white border border-beige-dark rounded-xl px-4 py-2.5 text-sm font-medium text-forest hover:bg-beige/50 transition-colors disabled:opacity-50"
        >
          {locating ? (
            <span className="w-4 h-4 border-2 border-forest/30 border-t-forest rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2M2 12h2m16 0h2m-3.636-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414m0-11.314l1.414 1.414m9.9 9.9l1.414 1.414M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          )}
          {locating ? "Localisation..." : "Utiliser ma position"}
        </button>
        <span className="text-xs text-forest/40">ou clique sur la carte</span>
      </div>

      <div className="relative">
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
        />
        <MapContainer
          center={mapCenter}
          zoom={lat && lng ? 16 : 5}
          className="w-full h-[300px] rounded-xl z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler />
          {lat && lng && (
            <>
              <Marker position={[lat, lng]} icon={markerIcon} />
              <FlyToLocation position={[lat, lng]} />
            </>
          )}
        </MapContainer>

        {!lat && !lng && (
          <div className="absolute inset-0 z-[500] flex items-center justify-center pointer-events-none">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-sm text-center">
              <p className="text-sm text-forest/70 font-medium">
                Clique sur la carte pour placer le lieu
              </p>
              <p className="text-xs text-forest/40 mt-1">
                ou utilise le bouton &quot;Ma position&quot; ci-dessus
              </p>
            </div>
          </div>
        )}
      </div>

      {lat && lng && (
        <div className="flex items-center gap-2">
          <p className="text-xs text-forest/50">
            Position : {lat.toFixed(5)}, {lng.toFixed(5)}
          </p>
          {resolving && (
            <span className="text-xs text-sage flex items-center gap-1">
              <span className="w-3 h-3 border-2 border-sage/30 border-t-sage rounded-full animate-spin" />
              Recherche de l&apos;adresse...
            </span>
          )}
        </div>
      )}
    </div>
  );
}
