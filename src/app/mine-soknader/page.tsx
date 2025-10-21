"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Application = {
  id: string;
  jobId: string;
  workerId: string;
  status: "sendt" | "godkjent" | "avvist";
  createdAt: string;
};

type Job = {
  id: string;
  title: string;
  desc: string;
  category: string;
  payNok: number;
  areaName: string;
  scheduleType?: string;
  paymentType?: string;
};

export default function MineSoknaderPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Record<string, Job>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [appsRes, jobsRes] = await Promise.all([
          fetch("/api/applications"),
          fetch("/api/jobs"),
        ]);

        if (!appsRes.ok || !jobsRes.ok) {
          throw new Error("Kunne ikke laste data");
        }

        const appsData = await appsRes.json();
        const jobsData = await jobsRes.json();

        setApplications(appsData.applications || []);

        const jobsMap: Record<string, Job> = {};
        (jobsData.jobs || []).forEach((job: Job) => {
          jobsMap[job.id] = job;
        });
        setJobs(jobsMap);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sendt": return "bg-blue-100 text-blue-700";
      case "godkjent": return "bg-green-100 text-green-700";
      case "avvist": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "sendt": return "Sendt";
      case "godkjent": return "Godkjent";
      case "avvist": return "Avvist";
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Mine søknader</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Mine søknader</h1>
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
      <h1 className="text-3xl font-bold mb-6">Mine søknader</h1>
      
      {applications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">Ingen søknader ennå</h3>
            <p className="text-gray-600 mb-6">
              Når du søker på jobber, vil de vises her.
            </p>
            <Link
              href="/jobber"
              className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold"
            >
              Se ledige jobber
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const job = jobs[app.jobId];
            return (
              <Card key={app.id} className="hover:shadow-md transition">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">
                        {job?.title || `Jobb #${app.jobId}`}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {job?.category && <Badge variant="outline">{job.category}</Badge>}
                        <Badge className={getStatusColor(app.status)}>
                          {getStatusText(app.status)}
                        </Badge>
                        {job?.areaName && <span className="text-sm text-gray-500">📍 {job.areaName}</span>}
                      </div>
                    </div>
                    {job && (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {job.payNok} kr
                        </div>
                        {job.paymentType && (
                          <div className="text-xs text-gray-500">
                            {job.paymentType === "hourly" ? "per time" : "fast pris"}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {job?.desc && (
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">{job.desc}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Søkte {new Date(app.createdAt).toLocaleDateString('no-NO', { 
                        day: 'numeric', 
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                    <Link
                      href={`/jobber/${app.jobId}`}
                      className="text-orange-600 hover:text-orange-700 font-semibold text-sm"
                    >
                      Se detaljer →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
