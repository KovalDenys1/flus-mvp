
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import AuthGuard from "@/components/AuthGuard";

type Job = {
  id: string;
  title: string;
  description: string;
  category: string;
  pay_nok: number;
  duration_minutes: number;
  area_name: string;
  status: string;
};

type User = {
  id: string;
  navn: string;
  email: string;
  photo_url?: string;
  role: "employer" | "worker";
};

type LastMessage = {
  id: string;
  text_content: string;
  message_type: string;
  created_at: string;
  sender_id: string;
};

type EnrichedConversation = {
  id: string;
  job_id: string;
  worker_id: string;
  employer_id: string;
  created_at: string;
  updated_at: string;
  job: Job | null;
  otherUser: User | null;
  lastMessage: LastMessage | null;
  isCurrentUserWorker: boolean;
};

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<EnrichedConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const convRes = await fetch("/api/conversations");
        
        if (!convRes.ok) {
          throw new Error("Kunne ikke hente data");
        }
        
        const convData = await convRes.json();
        setConversations(convData.conversations || []);
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
      <div className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Dine samtaler</h1>
        <div className="space-y-4">
          {/* Skeleton loader */}
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
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
    <AuthGuard requireAuth={true}>
      <div className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Mine samtaler</h1>
        {conversations.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-5xl mb-4">💬</div>
            <p className="text-gray-600 font-medium mb-2">Du har ingen samtaler ennå</p>
            <p className="text-sm text-gray-500">
              Start en samtale ved å søke på en jobb og klikk &quot;Søk&quot;.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((convo) => {
              const job = convo.job;
              const otherUser = convo.otherUser;
              const lastMessage = convo.lastMessage;
              
              // Get initials for avatar fallback
              const getInitials = (name?: string, email?: string) => {
                if (name) {
                  const names = name.split(' ');
                  return names.length > 1 
                    ? `${names[0][0]}${names[1][0]}`.toUpperCase()
                    : name.substring(0, 2).toUpperCase();
                }
                return email ? email.substring(0, 2).toUpperCase() : '?';
              };

              // Format last message preview
              const getLastMessagePreview = () => {
                if (!lastMessage) return "Ingen meldinger ennå";
                if (lastMessage.message_type === "photo") return "📷 Bilde";
                if (lastMessage.message_type === "system") return "🔔 Systemmelding";
                return lastMessage.text_content || "Melding";
              };

              // Format time
              const formatTime = (dateString: string) => {
                const date = new Date(dateString);
                const now = new Date();
                const diff = now.getTime() - date.getTime();
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                
                if (days === 0) {
                  return date.toLocaleTimeString("no-NO", { hour: "2-digit", minute: "2-digit" });
                } else if (days === 1) {
                  return "I går";
                } else if (days < 7) {
                  return `${days} dager siden`;
                } else {
                  return date.toLocaleDateString("no-NO", { day: "numeric", month: "short" });
                }
              };

              return (
                <Link key={convo.id} href={`/samtaler/${convo.id}`} className="block">
                  <Card className="hover:shadow-lg hover:border-orange-300 transition-all duration-200 cursor-pointer border border-gray-200 bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <Avatar className="w-14 h-14 flex-shrink-0 border-2 border-gray-100">
                          <AvatarImage src={otherUser?.photo_url} alt={otherUser?.navn} />
                          <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white font-semibold">
                            {getInitials(otherUser?.navn, otherUser?.email)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          {/* User name and role */}
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-base truncate">
                              {otherUser?.navn || otherUser?.email || "Ukjent bruker"}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {otherUser?.role === "employer" ? "Arbeidsgiver" : "Arbeidstaker"}
                            </Badge>
                          </div>

                          {/* Job title */}
                          <p className="text-sm font-medium text-gray-700 truncate mb-1">
                            {job?.title || `Jobb #${convo.job_id}`}
                          </p>

                          {/* Last message preview */}
                          <p className="text-sm text-gray-500 truncate mb-2">
                            {getLastMessagePreview()}
                          </p>

                          {/* Job details */}
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                              {job?.area_name || "Ukjent"}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                              </svg>
                              {job?.pay_nok || "?"} kr
                            </span>
                            {job?.status && (
                              <Badge 
                                variant={
                                  job.status === "completed" ? "default" : 
                                  job.status === "assigned" ? "secondary" : 
                                  "outline"
                                }
                                className="text-xs"
                              >
                                {job.status === "open" ? "Åpen" :
                                 job.status === "assigned" ? "Pågår" :
                                 job.status === "completed" ? "Fullført" : job.status}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Timestamp */}
                        <div className="text-xs text-gray-400 flex-shrink-0">
                          {formatTime(lastMessage?.created_at || convo.updated_at)}
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
    </AuthGuard>
  );
}
