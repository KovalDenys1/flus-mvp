"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { minutesToHhMm } from "@/lib/utils/format";
import { googleMapsEmbedUrl } from "@/lib/utils/map";
import ReviewDialog from "@/components/ReviewDialog";

export type Job = {
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
  status: "open" | "closed" | "assigned" | "completed";
  address?: string;
  scheduleType?: "flexible" | "fixed" | "deadline";
  startTime?: string;
  endTime?: string;
  paymentType?: "fixed" | "hourly";
  requirements?: string;
  employerId?: string;
  selectedWorkerId?: string;
};

type Application = {
  id: string;
  workerId: string;
  status: "sendt" | "godkjent" | "avvist";
  createdAt: string;
  worker?: {
    id: string;
    navn?: string;
    email: string;
    telefon?: string;
  };
};

type User = {
  id: string;
  email: string;
  role: string;
};

export default function JobDetailClient({ job }: { job?: Job | null }) {
  const router = useRouter();
  const [applying, setApplying] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    // Load user info
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user || null))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (job && user && (user.role === "employer" || user.role === "both")) {
      // Load applications for employers
      setLoadingApplications(true);
      fetch(`/api/jobs/${job.id}/applications`)
        .then((r) => r.json())
        .then((d) => setApplications(d.applications || []))
        .catch(() => setApplications([]))
        .finally(() => setLoadingApplications(false));
    }
  }, [job, user]);

  if (!job) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-3xl">⚠️</span>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-red-900 mb-2">Jobben ikke funnet</h2>
              <p className="text-red-700 mb-4">
                Denne jobben kunne ikke lastes. Dette skjer vanligvis hvis:
              </p>
              <ul className="list-disc list-inside text-red-700 space-y-1 text-sm">
                <li>Supabase-databasen ikke er satt opp ennå</li>
                <li>Jobben ble slettet</li>
                <li>Du har ikke tillatelse til å se denne jobben</li>
              </ul>
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800">
                  <strong>⚡ Hurtigløsning:</strong> Hvis du er utvikler, kjør SQL-migrasjonene i Supabase.
                  Se <code className="bg-yellow-100 px-1 py-0.5 rounded">SUPABASE_SETUP.md</code> for instruksjoner.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <Link href="/jobber" className="inline-block px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
            ← Tilbake til jobber
          </Link>
        </div>
      </div>
    );
  }

  const handleApply = async () => {
    setApplying(true);
    try {
      // First create/find conversation
      const convRes = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.id }),
      });

      if (!convRes.ok) {
        const convData = await convRes.json();
        throw new Error(convData.error || "Could not create conversation");
      }

      const convData = await convRes.json();
      router.push(`/samtaler/${convData.conversation.id}`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(msg);
    } finally {
      setApplying(false);
    }
  };

  const handleSelectCandidate = async (applicationId: string) => {
    try {
      const res = await fetch(`/api/jobs/${job!.id}/select-candidate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId }),
      });

      if (res.ok) {
        toast.success("Kandidat valgt! Arbeidet er nå tilordnet.");
        // Reload applications
        const appsRes = await fetch(`/api/jobs/${job!.id}/applications`);
        if (appsRes.ok) {
          const data = await appsRes.json();
          setApplications(data.applications || []);
        }
      } else {
        const error = await res.json();
        toast.error(`Feil: ${error.error}`);
      }
    } catch (error) {
      console.error("Select candidate error:", error);
      toast.error("Kunne ikke velge kandidat");
    }
  };

  const handleReviewSubmit = async (rating: number, comment: string) => {
    if (!reviewTarget) return;

    const res = await fetch("/api/profile/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reviewee_id: reviewTarget.id,
        job_id: job!.id,
        rating,
        comment,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Kunne ikke sende vurdering");
    }
  };

  const openReviewDialog = (targetId: string, targetName: string) => {
    setReviewTarget({ id: targetId, name: targetName });
    setReviewDialogOpen(true);
  };

  const mapSrc = googleMapsEmbedUrl(job.lat, job.lng, job.title);

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("no-NO", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getScheduleLabel = () => {
    if (job.scheduleType === "flexible") return "🕐 Fleksibel";
    if (job.scheduleType === "fixed") return "⏰ Fast tid";
    if (job.scheduleType === "deadline") return "📅 Frist";
    return "🕐 Fleksibel";
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-2 space-y-4">
      <h1 className="text-2xl font-bold">{job.title}</h1>
      <div className="text-sm text-gray-600">{job.areaName} • {job.category}</div>
      
      {/* Payment and Duration */}
      <div className="flex gap-3 flex-wrap">
        <div className="px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
          <span className="text-sm font-semibold text-green-700">{job.payNok} NOK</span>
          {job.paymentType === "hourly" && <span className="text-xs text-green-600"> /time</span>}
        </div>
        <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-sm text-blue-700">⏱️ {minutesToHhMm(job.durationMinutes)}</span>
        </div>
        <div className="px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg">
          <span className="text-sm text-purple-700">{getScheduleLabel()}</span>
        </div>
      </div>

      {/* Address */}
      {job.address && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <span className="text-lg">📍</span>
            <div>
              <div className="text-xs text-gray-500 uppercase font-semibold">Sted</div>
              <div className="text-sm text-gray-900">{job.address}</div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Information */}
      {(job.startTime || job.endTime) && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="text-xs text-amber-700 uppercase font-semibold mb-1">Tidspunkt</div>
          {job.startTime && (
            <div className="text-sm text-amber-900">
              <span className="font-medium">Start:</span> {formatDateTime(job.startTime)}
            </div>
          )}
          {job.endTime && (
            <div className="text-sm text-amber-900">
              <span className="font-medium">{job.scheduleType === "deadline" ? "Frist:" : "Slutt:"}</span> {formatDateTime(job.endTime)}
            </div>
          )}
        </div>
      )}

      {/* Requirements */}
      {job.requirements && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-xs text-blue-700 uppercase font-semibold mb-1">Krav</div>
          <p className="text-sm text-blue-900 leading-relaxed">{job.requirements}</p>
        </div>
      )}

      {/* Description */}
      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Beskrivelse</div>
        <p className="text-sm leading-relaxed whitespace-pre-line text-gray-900">{job.desc}</p>
      </div>

      {/* Applications section for employers */}
      {user && (user.role === "employer" || user.role === "both") && (
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <div className="text-xs text-gray-500 uppercase font-semibold mb-3">Søknader</div>
          {loadingApplications ? (
            <div className="text-center py-4">
              <div className="animate-pulse text-gray-500">Laster søknader...</div>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <p>Ingen søknader ennå</p>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <div key={app.id} className="border border-gray-100 rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {app.worker?.navn || "Ukjent navn"}
                      </div>
                      <div className="text-xs text-gray-600">
                        {app.worker?.email}
                        {app.worker?.telefon && ` • ${app.worker.telefon}`}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Søkte {new Date(app.createdAt).toLocaleDateString('no-NO')}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {app.status === "sendt" && job.status === "open" && (
                        <button
                          onClick={() => handleSelectCandidate(app.id)}
                          className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition"
                        >
                          Velg kandidat
                        </button>
                      )}
                      <div className={`px-2 py-1 rounded text-xs ${
                        app.status === "godkjent" ? "bg-green-100 text-green-700" :
                        app.status === "avvist" ? "bg-red-100 text-red-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {app.status === "godkjent" ? "Godkjent" :
                         app.status === "avvist" ? "Avvist" : "Sendt"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Map */}
      <div className="aspect-video w-full overflow-hidden rounded-lg border shadow-sm">
        <iframe src={mapSrc} className="h-full w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Map" />
      </div>
      {/* Review section for completed jobs */}
      {job.status === "completed" && user && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-green-800">🎉 Arbeid fullført!</h3>
              <p className="text-sm text-green-700 mt-1">
                {user.role === "employer" || user.role === "both"
                  ? "Hvordan var samarbeidet med arbeidstakeren?"
                  : "Hvordan var samarbeidet med arbeidsgiveren?"
                }
              </p>
            </div>
            <button
              onClick={() => {
                if (user.role === "employer" || user.role === "both") {
                  // Employer reviewing worker
                  openReviewDialog(job.selectedWorkerId!, "arbeidstakeren");
                } else {
                  // Worker reviewing employer
                  openReviewDialog(job.employerId!, "arbeidsgiveren");
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-sm"
            >
              Gi vurdering
            </button>
          </div>
        </div>
      )}

      {/* Review Dialog */}
      <ReviewDialog
        isOpen={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
        onSubmit={handleReviewSubmit}
        title="Gi vurdering"
        submitButtonText="Send vurdering"
        revieweeName={reviewTarget?.name || ""}
      />

      <div className="w-full flex flex-col sm:flex-row gap-3 mt-4">
        <Link
          href="/jobber"
          className="flex-1 px-6 py-2 rounded-lg border border-orange-300 text-orange-700 text-base font-medium shadow hover:bg-orange-100 transition flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
        >
          ← Tilbake
        </Link>
        {user && (user.role === "employer" || user.role === "both") ? (
          <Link
            href={`/mine-jobber`}
            className="flex-1 px-6 py-2 rounded-lg bg-blue-500 text-white text-base font-medium shadow hover:bg-blue-600 transition flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Se mine jobber
          </Link>
        ) : (
          <button
            onClick={handleApply}
            disabled={applying}
            className="flex-1 px-6 py-2 rounded-lg bg-orange-500 text-white text-base font-medium shadow hover:bg-orange-600 transition focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 disabled:bg-orange-300"
          >
            {applying ? "Starter samtale..." : "Søk"}
          </button>
        )}
      </div>
    </div>
  );
}
