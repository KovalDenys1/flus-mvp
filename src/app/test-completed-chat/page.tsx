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
          <h1 className="text-2xl font-bold mb-4">Not Logged In</h1>
          <p className="mb-4">Please login first to test completed job chat</p>
          <Link href="/test-login">
            <Button>Go to Test Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Test Completed Job Chat - {userId}</h1>
          <div className="space-x-2">
            <Link href="/test-chat">
              <Button variant="outline">Active Job Chat</Button>
            </Link>
            <Link href="/test-login">
              <Button variant="outline">Switch User</Button>
            </Link>
            <Link href="/jobber">
              <Button variant="outline">Back to Jobs</Button>
            </Link>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-yellow-800">
            <strong>Completed Job:</strong> Employer can now confirm work completion.
            {userId === 'test_employer_1' ? ' You should see a "Godkjenn arbeid" button.' : ' You should see the completed status.'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <ChatClient conversationId="test_conversation_completed" />
        </div>
      </div>
    </div>
  );
}