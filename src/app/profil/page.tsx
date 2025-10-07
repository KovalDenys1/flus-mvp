"use client";

import { useEffect, useState } from "react";

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
};

export default function Page() {
  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [aggregates, setAggregates] = useState<{ avgRating: string; totalDone: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

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

  if (loading) return <div>Henter profil…</div>;
  if (err) return <div className="text-red-600">Feil: {err}</div>;
  if (!profile) return <div>Fant ikke profil.</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <section>
        <h1 className="text-xl font-semibold">Profil</h1>
        <p className="text-sm text-gray-600">
          {profile.name} • {profile.ageRange} • {profile.kommune}
        </p>
        {aggregates && (
          <p className="text-sm text-gray-600">
            ★ {aggregates.avgRating} • {aggregates.totalDone} fullførte oppdrag
          </p>
        )}
        <div className="mt-2 flex flex-wrap gap-2">
          {profile.skills.map((s) => (
            <span key={s} className="text-xs border rounded px-2 py-1">{s}</span>
          ))}
        </div>
      </section>

      {/* CV */}
      <section>
        <h2 className="font-medium">CV</h2>
        {profile.cv.length === 0 ? (
          <p className="text-gray-500 text-sm">Ingen oppdrag ennå.</p>
        ) : (
          <ul className="list-disc pl-5">
            {profile.cv.map((e) => (
              <li key={e.id}>
                {e.title} • {e.category} • {e.date}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Sosiale lenker */}
      <section>
        <h2 className="font-medium">Sosiale lenker</h2>
        {profile.socials.length === 0 ? (
          <p className="text-gray-500 text-sm">Ingen synlige lenker.</p>
        ) : (
          <ul className="list-disc pl-5">
            {profile.socials.map((s) => (
              <li key={s.type}>
                <a className="underline" href={s.url} target="_blank" rel="noreferrer">
                  {s.type}
                </a>
              </li>
            ))}
          </ul>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Kun godkjente domener (LinkedIn, GitHub). Ikke del telefon/e-post offentlig.
        </p>
      </section>

      {/* Anmeldelser */}
      <section>
        <h2 className="font-medium">Anmeldelser (siste)</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-sm">Ingen anmeldelser ennå.</p>
        ) : (
          <ul className="space-y-2">
            {reviews.map((r) => (
              <li key={r.id} className="border rounded p-3">
                <div className="text-sm text-gray-600">★ {r.rating} — {r.date}</div>
                <p>{r.text}</p>
                <button className="mt-2 text-sm underline">Svar</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}