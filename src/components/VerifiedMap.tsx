"use client";

import { divIcon, latLngBounds, point, type Point } from "leaflet";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import type { City, Locale } from "@/content/schema";
import { allEvents, localized } from "@/content/repository";
import { countryFlag, documentedEventCount } from "@/lib/country-display";

function FitCities({ cities }: { cities: City[] }) {
  const map = useMap();
  const points = useMemo(() => cities.flatMap((city) => city.coordinates ? [city.coordinates] : []), [cities]);
  useEffect(() => {
    if (!points.length) return;
    if (points.length === 1) map.setView(points[0], 7);
    else map.fitBounds(latLngBounds(points), { padding: [28, 28], maxZoom: 5 });
  }, [map, points]);
  return null;
}

function nearbyCitiesLabel(count: number, locale: Locale) {
  if (locale === "en") return `${count} nearby ${count === 1 ? "city" : "cities"}`;
  const mod10 = count % 10;
  const mod100 = count % 100;
  const noun = mod10 === 1 && mod100 !== 11 ? "місто поруч"
    : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14) ? "міста поруч"
      : "міст поруч";
  return `${count} ${noun}`;
}

function CityMarkers({ cities, locale }: { cities: City[]; locale: Locale }) {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());
  useEffect(() => {
    const updateZoom = () => setZoom(map.getZoom());
    map.on("zoomend", updateZoom);
    return () => { map.off("zoomend", updateZoom); };
  }, [map]);

  const groups: { cities: City[]; screen: Point }[] = cities.flatMap((city) => city.coordinates
    ? [{ cities: [city], screen: map.latLngToContainerPoint(city.coordinates) }]
    : []);
  let changed = true;
  while (changed) {
    changed = false;
    outer: for (let left = 0; left < groups.length; left += 1) {
      for (let right = left + 1; right < groups.length; right += 1) {
        if (groups[left].screen.distanceTo(groups[right].screen) < 64) {
          const a = groups[left];
          const b = groups[right];
          const count = a.cities.length + b.cities.length;
          groups[left] = {
            cities: [...a.cities, ...b.cities],
            screen: point((a.screen.x * a.cities.length + b.screen.x * b.cities.length) / count, (a.screen.y * a.cities.length + b.screen.y * b.cities.length) / count),
          };
          groups.splice(right, 1);
          changed = true;
          break outer;
        }
      }
    }
  }
  const clusters = groups.map((group) => ({ cities: group.cities, position: map.containerPointToLatLng(group.screen) }));

  return clusters.map(({ cities: group, position }) => {
    const eventCount = group.reduce((sum, city) => sum + city.eventIds.length, 0);
    const label = group.length > 1
      ? `${nearbyCitiesLabel(group.length, locale)} · ${documentedEventCount(eventCount, locale)} · ${locale === "en" ? "zoom in to choose a city" : "збільште мапу, щоб обрати місто"}`
      : `${group[0].name[locale]} · ${documentedEventCount(eventCount, locale)}`;
    const city = group[0];
    const country = allEvents.find((event) => event.countryCode === city.countryCode)?.country[locale] ?? city.countryCode;
    return <Marker
      key={`${zoom}-${group.map((item) => item.id).join("-")}`}
      position={position}
      title={label}
      alt={label}
      icon={divIcon({ className: "map-marker-count", html: `<span aria-hidden="true">${eventCount}</span>`, iconSize: [40, 40], iconAnchor: [20, 20] })}
      eventHandlers={group.length > 1 ? { click: () => map.setView(position, Math.min(map.getZoom() + 2, 8), { animate: true }) } : undefined}
    >
      {group.length === 1 ? <Popup maxWidth={240} autoPanPadding={[20, 20]}><div className="map-popup">
        <p className="map-popup-country"><span aria-hidden="true">{countryFlag(city.countryCode) ?? ""}</span> {country}</p>
        <strong>{city.name[locale]}</strong>
        <p>{documentedEventCount(eventCount, locale)}</p>
        <ul>{city.eventIds.map((id) => {
          const event = allEvents.find((item) => item.id === id);
          return event ? <li key={id}><Link prefetch={false} href={`/${locale}/events/${event.slug}/`}>{event.dateOriginal} · {localized(event.title, locale)}</Link></li> : null;
        })}</ul>
      </div></Popup> : null}
    </Marker>;
  });
}

export default function VerifiedMap({ cities, locale }: { cities: City[]; locale: Locale }) {
  const points = cities.flatMap((city) => city.coordinates ? [{ city, point: city.coordinates }] : []);
  if (!points.length) return null;
  return <div className="leaflet-frame">
    <MapContainer center={points[0].point} zoom={4} scrollWheelZoom={false} aria-label={locale === "en" ? "Map of approximate event city locations" : "Мапа приблизного розташування міст подій"}>
      <FitCities cities={cities} />
      <TileLayer detectRetina attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <CityMarkers cities={cities} locale={locale} />
    </MapContainer>
  </div>;
}
