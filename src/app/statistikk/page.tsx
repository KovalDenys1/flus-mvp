"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  totalEarnings: number;
  totalReviews: number;
  averageRating: number;
};

export default function StatistikkPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    loadStats();
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
          <div className="text-red-600">Feil: {error}</div>
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
          <Badge variant="secondary" className="text-sm">
            Rolle: {stats.role === "employer" ? "Arbeidsgiver" : stats.role === "worker" ? "Arbeidstaker" : "Begge"}
          </Badge>
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
                      <div className="text-3xl font-bold text-blue-600">{stats.totalJobsCreated}</div>
                      <div className="text-sm text-gray-600">Totale jobber opprettet</div>
                    </div>
                    <Briefcase className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-orange-600">{stats.activeJobs}</div>
                      <div className="text-sm text-gray-600">Aktive jobber</div>
                    </div>
                    <TrendingUp className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-green-600">{stats.completedJobs}</div>
                      <div className="text-sm text-gray-600">Fullførte jobber</div>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-purple-600">{stats.totalApplications}</div>
                      <div className="text-sm text-gray-600">Totale søknader mottatt</div>
                    </div>
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-teal-600">{stats.acceptedApplications}</div>
                      <div className="text-sm text-gray-600">Godkjente søknader</div>
                    </div>
                    <CheckCircle className="w-8 h-8 text-teal-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-yellow-600">{stats.averageRating.toFixed(1)}</div>
                      <div className="text-sm text-gray-600">Gjennomsnittlig vurdering</div>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(stats.averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                          />
                        ))}
                        <span className="text-xs text-gray-500 ml-1">({stats.totalReviews})</span>
                      </div>
                    </div>
                    <Star className="w-8 h-8 text-yellow-600" />
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
                      <div className="text-3xl font-bold text-blue-600">{stats.totalApplications}</div>
                      <div className="text-sm text-gray-600">Søknader sendt</div>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-green-600">{stats.acceptedApplications}</div>
                      <div className="text-sm text-gray-600">Godkjente jobber</div>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-orange-600">{stats.totalEarnings} kr</div>
                      <div className="text-sm text-gray-600">Total inntjening</div>
                    </div>
                    <DollarSign className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-yellow-600">{stats.averageRating.toFixed(1)}</div>
                      <div className="text-sm text-gray-600">Gjennomsnittlig vurdering</div>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(stats.averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                          />
                        ))}
                        <span className="text-xs text-gray-500 ml-1">({stats.totalReviews})</span>
                      </div>
                    </div>
                    <Star className="w-8 h-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Summary Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
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
