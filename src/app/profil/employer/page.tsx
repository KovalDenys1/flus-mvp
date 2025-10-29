"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Star, Briefcase, TrendingUp, ExternalLink, ArrowLeft, Trash2 } from "lucide-react";

type User = {
  id: string;
  email: string;
  role: string;
  navn?: string;
  kommune?: string;
  telefon?: string;
  bio?: string;
  company_name?: string;
  company_org_number?: string;
  website_url?: string;
  profile_image_url?: string;
};

type Stats = {
  role: string;
  // Employer stats
  totalJobsCreated: number;
  activeJobs: number;
  completedJobs: number;
  totalApplicationsReceived: number;
  acceptedApplications: number;
  // Worker stats (for both roles)
  totalApplicationsSent: number;
  acceptedJobs: number;
  completedJobsWorker: number;
  totalEarnings: number;
  // Common stats
  totalReviews: number;
  averageRating: number;
};

type Review = {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer: {
    id: string;
    navn: string;
  };
};

type Job = {
  id: string;
  title: string;
  category: string;
  payNok: number;
  status: "open" | "assigned" | "completed" | "cancelled";
  areaName: string;
  createdAt: string;
  selectedWorkerId?: string;
  applicationsCount?: number;
};

type Application = {
  id: string;
  jobId: string;
  workerId: string;
  status: "pending" | "accepted" | "rejected" | "completed" | "approved";
  createdAt: string;
  updatedAt?: string;
  worker: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    bio?: string;
    skills?: string[];
    rating?: number;
    completedJobs?: number;
  } | null;
};

