
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Conversation, DEMO_CONVERSATION_JOB_ID } from "@/lib/data/conversations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchConversations() {
      try {
        const res = await fetch("/api/conversations");
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.statusText}`);
        }
        const data = await res.json();
        setConversations(data.conversations || []);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "An unknown error occurred.";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchConversations();
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
      {/* Demo info table */}
      <div className="mb-4">
        <table className="w-full border border-yellow-200 rounded-lg bg-yellow-50 text-yellow-900 text-sm shadow">
          <tbody>
            <tr>
              <td className="p-3 font-semibold">Demo-samtaler</td>
              <td className="p-3">Dette er demo-samtaler for å utforske chat-funksjonen. De er ikke ekte og blir ikke lagret i en database.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h1 className="text-3xl font-bold mb-6">Dine samtaler</h1>
      {conversations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Du har ingen samtaler ennå.</p>
          <p className="mt-2">
            Start en samtale ved å søke på en jobb.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {conversations.map((convo) => (
            <Link key={convo.id} href={`/samtaler/${convo.id}`} passHref>
              <Card className="hover:bg-gray-50 transition cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Samtale om Jobb #{convo.jobId.substring(0, 8)}...
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      Startet: {new Date(convo.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-2">
                      {convo.jobId === DEMO_CONVERSATION_JOB_ID && (
                        <Badge variant="outline">Demo</Badge>
                      )}
                      <Badge variant="secondary">Åpen</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
