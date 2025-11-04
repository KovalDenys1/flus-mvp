"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AuthGuard from "@/components/AuthGuard";
import ReviewDialog from "@/components/ReviewDialog";

type Job = {
  id: string;
  title: string;
  desc: string;
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
  durationMinutes: number;
  address?: string;
  startTime?: string;
  endTime?: string;
  requirements?: string;
};

export default function MyJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<{ jobId: string; workerId: string; workerName: string } | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ jobId: string; jobTitle: string } | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Job | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "",
    payNok: "",
    durationMinutes: "",
    areaName: "",
    address: "",
    scheduleType: "flexible" as "flexible" | "fixed" | "deadline",
    startTime: "",
    endTime: "",
    paymentType: "fixed" as "fixed" | "hourly",
    requirements: "",
  });

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
      case "in_progress": return "bg-secondary/10 text-secondary";
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

  const openDeleteDialog = (jobId: string, jobTitle: string) => {
    console.log("openDeleteDialog called with:", { jobId, jobTitle });
    setDeleteTarget({ jobId, jobTitle });
    setDeleteDialogOpen(true);
    console.log("After setting state - deleteTarget:", { jobId, jobTitle }, "deleteDialogOpen:", true);
  };

  const handleDeleteJob = async () => {
    if (!deleteTarget) {
      console.error("No delete target");
      return;
    }

    console.log("Deleting job:", deleteTarget.jobId, deleteTarget.jobTitle);

    try {
      const res = await fetch(`/api/my-jobs/${deleteTarget.jobId}`, {
        method: "DELETE",
      });

      console.log("Delete response status:", res.status);

      if (!res.ok) {
        const error = await res.json();
        console.error("Delete error:", error);
        throw new Error(error.error || "Kunne ikke slette jobb");
      }

      // Remove job from state
      setJobs(prev => prev.filter(job => job.id !== deleteTarget.jobId));
      toast.success(`Jobb "${deleteTarget.jobTitle}" slettet`);
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Kunne ikke slette jobb");
    }
  };

  const openEditDialog = (job: Job) => {
    setEditTarget(job);
    setEditForm({
      title: job.title,
      description: job.desc,
      category: job.category,
      payNok: job.payNok.toString(),
      durationMinutes: job.durationMinutes.toString(),
      areaName: job.areaName,
      address: job.address || "",
      scheduleType: job.scheduleType || "flexible",
      startTime: job.startTime || "",
      endTime: job.endTime || "",
      paymentType: job.paymentType || "fixed",
      requirements: job.requirements || "",
    });
    setEditDialogOpen(true);
  };

  const handleEditJob = async () => {
    if (!editTarget) return;

    try {
      const updates = {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        category: editForm.category,
        pay_nok: parseInt(editForm.payNok),
        duration_minutes: parseInt(editForm.durationMinutes),
        area_name: editForm.areaName,
        address: editForm.address.trim() || null,
        schedule_type: editForm.scheduleType,
        start_time: editForm.startTime || null,
        end_time: editForm.endTime || null,
        payment_type: editForm.paymentType,
        requirements: editForm.requirements.trim() || null,
      };

      const res = await fetch(`/api/my-jobs/${editTarget.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Kunne ikke oppdatere jobb");
      }

      const data = await res.json();
      
      // Update job in state
      setJobs(prev => prev.map(job => 
        job.id === editTarget.id ? {
          ...job,
          title: data.job.title,
          desc: data.job.desc,
          category: data.job.category,
          payNok: data.job.payNok,
          durationMinutes: data.job.durationMinutes,
          areaName: data.job.areaName,
          address: data.job.address,
          scheduleType: data.job.scheduleType,
          startTime: data.job.startTime,
          endTime: data.job.endTime,
          paymentType: data.job.paymentType,
          requirements: data.job.requirements,
        } : job
      ));

      toast.success("Jobb oppdatert!");
      setEditDialogOpen(false);
      setEditTarget(null);
    } catch (error) {
      console.error("Error updating job:", error);
      toast.error("Kunne ikke oppdatere jobb");
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Mine jobber</h1>
            <p className="text-lg text-gray-600">Administrer jobbene du har publisert</p>
          </div>
        </div>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="h-7 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="flex gap-2 mb-2">
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="h-8 bg-gray-200 rounded w-20 mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-16 text-center">
            <div className="text-8xl mb-6">⚠️</div>
            <h3 className="text-2xl font-bold text-red-900 mb-3">Feil</h3>
            <p className="text-red-700 mb-6 max-w-md mx-auto">{error}</p>
            <p className="text-sm text-red-600">
              Det kan hende du ikke er logget inn som arbeidsgiver.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AuthGuard requireAuth={true}>
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Mine jobber</h1>
            <p className="text-lg text-gray-600">Administrer jobbene du har publisert</p>
          </div>
          <Link
            href="/jobber/ny"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary text-white rounded-xl hover:from-primary hover:to-primary transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <span className="text-xl">+</span>
            Ny jobb
          </Link>
        </div>

        {jobs.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50 to-white">
            <CardContent className="py-16 text-center">
              <div className="text-8xl mb-6">📋</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Ingen jobber ennå</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                Du har ikke publisert noen jobber ennå. Kom i gang ved å opprette din første jobb og finn kvalifiserte arbeidere!
              </p>
              <Link
                href="/jobber/ny"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-primary text-white rounded-xl hover:from-primary hover:to-primary transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
              >
                <span className="text-2xl">+</span>
                Opprett første jobb
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {jobs.map((job) => (
              <Link key={job.id} href={`/jobber/${job.id}`}>
                <Card className="hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 cursor-pointer border-l-4 border-l-transparent hover:border-l-primary bg-gradient-to-r from-white to-primary/5">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-gray-900 hover:text-primary transition-colors">{job.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">{job.category}</Badge>
                        <Badge className={`${getStatusColor(job.status)} font-medium`}>
                          {job.status === "open" ? "Åpen" : job.status === "in_progress" ? "Pågår" : "Fullført"}
                        </Badge>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <span>📍</span>
                          {job.areaName}
                        </span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        {job.payNok} kr
                      </div>
                      <div className="text-sm text-gray-500 font-medium">
                        {job.paymentType === "hourly" ? "per time" : "fast pris"}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                        {getScheduleLabel(job.scheduleType)}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500">
                        Opprettet {new Date(job.createdAt).toLocaleDateString('no-NO')}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      {job.status === "completed" && job.selectedWorker && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openReviewDialog(job.id, job.selectedWorker!.id, job.selectedWorker!.navn);
                          }}
                          className="text-green-600 border-green-300 hover:bg-green-50 hover:border-green-400 transition-colors font-medium"
                        >
                          ⭐ Gi vurdering
                        </Button>
                      )}
                      {job.status === "open" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              openEditDialog(job);
                            }}
                            className="text-secondary border-secondary/30 hover:bg-secondary/5 hover:border-secondary/40 transition-colors font-medium"
                          >
                            ✏️ Rediger
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log("Delete button clicked for job:", job.id, job.title);
                              openDeleteDialog(job.id, job.title);
                            }}
                            className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 transition-colors font-medium"
                          >
                            🗑️ Slett jobb
                          </Button>
                        </>
                      )}
                        <span className="text-primary hover:text-primary font-semibold text-sm flex items-center gap-1 transition-colors">
                          Se detaljer
                          <span className="text-lg">→</span>
                        </span>
                    </div>
                  </div>
                </CardContent>
                </Card>
              </Link>
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

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => {
          setDeleteDialogOpen(false);
          setDeleteTarget(null);
        }}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Bekreft sletting</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 font-medium mb-2">Du er i ferd med å slette:</p>
                <p className="text-red-900 font-semibold text-lg">&ldquo;{deleteTarget.jobTitle}&rdquo;</p>
                <p className="text-red-700 text-sm mt-2">Denne handlingen kan ikke angres.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    console.log("Cancel delete clicked");
                    setDeleteDialogOpen(false);
                    setDeleteTarget(null);
                  }}
                  className="flex-1 px-6 py-3 text-gray-700 border-gray-300 hover:bg-gray-50 font-medium"
                >
                  Avbryt
                </Button>
                <Button
                  onClick={() => {
                    console.log("Delete job button clicked");
                    handleDeleteJob();
                  }}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={!deleteTarget}
                >
                  🗑️ Slett jobb
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Job Dialog */}
      {editDialogOpen && editTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => {
          setEditDialogOpen(false);
          setEditTarget(null);
        }}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Rediger jobb</h3>
                <button
                  onClick={() => {
                    setEditDialogOpen(false);
                    setEditTarget(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jobbtittel</label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Beskrivelse</label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                    <input
                      type="text"
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Betaling (NOK)</label>
                      <input
                        type="number"
                        value={editForm.payNok}
                        onChange={(e) => setEditForm({ ...editForm, payNok: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Varighet (minutter)</label>
                      <input
                        type="number"
                        value={editForm.durationMinutes}
                        onChange={(e) => setEditForm({ ...editForm, durationMinutes: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Område</label>
                    <input
                      type="text"
                      value={editForm.areaName}
                      onChange={(e) => setEditForm({ ...editForm, areaName: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                    <input
                      type="text"
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Starttid</label>
                      <input
                        type="time"
                        value={editForm.startTime}
                        onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sluttid</label>
                      <input
                        type="time"
                        value={editForm.endTime}
                        onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Krav til arbeidstaker</label>
                    <textarea
                      value={editForm.requirements}
                      onChange={(e) => setEditForm({ ...editForm, requirements: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditDialogOpen(false);
                    setEditTarget(null);
                  }}
                  className="flex-1 px-6 order-2 sm:order-1"
                >
                  Avbryt
                </Button>
                <Button
                  onClick={handleEditJob}
                  className="flex-1 px-6 bg-secondary hover:bg-secondary text-white order-1 sm:order-2"
                >
                  Oppdater jobb
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AuthGuard>
  );
}
