"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AuthGuard from "@/components/AuthGuard";

type User = { id: string; email: string; isWorker: boolean; isEmployer: boolean; navn?: string } | null;
type Stats = {
  role: string;
  // Employer stats
  totalJobsCreated: number;
  activeJobs: number;
  completedJobs: number;
  totalApplicationsReceived: number;
  acceptedApplications: number;
  // Worker stats
  totalApplicationsSent: number;
  acceptedJobs: number;
  completedJobsWorker: number;
  totalEarnings: number;
  // Common stats
  totalReviews: number;
  averageRating: number;
};
type RecentJob = { id: string; title: string; areaName: string; payNok: number; status: string };

export default function DashboardPage() {
  const [user, setUser] = useState<User>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        // Get user info
        const userRes = await fetch("/api/auth/me");
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData.user);
        }

        // Get stats if employer
        if (user?.isEmployer) {
          const statsRes = await fetch("/api/profile/stats");
          if (statsRes.ok) {
            const statsData = await statsRes.json();
            setStats(statsData.stats);
          }
        }

        // Get recent jobs/applications
        const jobsRes = await fetch("/api/jobs?limit=3");
        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          setRecentJobs(jobsData.jobs || []);
        }

      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user?.isEmployer, user?.isWorker]);

  if (loading) {
    return (
      <AuthGuard requireAuth={true}>
        <div className="max-w-6xl mx-auto mt-10 p-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requireAuth={true}>
      <div className="max-w-6xl mx-auto mt-10 p-4 space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-primary-foreground">
          <h1 className="text-3xl font-bold mb-2">
            Velkommen tilbake, {user?.navn || user?.email?.split('@')[0]}! 👋
          </h1>
          <p className="text-primary/80 text-lg">
            {user?.isWorker && user?.isEmployer
              ? "Du er både jobbsøker og arbeidsgiver"
              : user?.isWorker
              ? "Du er jobbsøker"
              : "Du er arbeidsgiver"
            }
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {user?.isWorker && (
            <Link href="/jobber">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-primary/20 hover:border-primary/30">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-3">🔍</div>
                  <h3 className="font-semibold text-gray-900">Finn jobber</h3>
                  <p className="text-sm text-gray-600 mt-1">Se tilgjengelige jobber</p>
                </CardContent>
              </Card>
            </Link>
          )}

          {user?.isEmployer && (
            <Link href="/jobber/ny">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-secondary/20 hover:border-secondary/30">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-3">➕</div>
                  <h3 className="font-semibold text-gray-900">Opprett jobb</h3>
                  <p className="text-sm text-gray-600 mt-1">Legg ut ny jobbannonse</p>
                </CardContent>
              </Card>
            </Link>
          )}

          <Link href="/samtaler">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">💬</div>
                <h3 className="font-semibold text-gray-900">Meldinger</h3>
                <p className="text-sm text-gray-600 mt-1">Chat med andre brukere</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/profil">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">👤</div>
                <h3 className="font-semibold text-gray-900">Min profil</h3>
                <p className="text-sm text-gray-600 mt-1">Administrer profil</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats and Achievements */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Employer Stats */}
          {user?.isEmployer && stats && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">💼</span>
                  Arbeidsgiver statistikk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-secondary/10 rounded-lg">
                    <div className="text-2xl font-bold text-secondary">{stats.totalJobsCreated}</div>
                    <div className="text-sm text-muted-foreground">Jobber opprettet</div>
                  </div>
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{stats.activeJobs}</div>
                    <div className="text-sm text-gray-600">Aktive jobber</div>
                  </div>
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{stats.completedJobs}</div>
                    <div className="text-sm text-gray-600">Fullførte jobber</div>
                  </div>
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{stats.totalApplicationsReceived}</div>
                    <div className="text-sm text-muted-foreground">Søknader mottatt</div>
                  </div>
                </div>
                <div className="mt-4">
                  <Link href="/statistikk">
                    <Button variant="outline" className="w-full">Se detaljer</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Worker Stats */}
          {user?.isWorker && stats && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">👷</span>
                  Jobbsøker statistikk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-secondary/10 rounded-lg">
                    <div className="text-2xl font-bold text-secondary">{stats.totalApplicationsSent}</div>
                    <div className="text-sm text-muted-foreground">Søknader sendt</div>
                  </div>
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{stats.acceptedJobs}</div>
                    <div className="text-sm text-gray-600">Godkjente jobber</div>
                  </div>
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{stats.completedJobsWorker}</div>
                    <div className="text-sm text-gray-600">Fullførte jobber</div>
                  </div>
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{stats.totalEarnings} kr</div>
                    <div className="text-sm text-muted-foreground">Total inntjening</div>
                  </div>
                </div>
                <div className="mt-4">
                  <Link href="/profil/worker">
                    <Button variant="outline" className="w-full">Se detaljer</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Jobs */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="text-2xl">📋</span>
                  {user?.isEmployer ? "Mine siste jobber" : "Tilgjengelige jobber"}
                </span>
                <Link href={user?.isEmployer ? "/mine-jobber" : "/jobber"}>
                  <Button variant="ghost" size="sm">Se alle</Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentJobs.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  {user?.isEmployer ? "Du har ingen jobber ennå" : "Ingen jobber tilgjengelig"}
                </p>
              ) : (
                <div className="space-y-3">
                  {recentJobs.slice(0, 3).map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div>
                        <h4 className="font-medium">{job.title}</h4>
                        <p className="text-sm text-gray-600">{job.areaName} • {job.payNok} kr</p>
                      </div>
                      <Badge variant={job.status === 'open' ? 'default' : 'secondary'}>
                        {job.status === 'open' ? 'Åpen' : 'Stengt'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}