"use client";

import { useEffect, useMemo, useState } from "react";
import { distanceKm } from "../../lib/utils/geo";

type Job = {
  id: string;
  title: string;
  desc: string;
  category: string;
  payNok: number;
  durationMinutes: number;
  areaName: string;
  lat: number;
  lng: number;
  createdAt: string;
  status: "open" | "closed";
};

export default function Page() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<"idle" | "ok" | "denied" | "unsupported">("idle");

  const [radius, setRadius] = useState<number>(5);
  const [category, setCategory] = useState<string>("Alle");

  useEffect(() => {
    fetch("/api/jobs")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => setJobs(d.jobs ?? []))
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setGeoStatus("unsupported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setPos({ lat: p.coords.latitude, lng: p.coords.longitude });
        setGeoStatus("ok");
      },
      () => {
        setPos(null);
        setGeoStatus("denied");
      },
      { enableHighAccuracy: true, maximumAge: 60_000 }
    );
  }, []);

  const categories = useMemo(
    () => ["Alle", ...Array.from(new Set(jobs.map((j) => j.category)))],
    [jobs]
  );

  const visible = useMemo(() => {
    return jobs.filter((j) => {
      const catOK = category === "Alle" || j.category === category;
      if (!pos) return catOK; // если гео нет, показываем все по категории
      const d = distanceKm(pos, { lat: j.lat, lng: j.lng });
      return catOK && d <= radius;
    });
  }, [jobs, pos, radius, category]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Jobber</h1>

      {}
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2">
          Avstand:
          <select
            value={radius}
            onChange={(e) => setRadius(parseInt(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {[1, 3, 5, 10].map((km) => (
              <option key={km} value={km}>
                {km} km
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2">
          Kategori:
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        {geoStatus === "unsupported" && (
          <span className="text-sm text-gray-500">Geolokasjon støttes ikke.</span>
        )}
        {geoStatus === "denied" && (
          <span className="text-sm text-gray-500">
            Posisjon ble ikke gitt — viser alle jobber.
          </span>
        )}
      </div>

      {loading && <div>Henter jobber…</div>}
      {error && <div className="text-red-600">Feil: {error}</div>}

      <ul className="space-y-3">
        {visible.map((j) => {
          const dist =
            pos ? distanceKm(pos, { lat: j.lat, lng: j.lng }).toFixed(1) + " km" : null;

          const h = Math.floor(j.durationMinutes / 60);
          const m = j.durationMinutes % 60;
          const dur = h === 0 ? `${m} min` : m === 0 ? `${h} t` : `${h} t ${m} min`;

          return (
            <li key={j.id} className="border rounded p-3">
              <div className="font-medium">{j.title}</div>
              <div className="text-sm text-gray-600">
                {j.category} • {j.areaName} • {dur} • {j.payNok} NOK
                {dist ? ` • ${dist}` : ""}
              </div>
              <p className="mt-2 text-sm">{j.desc}</p>
              <button className="mt-2 border rounded px-3 py-1">Søk</button>
            </li>
          );
        })}
      </ul>

      {!loading && !error && visible.length === 0 && (
        <div className="text-gray-500">Ingen jobber i valgt radius/kategori.</div>
      )}
    </div>
  );
}