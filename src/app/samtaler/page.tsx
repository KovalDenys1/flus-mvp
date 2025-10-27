
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Conversation } from "@/lib/chat-db";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Job = {
  id: string;
  title: string;
  desc: string;
  category: string;
  payNok: number;
  durationMinutes: number;
  areaName: string;
};

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [jobs, setJobs] = useState<Record<string, Job>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [convRes, jobsRes] = await Promise.all([
          fetch("/api/conversations"),
          fetch("/api/jobs"),
        ]);
        
        if (!convRes.ok || !jobsRes.ok) {
          throw new Error("Kunne ikke hente data");
        }
        
        const convData = await convRes.json();
        const jobsData = await jobsRes.json();
        
        setConversations(convData.conversations || []);
        
        const jobsMap: Record<string, Job> = {};
        (jobsData.jobs || []).forEach((job: Job) => {
          jobsMap[job.id] = job;
        });
        setJobs(jobsMap);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "En ukjent feil oppstod.";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Dine samtaler</h1>
        <div className="space-y-4">
          {/* Skeleton loader */}
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4 text-center">
        <h1 className="text-3xl font-bold mb-6">Dine samtaler</h1>
        <p className="text-red-500">Kunne ikke laste samtaler: {error}</p>
        <p className="mt-2 text-gray-600">
          Det kan hende du ikke er logget inn.{" "}
          <Link href="/login" className="underline text-blue-600">
            Logg inn
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="mb-6">
        <div className="border border-blue-200 rounded-lg bg-blue-50 text-blue-900 text-sm shadow p-4">
          <p className="font-semibold mb-1">💬 Demo-samtaler</p>
          <p>Dette er demo-samtaler for å utforske chat-funksjonen. De er ikke ekte og blir ikke lagret i en database.</p>
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-6">Mine samtaler</h1>
      {conversations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Du har ingen samtaler ennå.</p>
          <p className="mt-2 text-sm">
            Start en samtale ved å søke på en jobb og klikk &quot;Søk&quot;.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {conversations.map((convo) => {
            const job = jobs[convo.job_id];
            return (
              <Link key={convo.id} href={`/samtaler/${convo.id}`} className="block">
                <Card className="hover:shadow-lg hover:border-orange-300 transition-all duration-200 cursor-pointer border border-gray-200 bg-white">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                        {job?.title.charAt(0) || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg truncate">
                            {job?.title || `Jobb #${convo.job_id}`}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {job?.desc || "Ingen beskrivelse tilgjengelig"}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>📍 {job?.areaName || "Ukjent"}</span>
                          <span>💰 {job?.payNok || "?"} NOK</span>
                          <span className="ml-auto">
                            {new Date(convo.created_at).toLocaleDateString("no-NO", { day: "numeric", month: "short" })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
