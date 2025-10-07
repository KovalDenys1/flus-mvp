"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SocialLink = { type: "linkedin" | "github" | "website"; url: string; visible: boolean };
type CvEntry = { id: string; title: string; category: string; date: string };
type Review = { id: string; rating: number; text: string; date: string };
type WorkerProfile = {
  userId: string;
  name: string;
  ageRange: string;
  kommune: string;
  skills: string[];
  cv: CvEntry[];
  socials: SocialLink[];
  achievements: Record<string, number>;
  xp: number;
  avatarUrl?: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<WorkerProfile|null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [aggregates, setAggregates] = useState<{avgRating:string; totalDone:number}|null>(null);
  const [loading, setLoading] = useState(true); 
  const [err, setErr] = useState<string|null>(null);
  const [tab, setTab] = useState<"overview" | "cv" | "socials" | "reviews">("overview");
  // Pagination for reviews
  const [reviewPage, setReviewPage] = useState(0);
  const REVIEWS_PER_PAGE = 3;

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => {
        setProfile(d.profile);
        setReviews(d.reviews ?? []);
        setAggregates(d.aggregates ?? null);
      })
      .catch((e) => setErr(String(e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="max-w-2xl mx-auto mt-10 animate-pulse">
        <div className="h-32 bg-gray-200 rounded-xl mb-6" />
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-3" />
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-3" />
        <div className="h-6 bg-gray-200 rounded w-1/4" />
      </div>
    );
  if (err) return <div className="text-red-600 max-w-2xl mx-auto mt-10">Feil: {err}</div>;
  if (!profile) return <div className="max-w-2xl mx-auto mt-10">Fant ikke profil.</div>;

  return (
    <div className="max-w-2xl mx-auto px-2 sm:px-0">
      {/* HERO */}
  <section className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-700 border-4 border-white shadow">
              {profile.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
          )}
        </div>
        {/* Main info */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{profile.name}</h1>
          <div className="text-gray-600 mt-1 text-sm flex flex-wrap gap-x-3 gap-y-1">
            <span>{profile.ageRange}</span>
            <span>•</span>
            <span>{profile.kommune}</span>
            {aggregates && (
              <>
                <span>•</span>
                <span>★ {aggregates.avgRating} ({aggregates.totalDone} oppdrag)</span>
              </>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.skills.slice(0, 6).map((s) => (
              <Badge key={s} variant="secondary">
                {s}
              </Badge>
            ))}
            {profile.skills.length > 6 && (
              <span className="text-xs text-gray-500">+{profile.skills.length - 6} flere</span>
            )}
          </div>
          <div className="mt-4 flex gap-2 flex-wrap">
            <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Rediger profil
            </Button>
            <Button size="sm" variant="default" className="bg-orange-500 hover:bg-orange-600">
              Kontakt
            </Button>
          </div>
        </div>
        {/* XP / Achievements */}
        <div className="flex flex-col items-center sm:items-end gap-2 min-w-[120px]">
          <div className="text-xs text-gray-500">XP</div>
          <div className="text-2xl font-bold text-gray-700">{profile.xp}</div>
          <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500"
              style={{ width: `${Math.min(100, (profile.xp % 1000) / 10)}%` }}
            />
          </div>
          <div className="flex gap-1 mt-1 flex-wrap">
            {Object.entries(profile.achievements)
              .slice(0, 2)
              .map(([k, v]) => (
                <Badge key={k} variant="outline" className="text-xs border-gray-300 text-gray-700">
                  {k}: {v}
                </Badge>
              ))}
            {Object.keys(profile.achievements).length > 2 && (
              <span className="text-xs text-gray-400">+{Object.keys(profile.achievements).length - 2}</span>
            )}
          </div>
        </div>
      </section>

      {/* TABS */}
      <div className="flex gap-2 mb-4 border-b">
        <button
          className={cn(
            "py-2 px-3 text-sm font-medium border-b-2 transition",
            tab === "overview"
              ? "border-orange-500 text-orange-700"
              : "border-transparent text-gray-500 hover:text-orange-700"
          )}
          onClick={() => setTab("overview")}
        >
          Oversikt
        </button>
        <button
          className={cn(
            "py-2 px-3 text-sm font-medium border-b-2 transition",
            tab === "cv"
              ? "border-orange-500 text-orange-700"
              : "border-transparent text-gray-500 hover:text-orange-700"
          )}
          onClick={() => setTab("cv")}
        >
          CV
        </button>
        <button
          className={cn(
            "py-2 px-3 text-sm font-medium border-b-2 transition",
            tab === "socials"
              ? "border-orange-500 text-orange-700"
              : "border-transparent text-gray-500 hover:text-orange-700"
          )}
          onClick={() => setTab("socials")}
        >
          Sosiale lenker
        </button>
        <button
          className={cn(
            "py-2 px-3 text-sm font-medium border-b-2 transition",
            tab === "reviews"
              ? "border-orange-500 text-orange-700"
              : "border-transparent text-gray-500 hover:text-orange-700"
          )}
          onClick={() => setTab("reviews")}
        >
          Anmeldelser
        </button>
      </div>

      {/* TAB CONTENT */}
      <div>
        {tab === "overview" && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Om</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-sm">
                {profile.skills.length > 0
                  ? `Har erfaring med: ${profile.skills.join(", ")}.`
                  : "Ingen ferdigheter oppgitt ennå."}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                XP og prestasjoner vokser etter hvert som du fullfører oppdrag.
              </p>
            </CardContent>
          </Card>
        )}

        {tab === "cv" && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>CV</CardTitle>
            </CardHeader>
            <CardContent>
              {profile.cv.length === 0 ? (
                <p className="text-sm text-gray-500">Ingen oppdrag ennå.</p>
              ) : (
                <ul className="space-y-2">
                  {profile.cv.map((e) => (
                    <li key={e.id} className="p-3 border rounded flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="font-medium">{e.title}</span>
                      <span className="text-xs text-gray-500">{e.category}</span>
                      <span className="text-xs text-gray-400 ml-auto">{e.date}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        )}

        {tab === "socials" && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Sosiale lenker</CardTitle>
            </CardHeader>
            <CardContent>
              {profile.socials.length === 0 ? (
                <p className="text-sm text-gray-500">Ingen synlige lenker.</p>
              ) : (
                <ul className="flex flex-wrap gap-3">
                  {profile.socials.map((s) => (
                    <li key={s.type} className="flex items-center gap-2">
                      {s.type === "linkedin" && (
                        <svg width="20" height="20" fill="currentColor" className="text-gray-400" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/></svg>
                      )}
                      {s.type === "github" && (
                        <svg width="20" height="20" fill="currentColor" className="text-gray-400" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.371.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576 4.765-1.588 8.199-6.084 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                      )}
                      {s.type === "website" && (
                        <svg width="20" height="20" fill="currentColor" className="text-gray-400" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 22c-5.514 0-10-4.486-10-10s4.486-10 10-10 10 4.486 10 10-4.486 10-10 10zm0-18c-4.411 0-8 3.589-8 8 0 4.411 3.589 8 8 8 4.411 0 8-3.589 8-8 0-4.411-3.589-8-8-8zm0 14c-3.309 0-6-2.691-6-6s2.691-6 6-6 6 2.691 6 6-2.691 6-6 6zm0-10c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4z"/></svg>
                      )}
                      <a
                        className="underline text-gray-700 hover:text-orange-600 text-sm"
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {s.type}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Kun godkjente domener (LinkedIn, GitHub). Ikke del telefon/e-post offentlig.
              </p>
            </CardContent>
          </Card>
        )}

        {tab === "reviews" && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Anmeldelser</CardTitle>
            </CardHeader>
            <CardContent>
              {reviews.length === 0 ? (
                <p className="text-sm text-gray-500">Ingen anmeldelser ennå.</p>
              ) : (
                <>
                  <ul className="space-y-2">
                    {reviews.slice(reviewPage * REVIEWS_PER_PAGE, (reviewPage + 1) * REVIEWS_PER_PAGE).map((r) => (
                      <li key={r.id} className="border rounded p-3">
                        <div className="text-sm text-gray-600">
                          ★ {r.rating} — {r.date}
                        </div>
                        <p className="text-sm">{r.text}</p>
                        <Button size="sm" variant="link" className="mt-2 p-0 h-auto">
                          Svar
                        </Button>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between items-center mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-300 text-gray-700"
                      disabled={reviewPage === 0}
                      onClick={() => setReviewPage((p) => Math.max(0, p - 1))}
                    >
                      Forrige
                    </Button>
                    <span className="text-xs text-gray-500">
                      {reviewPage + 1} / {Math.ceil(reviews.length / REVIEWS_PER_PAGE)}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-300 text-gray-700"
                      disabled={(reviewPage + 1) * REVIEWS_PER_PAGE >= reviews.length}
                      onClick={() => setReviewPage((p) => p + 1)}
                    >
                      Neste
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}