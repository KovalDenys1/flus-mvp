"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2 } from "lucide-react";

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

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [cvEntries, setCvEntries] = useState<CvEntry[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [cvFormOpen, setCvFormOpen] = useState(false);
  const [skillFormOpen, setSkillFormOpen] = useState(false);
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
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      // Get user info
      const userRes = await fetch("/api/auth/me");
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData.user);
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
      } else {
        const error = await res.json();
        alert("Feil: " + error.error);
      }
    } catch (err) {
      alert("Kunne ikke legge til CV-oppføring");
      console.error(err);
    }
  };

  const addSkill = async () => {
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
      } else {
        const error = await res.json();
        alert("Feil: " + error.error);
      }
    } catch (err) {
      alert("Kunne ikke legge til ferdighet");
      console.error(err);
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

  return (
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
          </CardContent>
        </Card>
      )}

      {/* CV Entries */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Arbeidserfaring</CardTitle>
          <Dialog open={cvFormOpen} onOpenChange={setCvFormOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Legg til
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Legg til arbeidserfaring</DialogTitle>
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
                <Button onClick={addCvEntry} className="w-full">
                  Legg til
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
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600">
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
          <Dialog open={skillFormOpen} onOpenChange={setSkillFormOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Legg til
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Legg til ferdighet</DialogTitle>
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
                <Button onClick={addSkill} className="w-full">
                  Legg til
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {skills.length === 0 ? (
            <p className="text-gray-500">Ingen ferdigheter lagt til ennå.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill.id} variant="secondary" className="flex items-center gap-2">
                  {skill.skill_name}
                  <span className="text-xs">
                    ({skill.proficiency_level === "beginner" ? "Nybegynner" :
                      skill.proficiency_level === "intermediate" ? "Middels" :
                      skill.proficiency_level === "advanced" ? "Avansert" : "Ekspert"})
                  </span>
                  {skill.years_experience > 0 && (
                    <span className="text-xs">• {skill.years_experience} år</span>
                  )}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
