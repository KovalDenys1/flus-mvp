"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, Users, CheckCircle, DollarSign, Briefcase } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";

type Stats = {
  role: string;
  totalJobsCreated: number;
  activeJobs: number;
  completedJobs: number;
  totalApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
  pendingApplications: number;
  totalEarnings: number;
  totalReviews: number;
  averageRating: number;
};

export default function StatistikkPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadStats = async () => {
    try {
      const res = await fetch("/api/profile/stats");
      if (!res.ok) {
        throw new Error("Kunne ikke laste statistikk");
      }
      const data = await res.json();
      setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ukjent feil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [refreshKey]);

  // Function to refresh stats (can be called from outside)
  useEffect(() => {
    (window as any).refreshStats = () => setRefreshKey(prev => prev + 1);
  }, []);

  if (loading) {
    return (
      <AuthGuard requireAuth={true}>
        <div className="max-w-5xl mx-auto py-10 px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard requireAuth={true}>
        <div className="max-w-5xl mx-auto py-10 px-4">
          <div className="text-gray-600">Feil: {error}</div>
        </div>
      </AuthGuard>
    );
  }

  if (!stats) {
    return (
      <AuthGuard requireAuth={true}>
        <div className="max-w-5xl mx-auto py-10 px-4">
          <div className="text-gray-500">Ingen statistikk tilgjengelig</div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requireAuth={true}>
      <div className="max-w-5xl mx-auto py-10 px-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Min statistikk</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setRefreshKey(prev => prev + 1)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium"
            >
              🔄 Oppdater
            </button>
            <Badge variant="secondary" className="text-sm">
              Rolle: {stats.role === "employer" ? "Arbeidsgiver" : stats.role === "worker" ? "Arbeidstaker" : "Begge"}
            </Badge>
          </div>
        </div>

        {/* Employer Statistics */}
        {(stats.role === "employer" || stats.role === "both") && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Som arbeidsgiver
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-secondary">{stats.totalJobsCreated}</div>
                      <div className="text-sm text-muted-foreground">Totale jobber opprettet</div>
                      <div className="text-xs text-muted-foreground mt-1">Gjennom hele tiden</div>
                    </div>
                    <Briefcase className="w-8 h-8 text-secondary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-primary">{stats.activeJobs}</div>
                      <div className="text-sm text-muted-foreground">Aktive jobber</div>
                      <div className="text-xs text-muted-foreground mt-1">Åpne eller pågående</div>
                    </div>
                    <TrendingUp className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-primary">{stats.completedJobs}</div>
                      <div className="text-sm text-gray-600">Fullførte jobber</div>
                      <div className="text-xs text-gray-500 mt-1">Alle godkjente jobber</div>
                    </div>
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-secondary">{stats.totalApplications}</div>
                      <div className="text-sm text-muted-foreground">Totale søknader mottatt</div>
                      <div className="text-xs text-muted-foreground mt-1">Fra alle arbeidstakere</div>
                    </div>
                    <Users className="w-8 h-8 text-secondary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-primary">{stats.acceptedApplications}</div>
                      <div className="text-sm text-gray-600">Godkjente søknader</div>
                      <div className="text-xs text-gray-500 mt-1">Søknader som ble godkjent</div>
                    </div>
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-amber-600">{stats.pendingApplications}</div>
                      <div className="text-sm text-gray-600">Ventende søknader</div>
                      <div className="text-xs text-gray-500 mt-1">Venter på svar</div>
                    </div>
                    <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-gray-600">{stats.rejectedApplications}</div>
                      <div className="text-sm text-gray-600">Avviste søknader</div>
                      <div className="text-xs text-gray-500 mt-1">Ikke valgt</div>
                    </div>
                    <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-secondary">{stats.averageRating.toFixed(1)}</div>
                      <div className="text-sm text-gray-600">Gjennomsnittlig vurdering</div>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(stats.averageRating) ? "text-secondary fill-current" : "text-gray-300"}`}
                          />
                        ))}
                        <span className="text-xs text-gray-500 ml-1">({stats.totalReviews})</span>
                      </div>
                    </div>
                    <Star className="w-8 h-8 text-secondary" />
                  </div>
                </CardContent>
              </Card>

              {/* Success rate card */}
              <Card>
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-primary">
                        {stats.totalApplications > 0 
                          ? Math.round((stats.acceptedApplications / stats.totalApplications) * 100)
                          : 0}%
                      </div>
                      <div className="text-sm text-gray-600">Akseptrate</div>
                      <div className="text-xs text-gray-500 mt-1">Godkjente av totalt mottatte</div>
                    </div>
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Worker Statistics */}
        {(stats.role === "worker" || stats.role === "both") && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Som arbeidstaker
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-secondary">{stats.totalApplications}</div>
                      <div className="text-sm text-muted-foreground">Søknader sendt</div>
                      <div className="text-xs text-muted-foreground mt-1">Totalt alle søknader</div>
                    </div>
                    <Users className="w-8 h-8 text-secondary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-primary">{stats.acceptedApplications}</div>
                      <div className="text-sm text-gray-600">Godkjente jobber</div>
                      <div className="text-xs text-gray-500 mt-1">Aksepterte eller fullførte</div>
                    </div>
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-primary">{stats.completedJobs}</div>
                      <div className="text-sm text-gray-600">Fullførte jobber</div>
                      <div className="text-xs text-gray-500 mt-1">Godkjent av arbeidsgiver</div>
                    </div>
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-primary">{stats.totalEarnings} kr</div>
                      <div className="text-sm text-muted-foreground">Totale inntekter</div>
                      <div className="text-xs text-muted-foreground mt-1">Fra fullførte jobber</div>
                    </div>
                    <DollarSign className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-amber-600">{stats.pendingApplications}</div>
                      <div className="text-sm text-gray-600">Ventende søknader</div>
                      <div className="text-xs text-gray-500 mt-1">Venter på svar</div>
                    </div>
                    <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-gray-600">{stats.rejectedApplications}</div>
                      <div className="text-sm text-gray-600">Avviste søknader</div>
                      <div className="text-xs text-gray-500 mt-1">Ikke valgt</div>
                    </div>
                    <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-secondary">{stats.averageRating.toFixed(1)}</div>
                      <div className="text-sm text-gray-600">Gjennomsnittlig vurdering</div>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(stats.averageRating) ? "text-secondary fill-current" : "text-gray-300"}`}
                          />
                        ))}
                        <span className="text-xs text-gray-500 ml-1">({stats.totalReviews})</span>
                      </div>
                    </div>
                    <Star className="w-8 h-8 text-secondary" />
                  </div>
                </CardContent>
              </Card>

              {/* Success rate card */}
              <Card>
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-primary">
                        {stats.totalApplications > 0 
                          ? Math.round((stats.acceptedApplications / stats.totalApplications) * 100)
                          : 0}%
                      </div>
                      <div className="text-sm text-gray-600">Suksessrate</div>
                      <div className="text-xs text-gray-500 mt-1">Godkjente søknader</div>
                    </div>
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </CardContent>
              </Card>

              {/* Average earnings per job */}
              <Card>
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-cyan-600">
                        {stats.completedJobs > 0 
                          ? Math.round(stats.totalEarnings / stats.completedJobs)
                          : 0} kr
                      </div>
                      <div className="text-sm text-gray-600">Gjennomsnitt per jobb</div>
                      <div className="text-xs text-gray-500 mt-1">Inntjening per fullført jobb</div>
                    </div>
                    <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Summary Card */}
        <Card className="bg-gradient-to-r from-secondary/10 to-purple-50 border-0">
          <CardContent className="py-8 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Din aktivitet på FLUS</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {stats.role === "employer" && "Takk for at du skaper arbeidsmuligheter! Dine jobber hjelper lokalsamfunnet å vokse."}
              {stats.role === "worker" && "Takk for ditt bidrag til lokalsamfunnet! Din arbeidskraft er verdifull."}
              {stats.role === "both" && "Takk for at du bidrar både som arbeidsgiver og arbeidstaker! Du er en viktig del av FLUS-fellesskapet."}
            </p>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
