"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AuthGuard from "@/components/AuthGuard";
import ReviewDialog from "@/components/ReviewDialog";

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
  selectedWorkerId?: string;
  selectedWorker?: {
    id: string;
    navn: string;
    email: string;
  };
};

export default function MyJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<{ jobId: string; workerId: string; workerName: string } | null>(null);

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

  const handleReviewSubmit = async (rating: number, comment: string) => {
    if (!reviewTarget) return;

    const res = await fetch("/api/profile/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reviewee_id: reviewTarget.workerId,
        job_id: reviewTarget.jobId,
        rating,
        comment,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Kunne ikke sende vurdering");
    }
  };

  const openReviewDialog = (jobId: string, workerId: string, workerName: string) => {
    setReviewTarget({ jobId, workerId, workerName });
    setReviewDialogOpen(true);
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
    <AuthGuard requireAuth={true}>
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
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
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
                    <div className="text-left sm:text-right">
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
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span>{getScheduleLabel(job.scheduleType)}</span>
                      <span>•</span>
                      <span>Opprettet {new Date(job.createdAt).toLocaleDateString('no-NO')}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      {job.status === "completed" && job.selectedWorker && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openReviewDialog(job.id, job.selectedWorker!.id, job.selectedWorker!.navn)}
                          className="text-green-600 border-green-300 hover:bg-green-50"
                        >
                          Gi vurdering
                        </Button>
                      )}
                      <Link
                        href={`/jobber/${job.id}`}
                        className="text-orange-600 hover:text-orange-700 font-semibold text-sm"
                      >
                        Se detaljer →
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Review Dialog */}
      <ReviewDialog
        isOpen={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
        onSubmit={handleReviewSubmit}
        title="Vurder arbeidstaker"
        submitButtonText="Send vurdering"
        revieweeName={reviewTarget?.workerName || ""}
      />
    </AuthGuard>
  );
}
