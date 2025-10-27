"use client";

import { JobDetailsDialog } from "@/components/JobDetailsDialog";
import { useEffect, useMemo, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { minutesToHhMm } from "@/lib/utils/format";
import { distanceKm } from "@/lib/utils/geo";

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
  address?: string;
  scheduleType?: "flexible" | "fixed" | "deadline";
  startTime?: string;
  endTime?: string;
  paymentType?: "fixed" | "hourly";
  requirements?: string;
};

export default function Page() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [radius, setRadius] = useState<number>(5);
  const [loading, setLoading] = useState(true);

  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<"idle" | "ok" | "denied" | "unsupported">("idle");

  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openJob, setOpenJob] = useState<Job | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/jobs")
      .then((r) => r.json())
      .then((d) => setJobs(d.jobs ?? []))
      .catch((e) => console.error("Kunne ikke hente jobber:", e))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!navigator?.geolocation) {
      setGeoStatus("unsupported");
      return;
    }
    setGeoStatus("idle");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setPos({ lat: p.coords.latitude, lng: p.coords.longitude });
        setGeoStatus("ok");
      },
      () => {
        setGeoStatus("denied");
      },
      { timeout: 5000 }
    );
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setIsLoggedIn(!!d.user))
      .catch(() => setIsLoggedIn(false));
  }, []);

  const categories = useMemo(() => {
    const s = new Set<string>();
    jobs.forEach((j) => s.add(j.category));
    return Array.from(s).sort();
  }, [jobs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((j) => {
      if (category && j.category !== category) return false;
      if (!q) return true;
      return (
        j.title.toLowerCase().includes(q) ||
        j.desc.toLowerCase().includes(q) ||
        j.areaName.toLowerCase().includes(q)
      );
    });
  }, [jobs, query, category]);

  const visible = useMemo(() => {
    if (!pos) return filtered;
    return filtered.filter((j) => {
      const d = distanceKm(pos, { lat: j.lat, lng: j.lng });
      return d <= radius;
    });
  }, [filtered, pos, radius]);

  async function apply(jobId: string) {
    if (!isLoggedIn) {
      toast.error("Du må være innlogget for å søke på jobber.");
      return;
    }
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setAppliedJobIds((prev) => new Set(prev).add(jobId));
      toast.success("Søknad sendt ✅");
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      toast.error("Kunne ikke sende søknad: " + errorMessage);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-block bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            🚀 {visible.length} ledige jobber
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Finn din neste <span className="text-orange-600">småjobb</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Søk blant hundrevis av småjobber i ditt område. Filtrer etter kategori og avstand.
          </p>
        </header>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <Input
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              placeholder="Søk i tittel, beskrivelse eller område..."
              className="pl-12 pr-4 py-6 text-lg border-2 border-gray-200 focus:border-orange-400 rounded-2xl shadow-sm bg-white"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-5xl mx-auto">
          {/* Category Pills */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  category === null
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-orange-50 border border-gray-200"
                }`}
                onClick={() => setCategory(null)}
              >
                Alle
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    category === c
                      ? "bg-orange-500 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-orange-50 border border-gray-200"
                  }`}
                  onClick={() => setCategory(category === c ? null : c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Radius Filter */}
          <div className="sm:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📍 Avstand {pos && `(${radius} km)`}
            </label>
            <select
              value={radius}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRadius(parseInt(e.target.value))}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-white focus:border-orange-400 focus:outline-none"
              disabled={!pos}
            >
              {[1, 3, 5, 10, 25, 50].map((km) => (
                <option key={km} value={km}>
                  {km} km
                </option>
              ))}
            </select>
            {geoStatus === "denied" && (
              <p className="text-xs text-amber-600 mt-1">⚠️ Gi posisjon for å filtrere</p>
            )}
            {geoStatus === "unsupported" && (
              <p className="text-xs text-gray-400 mt-1">Geolokasjon støttes ikke</p>
            )}
          </div>
        </div>

        {/* Job Grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-white p-6 animate-pulse h-64 shadow-sm" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Ingen jobber funnet</h3>
            <p className="text-gray-600">Prøv å endre søkekriteriene dine</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((job) => {
              const dist = pos ? distanceKm(pos, { lat: job.lat, lng: job.lng }).toFixed(1) + " km" : null;
              return (
                <Card
                  key={job.id}
                  onClick={() => setOpenJob(job)}
                  className="group hover:shadow-lg transition-all duration-200 cursor-pointer bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-gray-200/50 hover:border-gray-200 flex flex-col h-[360px]"
                >
                  {/* Header Section - Fixed Position */}
                  <div className="px-6 pt-6 pb-3 flex-shrink-0">
                    <div className="h-12 flex items-start">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-gray-700 transition leading-tight">
                          {job.title}
                        </CardTitle>
                      </div>
                    </div>

                    {/* Address - Fixed Position */}
                    <div className="h-5 mt-2">
                      <div className="text-sm text-gray-500 flex items-center gap-1.5 truncate">
                        <span className="text-gray-400 flex-shrink-0">📍</span>
                        <span className="truncate">
                          {job.address || "Adresse ikke oppgitt"}
                        </span>
                      </div>
                    </div>

                    {/* Badges - Fixed Position */}
                    <div className="h-7 mt-3 flex items-center overflow-hidden">
                      <div className="flex gap-2 w-full">
                        <Badge className="bg-gray-100 text-gray-700 font-medium px-2 py-0.5 text-xs border-0 flex-shrink-0">
                          {job.category}
                        </Badge>
                        <Badge variant="outline" className="px-2 py-0.5 text-xs border-gray-200 text-gray-600 truncate max-w-[100px] flex-shrink-0 text-left overflow-hidden whitespace-nowrap">
                          {job.areaName}
                        </Badge>
                        {dist && (
                          <Badge variant="outline" className="px-2 py-0.5 text-xs border-gray-200 text-gray-600 flex-shrink-0">
                            {dist}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description - Flexible Space */}
                  <div className="px-6 flex-1 min-h-0">
                    <p className="text-gray-600 line-clamp-3 leading-relaxed text-sm h-full">
                      {job.desc?.trim() || "Beskrivelse ikke tilgjengelig"}
                    </p>
                  </div>

                  {/* Price & Time - Fixed Position */}
                  <div className="px-6 py-3 border-t border-gray-100 flex-shrink-0">
                    <div className="flex items-center justify-between h-8">
                      <div className="flex-1 min-w-0">
                        <div className="text-2xl font-bold text-gray-900 leading-none truncate">
                          {job.payNok && job.payNok > 0 ? `${job.payNok} kr` : "Pris ikke oppgitt"}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5 truncate">
                          {job.paymentType === "hourly" ? "per time" : "fast pris"} • {minutesToHhMm(job.durationMinutes) || "Varighet ikke oppgitt"}
                        </div>
                      </div>

                      {job.scheduleType && (
                        <div className="flex-shrink-0 ml-3">
                          <Badge variant="outline" className="px-2.5 py-0.5 text-xs border-gray-200 text-gray-600">
                            {job.scheduleType === "flexible" && "Fleksibel"}
                            {job.scheduleType === "fixed" && "Fast tid"}
                            {job.scheduleType === "deadline" && "Frist"}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Button - Fixed Position */}
                  <div className="px-6 pb-6 flex-shrink-0">
                    <Button
                      className={`w-full rounded-lg py-2.5 font-medium text-sm transition-colors h-9 ${
                        appliedJobIds.has(job.id)
                          ? "bg-green-600 hover:bg-green-700 text-white cursor-default"
                          : !isLoggedIn
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-gray-900 hover:bg-gray-800 text-white"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        apply(job.id);
                      }}
                      disabled={appliedJobIds.has(job.id)}
                    >
                      {appliedJobIds.has(job.id)
                        ? "✓ Søknad sendt"
                        : !isLoggedIn
                        ? "🔓 Logg inn for å søke"
                        : "Søk på jobb"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      
      <JobDetailsDialog
        open={!!openJob}
        onOpenChange={(v) => !v && setOpenJob(null)}
        job={openJob}
        onApply={openJob ? () => apply(openJob.id) : undefined}
      />
    </div>
  );
}