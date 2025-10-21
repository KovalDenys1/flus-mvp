"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Job = {
  id: string;
  title: string;
  category: string;
  payNok: number;
  paymentType: "fixed" | "hourly";
  status: string;
  areaName: string;
  scheduleType: "flexible" | "deadline" | "fixed";
  createdAt: string;
};

export default function MyJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMyJobs() {
      try {
        const res = await fetch("/api/my-jobs");
        if (!res.ok) {
          if (res.status === 401) {
            setError("Du må være innlogget som arbeidsgiver for å se denne siden.");
            return;
          }
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        setJobs(data.jobs || []);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        setError(`Kunne ikke laste jobber: ${msg}`);
      } finally {
        setLoading(false);
      }
    }
    fetchMyJobs();
  }, []);

  const getScheduleLabel = (type: string) => {
    switch (type) {
      case "flexible": return "🕐 Fleksibel";
      case "deadline": return "📅 Frist";
      case "fixed": return "⏰ Fast tid";
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-green-100 text-green-700";
      case "in_progress": return "bg-blue-100 text-blue-700";
      case "completed": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4">
        <div className="text-center py-20">Laster...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold mb-2 text-red-600">Feil</h3>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Mine jobber</h1>
          <p className="text-gray-600 mt-1">Administrer jobbene du har publisert</p>
        </div>
        <Link
          href="/jobber/ny"
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold"
        >
          + Ny jobb
        </Link>
      </div>

      {jobs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold mb-2">Ingen jobber ennå</h3>
            <p className="text-gray-600 mb-6">
              Du har ikke publisert noen jobber ennå. Kom i gang ved å opprette din første jobb!
            </p>
            <Link
              href="/jobber/ny"
              className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold"
            >
              Opprett første jobb
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge variant="outline">{job.category}</Badge>
                      <Badge className={getStatusColor(job.status)}>
                        {job.status === "open" ? "Åpen" : job.status === "in_progress" ? "Pågår" : "Fullført"}
                      </Badge>
                      <span className="text-sm text-gray-500">📍 {job.areaName}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {job.payNok} kr
                    </div>
                    <div className="text-xs text-gray-500">
                      {job.paymentType === "hourly" ? "per time" : "fast pris"}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>{getScheduleLabel(job.scheduleType)}</span>
                    <span>•</span>
                    <span>Opprettet {new Date(job.createdAt).toLocaleDateString('no-NO')}</span>
                  </div>
                  <Link
                    href={`/jobber/${job.id}`}
                    className="text-orange-600 hover:text-orange-700 font-semibold text-sm"
                  >
                    Se detaljer →
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
