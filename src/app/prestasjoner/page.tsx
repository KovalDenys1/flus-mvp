"use client";

import { useEffect, useState } from "react";

type CategoryProgress = { category: string; count: number; target: number };
type Achievements = {
  xp: number;
  badges: string[];
  perCategory: CategoryProgress[];
  canContactCurator: boolean;
};

export default function Page() {
  const [data, setData] = useState<{
    achievements: Achievements;
    rules: { categoryBadgeTarget: number; curatorThreshold: number };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/achievements")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setData)
      .catch((e) => setErr(String(e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Henter prestasjoner…</div>;
  if (err || !data) return <div className="text-red-600">Feil: {err || "Ingen data"}</div>;

  const { achievements, rules } = data;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Prestasjoner</h1>
        <p className="text-sm text-gray-600">
          XP: <span className="font-medium">{achievements.xp}</span> •
          {" "}Kategori-badge ved {rules.categoryBadgeTarget} fullførte i en kategori •
          {" "}Kurator-tilgang ved {rules.curatorThreshold} i én kategori
        </p>
      </header>

      {/* Beidzhi */}
      <section>
        <h2 className="font-medium mb-2">Badges</h2>
        {achievements.badges.length === 0 ? (
          <p className="text-gray-500 text-sm">Ingen badges ennå.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {achievements.badges.map((b) => (
              <span key={b} className="text-xs px-2 py-1 rounded-full border">
                {b}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Progres po kategoriyam */}
      <section>
        <h2 className="font-medium mb-2">Fremdrift per kategori</h2>
        <ul className="space-y-3">
          {achievements.perCategory.map((c) => {
            const pct = Math.min(100, Math.round((c.count / c.target) * 100));
            const reached = c.count >= c.target;
            return (
              <li key={c.category} className="border rounded p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{c.category}</div>
                  <div className="text-sm text-gray-600">
                    {c.count} / {c.target}
                  </div>
                </div>
                <div className="mt-2 h-2 w-full bg-gray-200 rounded">
                  <div
                    className={`h-2 rounded ${reached ? "bg-green-600" : "bg-gray-800"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {reached && (
                  <div className="text-xs text-green-700 mt-1">
                    Badge oppnådd i {c.category}!
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* Kurator CTA */}
      <section className="border rounded p-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Gründer / Kurator</div>
            <p className="text-sm text-gray-600">
              Lås opp tilgang etter {rules.curatorThreshold} fullførte oppdrag i én kategori.
            </p>
          </div>
          <a
            href="/grunder"
            className={`px-3 py-2 border rounded ${achievements.canContactCurator ? "" : "opacity-50 pointer-events-none"}`}
          >
            Kontakt kurator
          </a>
        </div>
        {!achievements.canContactCurator && (
          <p className="text-xs text-gray-500 mt-2">
            Tips: fokuser på én kategori for å nå terskelen raskere.
          </p>
        )}
      </section>
    </div>
  );
}