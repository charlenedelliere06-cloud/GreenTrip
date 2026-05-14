"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Place } from "@/lib/types";
import { PLACE_TYPE_CONFIG } from "@/lib/place-types";
import Link from "next/link";

interface MapProps {
  center: [number, number];
  places: Place[];
  nearbyPlaces?: Place[];
  citySlug?: string;
}

const typeConfig: Record<string, { color: string; emoji: string; label: string }> = Object.fromEntries(
  Object.entries(PLACE_TYPE_CONFIG).map(([key, v]) => [
    key,
    { color: v.color, emoji: v.icon, label: v.label },
  ])
);

export function Map({ center, places, nearbyPlaces = [], citySlug }: MapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[500px] rounded-xl bg-beige flex items-center justify-center text-forest/40">
        Chargement de la carte...
      </div>
    );
  }

  return <MapInner center={center} places={places} nearbyPlaces={nearbyPlaces} citySlug={citySlug} />;
}

function MapInner({ center, places, nearbyPlaces = [], citySlug }: MapProps) {
  const {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Circle,
    useMap,
    useMapEvents,
  } = require("react-leaflet");
  const L = require("leaflet");

  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);
  const [visiblePlaces, setVisiblePlaces] = useState<Place[]>(places);
  const [mapMoved, setMapMoved] = useState(false);
  const [resultCount, setResultCount] = useState<number | null>(null);
  const hasDoneInitialFilter = useRef(false);

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

  const createColoredIcon = useCallback((color: string, emoji: string) => {
    return L.divIcon({
      className: "custom-marker",
      html: `<div style="
        background: ${color};
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
      ">${emoji}</div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -20],
    });
  }, [L]);

  const createNearbyIcon = useCallback((color: string, emoji: string) => {
    return L.divIcon({
      className: "custom-marker-nearby",
      html: `<div style="
        background: ${color};
        opacity: 0.65;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        border: 2px dashed white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        cursor: pointer;
      ">${emoji}</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -16],
    });
  }, [L]);

  const handleLocateMe = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        setLocating(false);
      },
      () => {
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Component that detects map movement
  function MapEventHandler() {
    const map = useMap();

    useMapEvents({
      moveend() {
        if (!hasDoneInitialFilter.current) {
          hasDoneInitialFilter.current = true;
          return;
        }
        setMapMoved(true);
      },
    });

    // Expose the search function via a ref-like pattern
    useEffect(() => {
      (window as any).__greentrip_map = map;
    }, [map]);

    return null;
  }

  const handleSearchHere = () => {
    const map = (window as any).__greentrip_map;
    if (!map) return;

    const bounds = map.getBounds();
    const filtered = places.filter((p) =>
      bounds.contains(L.latLng(p.lat, p.lng))
    );
    setVisiblePlaces(filtered);
    setResultCount(filtered.length);
    setMapMoved(false);

    // Hide result count after 3 seconds
    setTimeout(() => setResultCount(null), 3000);
  };

  function FlyToLocation({ position }: { position: [number, number] }) {
    const map = useMap();
    useEffect(() => {
      map.flyTo(position, 15, { duration: 1.5 });
    }, [map, position]);
    return null;
  }

  return (
    <div className="relative">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      />

      {/* Legend */}
      <div className="flex flex-wrap gap-2 mb-3">
        {Object.entries(typeConfig).map(([key, cfg]) => (
          <span
            key={key}
            className="inline-flex items-center gap-1.5 text-xs bg-white px-2.5 py-1 rounded-full border border-beige-dark"
          >
            <span
              className="w-3 h-3 rounded-full inline-block"
              style={{ background: cfg.color }}
            />
            {cfg.label}
          </span>
        ))}
      </div>

      <MapContainer
        center={center}
        zoom={13}
        className="w-full h-[500px] rounded-xl z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <MapEventHandler />

        {/* Place markers */}
        {visiblePlaces.map((place) => {
          const cfg = typeConfig[place.type] || typeConfig.store;
          return (
            <Marker
              key={place.id}
              position={[place.lat, place.lng]}
              icon={createColoredIcon(cfg.color, cfg.emoji)}
            >
              <Popup>
                <div style={{ minWidth: 200, maxWidth: 260 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{
                      background: cfg.color,
                      color: "white",
                      fontSize: 10,
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: 99,
                    }}>
                      {cfg.emoji} {cfg.label}
                    </span>
                  </div>
                  <strong style={{ fontSize: 15, color: "#2D4A2D" }}>{place.name}</strong>
                  <p style={{ fontSize: 12, color: "#666", margin: "4px 0" }}>{place.address}</p>
                  <p style={{ fontSize: 12, color: "#444", margin: "4px 0 8px" }}>
                    {place.description.length > 100
                      ? place.description.slice(0, 100) + "..."
                      : place.description}
                  </p>
                  {place.photos.length > 0 && (
                    <img
                      src={place.photos[0]}
                      alt={place.name}
                      style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 8, marginBottom: 8 }}
                    />
                  )}
                  <a
                    href={`/place/${place.id}`}
                    style={{
                      display: "inline-block",
                      background: "#9CAF88",
                      color: "white",
                      padding: "6px 14px",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    Voir le lieu
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Nearby place markers */}
        {nearbyPlaces.map((place) => {
          const cfg = typeConfig[place.type] || typeConfig.store;
          return (
            <Marker
              key={`nearby-${place.id}`}
              position={[place.lat, place.lng]}
              icon={createNearbyIcon(cfg.color, cfg.emoji)}
            >
              <Popup>
                <div style={{ minWidth: 200, maxWidth: 260 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{
                      background: "#9CA3AF",
                      color: "white",
                      fontSize: 10,
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: 99,
                    }}>
                      📍 Aux alentours
                    </span>
                  </div>
                  <strong style={{ fontSize: 15, color: "#2D4A2D" }}>{place.name}</strong>
                  <p style={{ fontSize: 12, color: "#666", margin: "4px 0" }}>{place.address}</p>
                  <a
                    href={`/place/${place.id}`}
                    style={{
                      display: "inline-block",
                      background: "#9CAF88",
                      color: "white",
                      padding: "6px 14px",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 600,
                      textDecoration: "none",
                      marginTop: 8,
                    }}
                  >
                    Voir le lieu
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* User location marker */}
        {userLocation && (
          <>
            <Circle
              center={userLocation}
              radius={100}
              pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.15, weight: 2 }}
            />
            <Marker
              position={userLocation}
              icon={L.divIcon({
                className: "user-location-marker",
                html: `<div style="
                  width: 20px;
                  height: 20px;
                  background: #3b82f6;
                  border: 3px solid white;
                  border-radius: 50%;
                  box-shadow: 0 0 10px rgba(59,130,246,0.5);
                "></div>`,
                iconSize: [20, 20],
                iconAnchor: [10, 10],
              })}
            >
              <Popup>
                <div style={{ textAlign: "center" }}>
                  <strong style={{ color: "#2D4A2D" }}>Tu es ici</strong>
                  {citySlug && (
                    <div style={{ marginTop: 8 }}>
                      <a
                        href={`/contribute?lat=${userLocation[0]}&lng=${userLocation[1]}`}
                        style={{
                          display: "inline-block",
                          background: "#9CAF88",
                          color: "white",
                          padding: "6px 14px",
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 600,
                          textDecoration: "none",
                        }}
                      >
                        + Ajouter un lieu ici
                      </a>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
            <FlyToLocation position={userLocation} />
          </>
        )}
      </MapContainer>

      {/* "Search here" button — appears when map is moved */}
      {mapMoved && (
        <div className="absolute top-[70px] left-1/2 -translate-x-1/2 z-[1000]">
          <button
            onClick={handleSearchHere}
            className="bg-white text-forest shadow-lg rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-beige/50 transition-all flex items-center gap-2 border border-beige-dark animate-fade-in"
          >
            <svg className="w-4 h-4 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Rechercher dans cette zone
          </button>
        </div>
      )}

      {/* Result count badge — appears briefly after search */}
      {resultCount !== null && (
        <div className="absolute top-[70px] left-1/2 -translate-x-1/2 z-[1000]">
          <div className="bg-forest text-white shadow-lg rounded-full px-5 py-2.5 text-sm font-semibold animate-fade-in">
            {resultCount === 0
              ? "Aucun lieu dans cette zone"
              : `${resultCount} lieu${resultCount > 1 ? "x" : ""} trouvé${resultCount > 1 ? "s" : ""}`}
          </div>
        </div>
      )}

      {/* Buttons overlay */}
      <div className="absolute top-[calc(100%-60px)] right-3 z-[1000] flex flex-col gap-2">
        {/* Locate me button */}
        <button
          onClick={handleLocateMe}
          disabled={locating}
          className="bg-white text-forest shadow-lg rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-beige/50 transition-colors flex items-center gap-2 border border-beige-dark disabled:opacity-50"
          title="Me localiser"
        >
          {locating ? (
            <span className="w-4 h-4 border-2 border-forest/30 border-t-forest rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2M2 12h2m16 0h2m-3.636-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414m0-11.314l1.414 1.414m9.9 9.9l1.414 1.414M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          )}
          {locating ? "Localisation..." : "Me localiser"}
        </button>

        {/* Add place button */}
        {citySlug && (
          <Link
            href="/contribute"
            className="bg-sage text-white shadow-lg rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-sage-dark transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Ajouter un lieu
          </Link>
        )}
      </div>
    </div>
  );
}
