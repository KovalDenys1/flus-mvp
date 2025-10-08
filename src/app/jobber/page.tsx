"use client";

import { JobDetailsDialog } from "@/components/JobDetailsDialog";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
};

export default function Page() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [radius, setRadius] = useState<number>(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!navigator?.geolocation) {
      setGeoStatus("unsupported");
      return;
    }
    setGeoStatus("idle");
    const id = navigator.geolocation.getCurrentPosition(
      (p) => {
        setPos({ lat: p.coords.latitude, lng: p.coords.longitude });
        setGeoStatus("ok");
      },
      () => {
        setGeoStatus("denied");
      },
      { timeout: 5000 }
    );
    return () => {
      // no clear needed for getCurrentPosition
    };
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
    } catch (e: any) {
      toast.error("Kunne ikke sende søknad: " + String(e?.message || e));
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-2 space-y-8 bg-gray-50 rounded-2xl">
      <header className="flex flex-col items-center gap-3 mb-4">
        <h1 className="text-3xl font-bold text-gray-900 text-center">Ledige jobber</h1>
        <p className="text-gray-500 text-center max-w-lg leading-relaxed">
          Søk blant småjobber i ditt område eller filtrer etter kategori og avstand.
        </p>
        <div className="w-full flex gap-2 mt-2">
          <Input
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            placeholder="Søk i tittel, beskrivelse eller område"
            className="bg-white/90 border-0 rounded-lg shadow-sm"
          />
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-2 justify-center">
        <button
          className={`px-3 py-1 rounded-lg font-medium transition ${category === null ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-orange-50"}`}
          onClick={() => setCategory(null)}
        >
          Alle
        </button>
        {categories.map((c) => (
          <button
            key={c}
            className={`px-3 py-1 rounded-lg font-medium transition ${category === c ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-orange-50"}`}
            onClick={() => setCategory(category === c ? null : c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 justify-center">
        <label className="flex items-center gap-2 text-sm">
          Avstand:
          <select
            value={radius}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRadius(parseInt(e.target.value))}
            className="border rounded px-2 py-1 bg-white"
          >
            {[1, 3, 5, 10].map((km) => (
              <option key={km} value={km}>
                {km} km
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm">
          Kategori:
          <select
            value={category ?? ""}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value || null)}
            className="border rounded px-2 py-1 bg-white"
          >
            <option value="">Alle</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        {geoStatus === "unsupported" && (
          <span className="text-sm text-gray-400">Geolokasjon støttes ikke.</span>
        )}
        {geoStatus === "denied" && (
          <span className="text-sm text-gray-400">Posisjon ble ikke gitt — viser alle jobber.</span>
        )}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-white/80 p-4 animate-pulse h-36 shadow-sm" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="py-12 text-center text-gray-500">Ingen jobber funnet.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {visible.map((job) => {
            const dist = pos ? distanceKm(pos, { lat: job.lat, lng: job.lng }).toFixed(1) + " km" : null;
            return (
              <Card
                key={job.id}
                onClick={() => setOpenJob(job)}
                className="hover:shadow-md transition w-full max-w-full overflow-hidden bg-white/90 rounded-xl border-0 cursor-pointer"
              >
                <CardHeader>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg font-semibold truncate">{job.title}</CardTitle>
                      <div className="text-xs text-gray-500">
                        <a
                          href={`/jobber/${job.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="underline"
                        >
                          Åpne side
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                      <span className="text-sm font-medium">{job.payNok} NOK</span>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200 px-2 py-0.5 text-xs">
                        {minutesToHhMm(job.durationMinutes)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 line-clamp-3 break-words">{job.desc}</p>
                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
                    <div className="flex flex-wrap gap-2 items-center max-w-full">
                      <Badge className="truncate bg-gray-200 text-gray-700 px-2 py-0.5 text-xs">{job.category}</Badge>
                      <Badge variant="outline" className="truncate px-2 py-0.5 text-xs">{job.areaName}</Badge>
                      {dist && <span className="text-xs text-gray-400">{dist}</span>}
                    </div>
                    <div className="ml-0 sm:ml-auto w-full sm:w-auto">
                      <Button
                        className="w-full sm:w-auto rounded-lg"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); apply(job.id); }}
                        disabled={appliedJobIds.has(job.id) || !isLoggedIn}
                        title={!isLoggedIn ? "Du må være innlogget for å søke" : ""}
                      >
                        {appliedJobIds.has(job.id)
                          ? "Allerede sendt"
                          : !isLoggedIn
                          ? "Logg inn for å søke"
                          : "Søk"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      <JobDetailsDialog
        open={!!openJob}
        onOpenChange={(v) => !v && setOpenJob(null)}
        job={openJob}
        onApply={openJob ? () => apply(openJob.id) : undefined}
      />
    </div>
  );
}