"use client";

import { useEffect, useState } from "react";
import { minutesToHhMm } from "../../lib/utils/format";

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

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Jobber</h1>

      {loading && <div>Henter jobber…</div>}
      {error && <div className="text-red-600">Feil: {error}</div>}

      <ul className="space-y-3">
        {jobs.map((j) => (
          <li key={j.id} className="border rounded p-3">
            <div className="font-medium">{j.title}</div>
            <div className="text-sm text-gray-600">
              {j.category} • {j.areaName} • {minutesToHhMm(j.durationMinutes)} •{" "}
              {j.payNok} NOK
            </div>
            <p className="mt-2 text-sm">{j.desc}</p>
            <button className="mt-2 border rounded px-3 py-1">Søk</button>
          </li>
        ))}
      </ul>

      {!loading && !error && jobs.length === 0 && (
        <div className="text-gray-500">Ingen jobber tilgjengelig.</div>
      )}
    </div>
  );
}