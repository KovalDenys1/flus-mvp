"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2 } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import { toast } from "sonner";

type CvEntry = {
  id: string;
  user_id: string;
  title: string;
  company: string;
  description?: string;
  start_date: string;
  end_date?: string;
  current_job: boolean;
  created_at: string;
  updated_at: string;
};

type Skill = {
  id: string;
  user_id: string;
  skill_name: string;
  proficiency_level: string;
  years_experience: number;
  created_at: string;
  updated_at: string;
};

type User = {
  id: string;
  email: string;
  role: string;
  navn?: string;
  kommune?: string;
  telefon?: string;
};

type Stats = {
  role: string;
  totalJobsCreated: number;
  activeJobs: number;
  completedJobs: number;
  totalApplications: number;
  acceptedApplications: number;
  totalEarnings: number;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [cvEntries, setCvEntries] = useState<CvEntry[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"worker" | "employer" | null>(null);

  // Form states
  const [cvFormOpen, setCvFormOpen] = useState(false);
  const [skillFormOpen, setSkillFormOpen] = useState(false);
  const [editingCvEntry, setEditingCvEntry] = useState<CvEntry | null>(null);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cvForm, setCvForm] = useState({
    title: "",
    company: "",
    description: "",
    start_date: "",
    end_date: "",
    current_job: false
  });
  const [skillForm, setSkillForm] = useState({
    skill_name: "",
    proficiency_level: "beginner",
    years_experience: 0
  });

  useEffect(() => {
    // Read viewMode from localStorage (same as Navbar)
    const savedMode = localStorage.getItem("viewMode");
    if (savedMode === "worker" || savedMode === "employer") {
      setViewMode(savedMode);
    } else {
      // Default to worker if not set
      setViewMode("worker");
    }
    
    loadProfile();

    // Listen for changes to viewMode in localStorage (when Navbar changes it)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "viewMode" && (e.newValue === "worker" || e.newValue === "employer")) {
        setViewMode(e.newValue);
      }
    };

    // Listen for custom event (for same-tab changes)
    const handleViewModeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ viewMode: "worker" | "employer" }>;
      if (customEvent.detail?.viewMode) {
        setViewMode(customEvent.detail.viewMode);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("viewModeChanged", handleViewModeChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("viewModeChanged", handleViewModeChange);
    };
  }, []);

  useEffect(() => {
    // Redirect based on viewMode from navbar
    if (viewMode && user) {
      if (viewMode === "worker") {
        router.push("/profil/worker");
      } else if (viewMode === "employer") {
        router.push("/profil/employer");
      }
    }
  }, [viewMode, user, router]);

  const loadProfile = async () => {
    try {
      setLoading(true);

      // Get user info
      const userRes = await fetch("/api/auth/me");
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData.user);
      }

      // Get statistics
      const statsRes = await fetch("/api/profile/stats");
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }

      // Get CV data
      const cvRes = await fetch("/api/cv");
      if (cvRes.ok) {
        const cvData = await cvRes.json();
        setCvEntries(cvData.cv_entries || []);
        setSkills(cvData.skills || []);
      }
    } catch (err) {
      setError("Kunne ikke laste profil");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addCvEntry = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "cv_entry",
          data: cvForm
        })
      });

      if (res.ok) {
        setCvFormOpen(false);
        setCvForm({
          title: "",
          company: "",
          description: "",
          start_date: "",
          end_date: "",
          current_job: false
        });
        loadProfile();
        toast.success("Arbeidserfaring lagt til");
      } else {
        const error = await res.json();
        alert("Feil: " + error.error);
      }
    } catch (err) {
      alert("Kunne ikke legge til arbeidserfaring");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSkill = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "skill",
          data: skillForm
        })
      });

      if (res.ok) {
        setSkillFormOpen(false);
        setSkillForm({
          skill_name: "",
          proficiency_level: "beginner",
          years_experience: 0
        });
        loadProfile();
        toast.success("Ferdighet lagt til");
      } else {
        const error = await res.json();
        alert("Feil: " + error.error);
      }
    } catch (err) {
      alert("Kunne ikke legge til ferdighet");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteCvEntry = async (id: string) => {
    if (!confirm("Er du sikker på at du vil slette denne arbeidserfaringen?")) return;

    try {
      const res = await fetch(`/api/cv/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        loadProfile();
        toast.success("Arbeidserfaring slettet");
      } else {
        const error = await res.json();
        alert("Feil: " + error.error);
      }
    } catch (err) {
      alert("Kunne ikke slette arbeidserfaring");
      console.error(err);
    }
  };

  const deleteSkill = async (id: string) => {
    if (!confirm("Er du sikker på at du vil slette denne ferdigheten?")) return;

    try {
      const res = await fetch(`/api/cv/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        loadProfile();
        toast.success("Ferdighet slettet");
      } else {
        const error = await res.json();
        alert("Feil: " + error.error);
      }
    } catch (err) {
      alert("Kunne ikke slette ferdighet");
      console.error(err);
    }
  };

  const startEditingCvEntry = (entry: CvEntry) => {
    setEditingCvEntry(entry);
    setCvForm({
      title: entry.title,
      company: entry.company,
      description: entry.description || "",
      start_date: entry.start_date.split('T')[0], // Format for date input
      end_date: entry.end_date ? entry.end_date.split('T')[0] : "",
      current_job: entry.current_job
    });
    setCvFormOpen(true);
  };

  const startEditingSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setSkillForm({
      skill_name: skill.skill_name,
      proficiency_level: skill.proficiency_level,
      years_experience: skill.years_experience
    });
    setSkillFormOpen(true);
  };

  const updateCvEntry = async () => {
    if (!editingCvEntry) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/cv/${editingCvEntry.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "cv_entry",
          data: cvForm
        })
      });

      if (res.ok) {
        setCvFormOpen(false);
        setEditingCvEntry(null);
        setCvForm({
          title: "",
          company: "",
          description: "",
          start_date: "",
          end_date: "",
          current_job: false
        });
        loadProfile();
        toast.success("Arbeidserfaring oppdatert");
      } else {
        const error = await res.json();
        alert("Feil: " + error.error);
      }
    } catch (err) {
      alert("Kunne ikke oppdatere arbeidserfaring");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateSkill = async () => {
    if (!editingSkill) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/cv/${editingSkill.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "skill",
          data: skillForm
        })
      });

      if (res.ok) {
        setSkillFormOpen(false);
        setEditingSkill(null);
        setSkillForm({
          skill_name: "",
          proficiency_level: "beginner",
          years_experience: 0
        });
        loadProfile();
        toast.success("Ferdighet oppdatert");
      } else {
        const error = await res.json();
        alert("Feil: " + error.error);
      }
    } catch (err) {
      alert("Kunne ikke oppdatere ferdighet");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("no-NO", {
      year: "numeric",
      month: "short"
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-4">
        <div className="text-red-600">Feil: {error}</div>
      </div>
    );
  }

  // While loading or redirecting, show loading state
  if (!viewMode) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard requireAuth={true}>
      <div className="max-w-4xl mx-auto mt-10 p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Min profil</h1>
          <Button onClick={loadProfile} variant="outline">
            Oppdater
          </Button>
        </div>

        {/* User Info */}
        {user && (
          <Card>
            <CardHeader>
              <CardTitle>Brukerinformasjon</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div><strong>Navn:</strong> {user.navn || "Ikke oppgitt"}</div>
              <div><strong>E-post:</strong> {user.email}</div>
              <div><strong>Telefon:</strong> {user.telefon || "Ikke oppgitt"}</div>
              <div><strong>Kommune:</strong> {user.kommune || "Ikke oppgitt"}</div>
              <div>
                <strong>Rolle:</strong>{" "}
                <Badge variant="secondary">
                  {user.role === "employer" ? "Arbeidsgiver" : user.role === "worker" ? "Arbeidstaker" : "Begge"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics for Employer */}
        {stats && (stats.role === "employer" || stats.role === "both") && (
          <Card>
            <CardHeader>
              <CardTitle>📊 Statistikk som arbeidsgiver</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{stats.totalJobsCreated}</div>
                  <div className="text-sm text-gray-600 mt-1">Totale jobber opprettet</div>
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
                  <div className="text-3xl font-bold text-orange-600">{stats.totalApplications}</div>
                  <div className="text-sm text-gray-600 mt-1">Totale søknader mottatt</div>
                </div>
                <div className="text-center p-4 bg-teal-50 rounded-lg">
                  <div className="text-3xl font-bold text-teal-600">{stats.acceptedApplications}</div>
                  <div className="text-sm text-gray-600 mt-1">Godkjente søknader</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics for Worker */}
        {stats && (stats.role === "worker" || stats.role === "both") && (
          <Card>
            <CardHeader>
              <CardTitle>💼 Statistikk som arbeidstaker</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{stats.totalApplications}</div>
                  <div className="text-sm text-gray-600 mt-1">Søknader sendt</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{stats.acceptedApplications}</div>
                  <div className="text-sm text-gray-600 mt-1">Godkjente jobber</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600">{stats.totalEarnings} kr</div>
                  <div className="text-sm text-gray-600 mt-1">Total inntjening</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* CV Entries */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Arbeidserfaring</CardTitle>
            <Dialog open={cvFormOpen} onOpenChange={(open) => {
              setCvFormOpen(open);
              if (!open) {
                setEditingCvEntry(null);
                setCvForm({
                  title: "",
                  company: "",
                  description: "",
                  start_date: "",
                  end_date: "",
                  current_job: false
                });
              }
            }}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Legg til
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingCvEntry ? "Rediger arbeidserfaring" : "Legg til arbeidserfaring"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Stilling</Label>
                    <Input
                      id="title"
                      value={cvForm.title}
                      onChange={(e) => setCvForm({...cvForm, title: e.target.value})}
                      placeholder="f.eks. Elektriker"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Bedrift</Label>
                    <Input
                      id="company"
                      value={cvForm.company}
                      onChange={(e) => setCvForm({...cvForm, company: e.target.value})}
                      placeholder="f.eks. Byggmester AS"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Beskrivelse</Label>
                    <Textarea
                      id="description"
                      value={cvForm.description}
                      onChange={(e) => setCvForm({...cvForm, description: e.target.value})}
                      placeholder="Beskriv arbeidsoppgaver og ansvar..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start_date">Startdato</Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={cvForm.start_date}
                        onChange={(e) => setCvForm({...cvForm, start_date: e.target.value})}
                      />
                    </div>
                    {!cvForm.current_job && (
                      <div>
                        <Label htmlFor="end_date">Sluttdato</Label>
                        <Input
                          id="end_date"
                          type="date"
                          value={cvForm.end_date}
                          onChange={(e) => setCvForm({...cvForm, end_date: e.target.value})}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="current_job"
                      checked={cvForm.current_job}
                      onChange={(e) => setCvForm({...cvForm, current_job: e.target.checked})}
                    />
                    <Label htmlFor="current_job">Nåværende stilling</Label>
                  </div>
                  <Button onClick={editingCvEntry ? updateCvEntry : addCvEntry} className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Lagrer..." : editingCvEntry ? "Oppdater" : "Legg til"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {cvEntries.length === 0 ? (
              <p className="text-gray-500">Ingen arbeidserfaring lagt til ennå.</p>
            ) : (
              <div className="space-y-4">
                {cvEntries.map((entry) => (
                  <div key={entry.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{entry.title}</h3>
                        <p className="text-gray-600">{entry.company}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(entry.start_date)} - {entry.current_job ? "nå" : entry.end_date ? formatDate(entry.end_date) : ""}
                        </p>
                        {entry.description && (
                          <p className="mt-2 text-sm">{entry.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => startEditingCvEntry(entry)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => deleteCvEntry(entry.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Ferdigheter</CardTitle>
            <Dialog open={skillFormOpen} onOpenChange={(open) => {
              setSkillFormOpen(open);
              if (!open) {
                setEditingSkill(null);
                setSkillForm({
                  skill_name: "",
                  proficiency_level: "beginner",
                  years_experience: 0
                });
              }
            }}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Legg til
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingSkill ? "Rediger ferdighet" : "Legg til ferdighet"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="skill_name">Ferdighet</Label>
                    <Input
                      id="skill_name"
                      value={skillForm.skill_name}
                      onChange={(e) => setSkillForm({...skillForm, skill_name: e.target.value})}
                      placeholder="f.eks. Elektroarbeid"
                    />
                  </div>
                  <div>
                    <Label htmlFor="proficiency_level">Nivå</Label>
                    <Select
                      value={skillForm.proficiency_level}
                      onValueChange={(value) => setSkillForm({...skillForm, proficiency_level: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Nybegynner</SelectItem>
                        <SelectItem value="intermediate">Middels</SelectItem>
                        <SelectItem value="advanced">Avansert</SelectItem>
                        <SelectItem value="expert">Ekspert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="years_experience">Års erfaring</Label>
                    <Input
                      id="years_experience"
                      type="number"
                      min="0"
                      value={skillForm.years_experience}
                      onChange={(e) => setSkillForm({...skillForm, years_experience: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <Button onClick={editingSkill ? updateSkill : addSkill} className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Lagrer..." : editingSkill ? "Oppdater" : "Legg til"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {skills.length === 0 ? (
              <p className="text-gray-500">Ingen ferdigheter lagt til ennå.</p>
            ) : (
              <div className="space-y-2">
                {skills.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between p-2 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {skill.skill_name}
                      </Badge>
                      <span className="text-xs text-gray-600">
                        ({skill.proficiency_level === "beginner" ? "Nybegynner" :
                          skill.proficiency_level === "intermediate" ? "Middels" :
                          skill.proficiency_level === "advanced" ? "Avansert" : "Ekspert"})
                      </span>
                      {skill.years_experience > 0 && (
                        <span className="text-xs text-gray-600">• {skill.years_experience} år</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEditingSkill(skill)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => deleteSkill(skill.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
