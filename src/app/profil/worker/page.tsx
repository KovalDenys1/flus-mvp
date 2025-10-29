"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ExternalLink, Star, Briefcase, Award, Calendar, ArrowLeft, Download } from "lucide-react";

type User = {
  id: string;
  email: string;
  role: string;
  navn?: string;
  kommune?: string;
  telefon?: string;
  bio?: string;
  linkedin_url?: string;
  github_url?: string;
  website_url?: string;
  profile_image_url?: string;
};

type Stats = {
  totalApplicationsSent: number;
  acceptedJobs: number;
  completedJobsWorker: number;
  totalEarnings: number;
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

type CvEntry = {
  id: string;
  title: string;
  company: string;
  description?: string;
  start_date: string;
  end_date?: string;
  current_job: boolean;
};

type Skill = {
  id: string;
  skill_name: string;
  proficiency_level: string;
  years_experience: number;
};

type Achievements = { xp: number; badges: string[]; perCategory: { category: string; count: number; target: number }[]; canContactCurator: boolean };

export default function WorkerProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [cvEntries, setCvEntries] = useState<CvEntry[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [achievements, setAchievements] = useState<Achievements | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    navn: "",
    bio: "",
    telefon: "",
    kommune: "",
    linkedin_url: "",
    github_url: "",
    website_url: "",
  });

  useEffect(() => {
    loadProfile();

    // Listen for viewMode changes from Navbar
    const handleViewModeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ viewMode: "worker" | "employer" }>;
      if (customEvent.detail?.viewMode === "employer") {
        // User switched to employer mode, redirect to employer profile
        router.push("/profil/employer");
      }
    };

    window.addEventListener("viewModeChanged", handleViewModeChange);

    return () => {
      window.removeEventListener("viewModeChanged", handleViewModeChange);
    };
  }, [router]); // Removed 'user' from dependencies

  // Separate useEffect for realtime notifications that depends on user
  useEffect(() => {
    if (!user) return;

    const supabase = getSupabaseBrowser();
    const channel = supabase
      .channel('applications-updates')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'applications'
      }, async (payload) => {
        const application = payload.new as any;
        if (application.applicant_id === user.id) {
          // Fetch job title
          const { data: job } = await supabase
            .from('jobs')
            .select('title')
            .eq('id', application.job_id)
            .single();
          
          const statusText = application.status === 'accepted' ? 'godkjent' : 
                           application.status === 'rejected' ? 'avslått' : 'oppdatert';
          toast.success(`Din søknad på "${job?.title}" er ${statusText}!`);
          // Reload stats
          loadProfile();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]); // Only depends on user

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
          linkedin_url: userData.user.linkedin_url || "",
          github_url: userData.user.github_url || "",
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

      // Get CV data
      const cvRes = await fetch("/api/cv");
      if (cvRes.ok) {
        const cvData = await cvRes.json();
        setCvEntries(cvData.cv_entries || []);
        setSkills(cvData.skills || []);
      }

      // Get achievements
      const achievementsRes = await fetch("/api/achievements");
      if (achievementsRes.ok) {
        const achievementsData = await achievementsRes.json();
        setAchievements(achievementsData.achievements);
      }
    } catch (err) {
      console.error("Feil ved lasting av profil:", err);
    } finally {
      setLoading(false);
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
      console.error("Feil ved lagring av profil:", err);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("no-NO", {
      year: "numeric",
      month: "short",
    });
  };

  const downloadCV = async () => {
    try {
      const response = await fetch("/api/cv/pdf");
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${user?.navn || 'CV'}_CV.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error("Failed to download CV PDF");
      }
    } catch (error) {
      console.error("Error downloading CV PDF:", error);
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
          className="flex items-center gap-1 hover:text-gray-900 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Tilbake
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Min profil - Jobbsøker</h1>
          <p className="text-gray-600 mt-1">Se og rediger din profil som jobbsøker</p>
        </div>
        <Button onClick={() => setEditMode(!editMode)} variant={editMode ? "outline" : "default"}>
          {editMode ? "Avbryt" : "Rediger"}
        </Button>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Profilinformasjon
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
                  placeholder="Ditt navn"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <Textarea
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  placeholder="Fortell litt om deg selv..."
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
                <label className="block text-sm font-medium mb-1">LinkedIn URL</label>
                <Input
                  value={profileForm.linkedin_url}
                  onChange={(e) => setProfileForm({ ...profileForm, linkedin_url: e.target.value })}
                  placeholder="https://linkedin.com/in/ditt-navn"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">GitHub URL</label>
                <Input
                  value={profileForm.github_url}
                  onChange={(e) => setProfileForm({ ...profileForm, github_url: e.target.value })}
                  placeholder="https://github.com/ditt-brukernavn"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nettside</label>
                <Input
                  value={profileForm.website_url}
                  onChange={(e) => setProfileForm({ ...profileForm, website_url: e.target.value })}
                  placeholder="https://dinside.no"
                />
              </div>
              <Button onClick={saveProfile} className="w-full">
                Lagre endringer
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-3">
                  <div>
                    <strong>Navn:</strong> {user?.navn || "Ikke oppgitt"}
                  </div>
                  {user?.bio && (
                    <div>
                      <strong>Bio:</strong>
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
                  
                  {/* Social Links */}
                  {(user?.linkedin_url || user?.github_url || user?.website_url) && (
                    <div className="flex gap-3 mt-3">
                      {user?.linkedin_url && (
                        <a
                          href={user.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                          LinkedIn
                        </a>
                      )}
                      {user?.github_url && (
                        <a
                          href={user.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition text-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                          GitHub
                        </a>
                      )}
                      {user?.website_url && (
                        <a
                          href={user.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition text-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Nettside
                        </a>
                      )}
                    </div>
                  )}
                </div>
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
              <Award className="w-5 h-5" />
              Statistikk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{stats.totalApplicationsSent}</div>
                <div className="text-sm text-gray-600 mt-1">Søknader sendt</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{stats.completedJobsWorker}</div>
                <div className="text-sm text-gray-600 mt-1">Fullførte jobber</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-3xl font-bold text-orange-600">{stats.totalEarnings} kr</div>
                <div className="text-sm text-gray-600 mt-1">Total inntjening</div>
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

      {/* Achievements */}
      {achievements && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Prestasjoner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-orange-50 rounded-lg p-4 h-24 flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">XP:</span>
                    <span className="text-2xl font-bold text-orange-600">{achievements.xp}</span>
                  </div>
                  <Progress value={Math.min(100, (achievements.xp / 1000) * 100)} className="h-2" />
                  <div className="text-xs text-gray-600 mt-2">
                    {achievements.xp < 1000 ? `${1000 - achievements.xp} XP til neste nivå` : "Maks nivå nådd! 🎉"}
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 h-24 flex flex-col justify-center">
                  <h4 className="font-medium mb-2">Kategorier</h4>
                  <div className="text-sm text-gray-600">
                    {achievements.perCategory.length > 0 ? (
                      <div className="space-y-1">
                        {achievements.perCategory.slice(0, 2).map(cat => (
                          <div key={cat.category} className="flex justify-between">
                            <span>{cat.category}:</span>
                            <span className="font-medium">{cat.count}/{cat.target}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span>Ingen kategorier ennå</span>
                    )}
                  </div>
                </div>

                {stats && (
                  <div className="bg-indigo-50 rounded-lg p-4 h-24 flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Total inntjening:</span>
                      <span className="text-2xl font-bold text-indigo-600">
                        {stats.totalEarnings} kr
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Fra fullførte jobber
                    </div>
                  </div>
                )}

                {achievements.badges.length > 0 && (
                  <div className="bg-yellow-50 rounded-lg p-4 h-24 flex flex-col justify-center">
                    <h4 className="font-medium mb-2">Badges</h4>
                    <div className="flex flex-wrap gap-2">
                      {achievements.badges.slice(0, 3).map(badge => (
                        <Badge key={badge} variant="secondary" className="bg-yellow-100 text-yellow-700 text-xs">
                          {badge}
                        </Badge>
                      ))}
                      {achievements.badges.length > 3 && (
                        <Badge variant="outline" className="text-xs">+{achievements.badges.length - 3} flere</Badge>
                      )}
                    </div>
                  </div>
                )}

                {achievements.canContactCurator && (
                  <div className="bg-green-50 rounded-lg p-4 h-24 flex flex-col justify-center border border-green-200">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🎯</span>
                      <div>
                        <h4 className="font-medium text-sm">Kurator tilgjengelig</h4>
                        <p className="text-xs text-gray-600">Du kan kontakte en kurator for råd</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {stats && (
                  <>
                    <div className="bg-blue-50 rounded-lg p-4 h-24 flex flex-col justify-center">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Vurdering:</span>
                        <span className="text-2xl font-bold text-blue-600 flex items-center gap-1">
                          {stats.averageRating > 0 ? stats.averageRating : "—"}
                          {stats.averageRating > 0 && <span className="text-lg">⭐</span>}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {stats.totalReviews} anmeldelser
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4 h-24 flex flex-col justify-center">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Fullføringsrate:</span>
                        <span className="text-2xl font-bold text-green-600">
                          {stats.totalApplicationsSent > 0
                            ? Math.round((stats.completedJobsWorker / stats.totalApplicationsSent) * 100)
                            : 0}%
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {stats.completedJobsWorker} av {stats.totalApplicationsSent} søknader
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Anmeldelser
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

      {/* CV Entries */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Arbeidserfaring
            </CardTitle>
            <Button onClick={downloadCV} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Last ned CV som PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {cvEntries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Ingen arbeidserfaring lagt til ennå.</p>
              <Link href="/profil">
                <Button variant="outline">Gå til full profil for å legge til</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cvEntries.map((entry) => (
                <div key={entry.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold">{entry.title}</h3>
                  <p className="text-gray-600">{entry.company}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(entry.start_date)} -{" "}
                    {entry.current_job ? "nå" : entry.end_date ? formatDate(entry.end_date) : ""}
                  </p>
                  {entry.description && (
                    <p className="mt-2 text-sm text-gray-700">{entry.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Ferdigheter</CardTitle>
        </CardHeader>
        <CardContent>
          {skills.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Ingen ferdigheter lagt til ennå.</p>
              <Link href="/profil">
                <Button variant="outline">Gå til full profil for å legge til</Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill.id} variant="secondary" className="px-3 py-1">
                  {skill.skill_name}
                  <span className="ml-2 text-xs">
                    ({skill.proficiency_level === "beginner" ? "Nybegynner" :
                      skill.proficiency_level === "intermediate" ? "Middels" :
                      skill.proficiency_level === "advanced" ? "Avansert" : "Ekspert"})
                  </span>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
