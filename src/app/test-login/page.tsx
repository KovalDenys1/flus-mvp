"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestLoginPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const loginAs = async (userId: string) => {
    setLoading(userId);
    try {
      const response = await fetch("/api/auth/test-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        window.location.href = "/jobber";
      } else {
        alert("Innlogging feilet");
      }
    } catch (error) {
      alert("Innloggingsfeil: " + error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Testinnlogging - Chattesting</CardTitle>
          <CardDescription>
            Bruk forskjellige nettlesere/faner for å teste chat mellom brukere
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => loginAs("test_employer_1")}
            disabled={loading === "test_employer_1"}
            className="w-full"
            variant="default"
          >
            {loading === "test_employer_1" ? "Logger inn..." : "Logg inn som arbeidsgiver"}
          </Button>

          <Button
            onClick={() => loginAs("test_worker_1")}
            disabled={loading === "test_worker_1"}
            className="w-full"
            variant="outline"
          >
            {loading === "test_worker_1" ? "Logger inn..." : "Logg inn som jobbsøker"}
          </Button>

          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Testkonversasjoner:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Aktiv jobb:</strong> test_conversation_chat (jobbsøker kan fullføre og sende bilder)</li>
              <li><strong>Fullført jobb:</strong> test_conversation_completed (arbeidsgiver kan bekrefte)</li>
            </ul>
            <p><strong>Instruksjoner:</strong></p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Logg inn som arbeidsgiver eller jobbsøker</li>
              <li>Gå til /test-chat for å teste aktiv jobb</li>
              <li>Endre konversasjons-ID i URL til test_conversation_completed for fullført jobb</li>
              <li>Test knappene basert på din rolle!</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}