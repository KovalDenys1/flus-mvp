"use client";

import { useEffect, useState } from "react";
import ChatClient from "@/components/ChatClient";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TestCompletedChatPage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => setUserId(data.user?.id || null))
      .catch(() => setUserId(null));
  }, []);

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Ikke logget inn</h1>
          <p className="mb-4">Vennligst logg inn først for å teste chat for fullført jobb</p>
          <Link href="/test-login">
            <Button>Gå til testinnlogging</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Test chat for fullført jobb - {userId}</h1>
          <div className="space-x-2">
            <Link href="/test-chat">
              <Button variant="outline">Chat for aktiv jobb</Button>
            </Link>
            <Link href="/test-login">
              <Button variant="outline">Bytt bruker</Button>
            </Link>
            <Link href="/jobber">
              <Button variant="outline">Tilbake til jobber</Button>
            </Link>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-yellow-800">
            <strong>Fullført jobb:</strong> Arbeidsgiver kan nå bekrefte arbeidets fullføring.
            {userId === 'test_employer_1' ? ' Du bør se en "Godkjenn arbeid"-knapp.' : ' Du bør se fullført status.'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <ChatClient conversationId="test_conversation_completed" />
        </div>
      </div>
    </div>
  );
}