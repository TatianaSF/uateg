"use client";

import { divIcon } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { City, Locale } from "@/content/schema";

export default function VerifiedMap({ cities, locale }: { cities: City[]; locale: Locale }) {
  const points = cities.flatMap((city) => city.coordinates ? [{ city, point: city.coordinates }] : []);
  if (!points.length) return null;
  return <div className="leaflet-frame">
    <MapContainer center={points[0].point} zoom={4} scrollWheelZoom={false} aria-label={locale === "en" ? "Map of approximate event city locations" : "Мапа приблизного розташування міст подій"}>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {points.map(({ city, point }) => <Marker
        key={city.id}
        position={point}
        title={`${city.name[locale]} · ${city.eventIds.length} ${locale === "en" ? "events" : "подій"}`}
        alt={`${city.name[locale]} · ${city.eventIds.length} ${locale === "en" ? "events" : "подій"}`}
        icon={divIcon({ className: "map-marker-count", html: `<span aria-hidden="true">${city.eventIds.length}</span>`, iconSize: [38, 38], iconAnchor: [19, 19] })}
      >
        <Popup><strong>{city.name[locale]}</strong><br />{city.eventIds.length} {locale === "en" ? "documented events" : "задокументовані події"}</Popup>
      </Marker>)}
    </MapContainer>
  </div>;
}
