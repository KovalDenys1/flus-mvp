"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestLoginPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const loginAs = async (userId: string, description: string) => {
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
        alert("Login failed");
      }
    } catch (error) {
      alert("Login error: " + error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Test Login - Chat Testing</CardTitle>
          <CardDescription>
            Use different browsers/tabs to test chat between users
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => loginAs("test_employer_1", "Employer")}
            disabled={loading === "test_employer_1"}
            className="w-full"
            variant="default"
          >
            {loading === "test_employer_1" ? "Logging in..." : "Login as Employer"}
          </Button>

          <Button
            onClick={() => loginAs("test_worker_1", "Worker")}
            disabled={loading === "test_worker_1"}
            className="w-full"
            variant="outline"
          >
            {loading === "test_worker_1" ? "Logging in..." : "Login as Worker"}
          </Button>

          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Test Conversations:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Active job:</strong> test_conversation_chat (worker can complete & send photos)</li>
              <li><strong>Completed job:</strong> test_conversation_completed (employer can confirm)</li>
            </ul>
            <p><strong>Instructions:</strong></p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Login as Employer or Worker</li>
              <li>Go to /test-chat to test active job</li>
              <li>Change conversation ID in URL to test_conversation_completed for completed job</li>
              <li>Test buttons based on your role!</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}