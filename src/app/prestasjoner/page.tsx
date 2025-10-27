"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";

type CategoryProgress = { category:string; count:number; target:number };
type Achievements = { xp:number; badges:string[]; perCategory:CategoryProgress[]; canContactCurator:boolean };

export default function Page() {
  const [data, setData] = useState<{ achievements:Achievements; rules:{categoryBadgeTarget:number; curatorThreshold:number} }|null>(null);
  const [loading, setLoading] = useState(true); const [err, setErr] = useState<string|null>(null);

  useEffect(() => {
    fetch("/api/achievements").then(r=>{ if(!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(setData).catch(e=>setErr(String(e))).finally(()=>setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[40vh] text-gray-500 text-lg">Henter prestasjoner…</div>;
  if (err || !data) return <div className="flex items-center justify-center min-h-[40vh] text-red-600 text-lg">Feil: {err || "Ingen data"}</div>;

  const { achievements, rules } = data;

  return (
    <AuthGuard requireAuth={true}>
      <div className="max-w-2xl mx-auto py-10 px-2 space-y-10 bg-gray-50 rounded-2xl">
        <header className="flex flex-col items-center gap-3 mb-4">
          <div className="bg-orange-50 rounded-full p-3">
            <Info className="text-orange-500" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 text-center">Dine prestasjoner</h1>
          <p className="text-gray-500 text-center max-w-lg leading-relaxed">
            Her kan du følge progresjonen din, samle badges og låse opp nye muligheter.<br />
            <span className="font-medium">XP:</span> {achievements.xp} &nbsp;|&nbsp;
            <span className="font-medium">Badge:</span> Få en badge når du når <span className="font-medium">{rules.categoryBadgeTarget}</span> oppdrag i én kategori.<br />
            <span className="font-medium">Kurator:</span> Lås opp tilgang til kurator etter <span className="font-medium">{rules.curatorThreshold}</span> oppdrag i én kategori.
          </p>
        </header>

        <Card className="shadow-sm bg-white/90 rounded-xl border-0">
          <CardHeader className="pb-2"><CardTitle className="text-lg">Samlede badges</CardTitle></CardHeader>
          <CardContent>
            {achievements.badges.length === 0 ? (
              <p className="text-sm text-gray-500">Du har ingen badges ennå. Fullfør flere oppdrag for å samle dine første!</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {achievements.badges.map(b => (
                  <Badge key={b} variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200 px-3 py-1 text-sm">
                    {b}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm bg-white/90 rounded-xl border-0">
          <CardHeader className="pb-2"><CardTitle className="text-lg">Progresjon i hver kategori</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {achievements.perCategory.map(c => {
                const pct = Math.min(100, Math.round((c.count / c.target) * 100));
                return (
                  <li key={c.category} className="rounded-lg bg-gray-100 px-4 py-3 flex flex-col gap-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <div className="font-medium text-gray-800">{c.category}</div>
                      <div className="text-sm text-gray-500">{c.count} av {c.target} oppdrag</div>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Progress value={pct} className={pct === 100 ? "bg-orange-200" : ""} />
                      {pct === 100 && <span className="text-xs text-orange-600">Gratulerer!</span>}
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-sm bg-white/90 rounded-xl border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Kontakt kurator</CardTitle>
            <p className="text-sm text-gray-500">Når du har nådd målet i én kategori, kan du kontakte en kurator for å få flere muligheter og veiledning.</p>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <a
                href="/grunder"
                className={`px-6 py-3 rounded-lg font-semibold text-base transition text-center ${achievements.canContactCurator ? "bg-orange-500 text-white hover:bg-orange-600 shadow-md" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                tabIndex={achievements.canContactCurator ? 0 : -1}
                aria-disabled={!achievements.canContactCurator}
                style={{ minWidth: 180 }}
              >
                Kontakt kurator
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}