export default function EmployerProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [selectedJobApplications, setSelectedJobApplications] = useState<Application[]>([]);
  const [jobApplicationsById, setJobApplicationsById] = useState<Record<string, Application[]>>({});
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  
  const [profileForm, setProfileForm] = useState({
    navn: "",
    bio: "",
    telefon: "",
    kommune: "",
    website_url: "",
  });

  useEffect(() => {
    loadProfile();

    // Check if we need to refresh stats (e.g., after creating a new job)
    if (typeof window !== 'undefined') {
      const shouldRefresh = sessionStorage.getItem('refreshEmployerStats');
      if (shouldRefresh === 'true') {
        sessionStorage.removeItem('refreshEmployerStats');
        // Stats will be refreshed by loadProfile() above
      }
    }

    // Listen for viewMode changes from Navbar
    const handleViewModeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ viewMode: "worker" | "employer" }>;
      if (customEvent.detail?.viewMode === "worker") {
        // User switched to worker mode, redirect to worker profile
        router.push("/profil/worker");
      }
    };

    window.addEventListener("viewModeChanged", handleViewModeChange);

    // Setup realtime notifications for new applications
    const supabase = getSupabaseBrowser();
    const channel = supabase
      .channel('applications-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'applications'
      }, async (payload) => {
        if (!user) return;
        const application = payload.new as any;
        // Fetch job to check if it's for this employer
        const { data: job } = await supabase
          .from('jobs')
          .select('employer_id, title')
          .eq('id', application.job_id)
          .single();
        
        if (job?.employer_id === user.id) {
          toast.success(`Ny søknad på "${job.title}"!`);
          // Reload applications
          loadProfile();
        }
      })
      .subscribe();

    return () => {
      window.removeEventListener("viewModeChanged", handleViewModeChange);
      supabase.removeChannel(channel);
    };
  }, [router, user]);

  const loadProfile = async () => {
    try {
      setLoading(true);

      // Get user info
      const userRes = await fetch("/api/auth/me");
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData.user);
        setProfileForm({
          navn: userData.user.navn || "",
          bio: userData.user.bio || "",
          telefon: userData.user.telefon || "",
          kommune: userData.user.kommune || "",
          website_url: userData.user.website_url || "",
        });
      }

      // Get statistics
      const statsRes = await fetch("/api/profile/stats");
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }

      // Get reviews
      const reviewsRes = await fetch("/api/profile/reviews");
      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData.reviews || []);
      }

      // Get recent jobs
      const jobsRes = await fetch("/api/my-jobs");
      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        const jobs = (jobsData.jobs || []).slice(0, 5);
        setRecentJobs(jobs);

        // Load applications for open jobs
        const openJobs = jobs.filter((job: Job) => job.status === "open");
        for (const job of openJobs) {
          const appsRes = await fetch(`/api/jobs/${job.id}/applications`);
          if (appsRes.ok) {
            const appsData = await appsRes.json();
            setJobApplicationsById(prev => ({ ...prev, [job.id]: appsData.applications || [] }));
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async (jobId: string) => {
    try {
      setLoadingApplications(true);
      const res = await fetch(`/api/jobs/${jobId}/applications`);
      if (res.ok) {
        const data = await res.json();
        setSelectedJobApplications(data.applications || []);
        setSelectedJobId(jobId);
      }
    } catch (err) {
      console.error("Feil ved lasting av søknader:", err);
    } finally {
      setLoadingApplications(false);
    }
  };

  const selectCandidate = async (jobId: string, workerId: string) => {
    try {
      const res = await fetch(`/api/jobs/${jobId}/select-candidate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workerId }),
      });

      if (res.ok) {
        // Reload jobs and applications
        loadProfile();
        if (selectedJobId === jobId) {
          loadApplications(jobId);
        }
      } else {
        const error = await res.json();
        alert(`Feil: ${error.error}`);
      }
    } catch (err) {
      console.error("Feil ved valg av kandidat:", err);
      alert("Det oppstod en feil ved valg av kandidat");
    }
  };

  const saveProfile = async () => {
    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });

      if (res.ok) {
        setEditMode(false);
        loadProfile();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteJob = async (jobId: string) => {
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Jobben ble slettet");
        setDeleteDialogOpen(false);
        setJobToDelete(null);
        // Set flag to refresh stats on other pages
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('refreshEmployerStats', 'true');
        }
        loadProfile(); // Reload jobs
      } else {
        const error = await res.json();
        toast.error(`Feil: ${error.error}`);
      }
    } catch (err) {
      console.error("Feil ved sletting av jobb:", err);
      toast.error("Kunne ikke slette jobben");
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("no-NO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto mt-10 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 space-y-6">
      {/* Back to main profile */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <button 
          onClick={() => router.push("/profil")}
          className="flex items-center gap-1 hover:text-gray-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Tilbake
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Min profil - Arbeidsgiver</h1>
          <p className="text-gray-600 mt-1">Se og rediger din profil som arbeidsgiver</p>
        </div>
        <Button onClick={() => setEditMode(!editMode)} variant={editMode ? "outline" : "default"}>
          {editMode ? "Avbryt" : "Rediger"}
        </Button>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Kontaktinformasjon
          </CardTitle>
        </CardHeader>
        <CardContent>
          {editMode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Navn</label>
                <Input
                  value={profileForm.navn}
                  onChange={(e) => setProfileForm({ ...profileForm, navn: e.target.value })}
                  placeholder="Ditt fulle navn"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kort om deg</label>
                <Textarea
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  placeholder="Fortell litt om deg selv og hva slags jobber du trenger hjelp med..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Telefon</label>
                  <Input
                    value={profileForm.telefon}
                    onChange={(e) => setProfileForm({ ...profileForm, telefon: e.target.value })}
                    placeholder="+47 123 45 678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Kommune</label>
                  <Input
                    value={profileForm.kommune}
                    onChange={(e) => setProfileForm({ ...profileForm, kommune: e.target.value })}
                    placeholder="Oslo"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nettside (valgfritt)</label>
                <Input
                  value={profileForm.website_url}
                  onChange={(e) => setProfileForm({ ...profileForm, website_url: e.target.value })}
                  placeholder="https://dinnettside.no"
                />
              </div>
              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                <strong>Tips:</strong> Som privatperson trenger du ikke organisasjonsnummer. 
                Vi anbefaler å legge til en kort beskrivelse av deg selv og hva slags hjelp du trenger.
              </div>
              <Button onClick={saveProfile} className="w-full">
                Lagre endringer
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <strong>Navn:</strong> {user?.navn || "Ikke oppgitt"}
                </div>
                {user?.bio && (
                  <div>
                    <strong>Om meg:</strong>
                    <p className="text-gray-700 mt-1">{user.bio}</p>
                  </div>
                )}
                <div>
                  <strong>E-post:</strong> {user?.email}
                </div>
                <div>
                  <strong>Telefon:</strong> {user?.telefon || "Ikke oppgitt"}
                </div>
                <div>
                  <strong>Kommune:</strong> {user?.kommune || "Ikke oppgitt"}
                </div>
                
                {user?.website_url && (
                  <div className="mt-3">
                    <a
                      href={user.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Besøk nettside
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Statistikk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{stats.totalJobsCreated}</div>
                <div className="text-sm text-gray-600 mt-1">Jobber opprettet</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{stats.activeJobs}</div>
                <div className="text-sm text-gray-600 mt-1">Aktive jobber</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">{stats.completedJobs}</div>
                <div className="text-sm text-gray-600 mt-1">Fullførte jobber</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-3xl font-bold text-orange-600">{stats.totalApplicationsReceived}</div>
                <div className="text-sm text-gray-600 mt-1">Søknader mottatt</div>
              </div>
              <div className="text-center p-4 bg-teal-50 rounded-lg">
                <div className="text-3xl font-bold text-teal-600">{stats.acceptedApplications}</div>
                <div className="text-sm text-gray-600 mt-1">Godkjente søknader</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600 flex items-center justify-center gap-1">
                  {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "—"}
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="text-sm text-gray-600 mt-1">{stats.totalReviews} anmeldelser</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Jobs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Siste jobber
          </CardTitle>
          <Link href="/mine-jobber">
            <Button variant="outline" size="sm">Se alle</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentJobs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Ingen jobber opprettet ennå.</p>
              <Link href="/jobber/ny">
                <Button>Opprett første jobb</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobber/${job.id}`}
                  className="block border rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{job.title}</h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                        <Badge variant="outline" className="text-xs">{job.category}</Badge>
                        <span>•</span>
                        <span>{job.areaName}</span>
                        <span>•</span>
                        <span>{formatDate(job.createdAt)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">{job.payNok} kr</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={job.status === "open" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {job.status === "open" ? "Åpen" : 
                           job.status === "assigned" ? "Tildelt" : 
                           job.status === "completed" ? "Fullført" : "Avbrutt"}
                        </Badge>
                        {job.status === "open" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              setJobToDelete(job);
                              setDeleteDialogOpen(true);
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Job Applications Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Søknadsadministrasjon
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentJobs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Ingen jobber å administrere.</p>
              <Link href="/jobber/ny">
                <Button>Opprett jobb</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentJobs.filter(job => job.status === "open").map((job) => (
                <div key={job.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold">{job.title}</h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                        <Badge variant="outline" className="text-xs">{job.category}</Badge>
                        <span>•</span>
                        <span>{job.areaName}</span>
                        <span>•</span>
                        <span>{job.payNok} kr</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => loadApplications(job.id)}
                        variant="outline"
                        size="sm"
                      >
                        Se søknader ({jobApplicationsById[job.id]?.length || 0})
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setJobToDelete(job);
                          setDeleteDialogOpen(true);
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {selectedJobId === job.id && (
                    <div className="mt-4 space-y-3">
                      <h4 className="font-medium text-sm">Søknader:</h4>
                      {loadingApplications ? (
                        <div className="text-center py-4">Laster søknader...</div>
                      ) : selectedJobApplications.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">
                          Ingen søknader ennå
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {selectedJobApplications.map((application) => (
                            <div key={application.id} className="border rounded p-3 bg-gray-50">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-medium">
                                      {application.worker?.name || "Ukjent bruker"}
                                    </span>
                                    <Badge
                                      variant={
                                        application.status === "pending" ? "default" :
                                        application.status === "accepted" ? "default" :
                                        application.status === "approved" ? "default" :
                                        application.status === "rejected" ? "destructive" : "secondary"
                                      }
                                      className="text-xs"
                                    >
                                      {application.status === "pending" ? "Sendt" :
                                       application.status === "accepted" ? "Akseptert" :
                                       application.status === "approved" ? "Godkjent" :
                                       application.status === "rejected" ? "Avslått" : "Fullført"}
                                    </Badge>
                                  </div>

                                  {application.worker && (
                                    <div className="text-sm text-gray-600 space-y-1">
                                      {application.worker.email && (
                                        <div>E-post: {application.worker.email}</div>
                                      )}
                                      {application.worker.phone && (
                                        <div>Telefon: {application.worker.phone}</div>
                                      )}
                                      {application.worker.bio && (
                                        <div className="mt-2">
                                          <strong>Bio:</strong> {application.worker.bio}
                                        </div>
                                      )}
                                      {application.worker.completedJobs !== undefined && (
                                        <div>Fullførte jobber: {application.worker.completedJobs}</div>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {application.status === "pending" && (
                                  <Button
                                    onClick={() => selectCandidate(job.id, application.workerId)}
                                    size="sm"
                                    className="ml-3"
                                  >
                                    Velg kandidat
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {recentJobs.filter(job => job.status !== "open").length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Fullførte jobber:</h4>
                  <div className="space-y-2">
                    {recentJobs.filter(job => job.status !== "open").map((job) => (
                      <div key={job.id} className="border rounded p-3 bg-green-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium">{job.title}</span>
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {job.status === "assigned" ? "Tildelt" : 
                               job.status === "completed" ? "Fullført" : "Avbrutt"}
                            </Badge>
                          </div>
                          <Link href={`/samtaler/${job.id}`}>
                            <Button variant="outline" size="sm">
                              Åpne samtale
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Anmeldelser fra arbeidstakere
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Ingen anmeldelser ennå.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{review.reviewer.navn || "Anonym"}</span>
                      <div className="flex gap-0.5">{renderStars(review.rating)}</div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(review.created_at)}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-gray-700 text-sm">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Job Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Slett jobb</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              Er du sikker på at du vil slette jobben <strong>&quot;{jobToDelete?.title}&quot;</strong>?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Denne handlingen kan ikke angres. Jobben og alle søknader vil bli slettet permanent.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Avbryt
            </Button>
            <Button
              variant="destructive"
              onClick={() => jobToDelete && deleteJob(jobToDelete.id)}
            >
              Slett jobb
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
