"use client";

import { useEffect, useState } from "react";
import { Place } from "@/lib/types";

interface MapProps {
  center: [number, number];
  places: Place[];
}

export function Map({ center, places }: MapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[400px] rounded-xl bg-beige flex items-center justify-center text-forest/40">
        Chargement de la carte...
      </div>
    );
  }

  return <MapInner center={center} places={places} />;
}

function MapInner({ center, places }: MapProps) {
  const {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
  } = require("react-leaflet");
  const L = require("leaflet");

  useEffect(() => {
    // Fix leaflet default marker icon
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

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      />
      <MapContainer
        center={center}
        zoom={13}
        className="w-full h-[400px] rounded-xl z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {places.map((place) => (
          <Marker key={place.id} position={[place.lat, place.lng]}>
            <Popup>
              <strong>{place.name}</strong>
              <br />
              {place.address}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}
